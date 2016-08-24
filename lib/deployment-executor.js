const path = require('path');
const Deployment = require('../data').Deployment;
const async = require('async');

class DeploymentExecutor {
  constructor(socket) {
    this._socket = socket;
    this._runningDeployments = {};
  }
  executeDeployment(deployment) {
    const deploymentId = deployment._id;
    const socketChannel = `/deployments/${deploymentId}`;

    const runningDeployment = {
      deployment,
      products: this._loadProducts(deployment),
    };
    this._runningDeployments[deploymentId] = runningDeployment;

    this._socket.emit(socketChannel, {message: 'deployment_started'});
    const startedDeployment = this._mgDeploymentStart(deployment);

    async.series(runningDeployment.products.map((product, idx) => {
      return (done) => {
        this._socket.emit(socketChannel, {message: 'step_started', task: product.type});
        this._mgStepStarted(deployment, idx);

        const productEmitter = product.run(deployment.steps[idx].options);

        const progressHandler = (update) => {
          const fixedProgress = update.progress.toFixed(2);
          this._socket.emit(socketChannel, {
            message: 'progress',
            task: product.type,
            progress: fixedProgress
          });
          this._mgStepProgress(deployment, idx, fixedProgress);
        };
        productEmitter.on('progress', progressHandler);

        const errorHandler = () => {
          this._turnOffListeners(productEmitter);
          done({task: product.type, error: `ERROR: Task ${product.type} emitted an error.`});
        };
        productEmitter.on('error', errorHandler);

        const doneHandler = () => {
          this._turnOffListeners(productEmitter);
          this._socket.emit(socketChannel, {message: 'step_done', task: product.type});
          this._mgStepDone(deployment, idx);
          done(null);
        };
        productEmitter.on('done', doneHandler);

        this._currentHandlers = [
          {name: 'progress', handler: progressHandler},
          {name: 'error', handler: errorHandler},
          {name: 'done', handler: doneHandler}
        ];
      }
    }), (err) => {
      if(err) {
        this._socket.emit(socketChannel, {message: 'error', error: err});
      }

      delete this._runningDeployments[deploymentId];
      this._socket.emit(socketChannel, {message: 'deployment_done'});
      this._mgDeploymentDone(deployment);
    });

    return startedDeployment;
  }
  _mgDeploymentStart(deployment) {
    return this._mgStatus(deployment, 'started');
  }
  _mgStepStarted(deployment, idx) {
    const step = deployment.steps[idx];
    const startedStep = Object.assign(step, {progress: 0});
    deployment.steps[idx] = startedStep;
    Deployment.update(deployment._id, deployment);
  }
  _mgStepProgress(deployment, idx, progress) {
    const step = deployment.steps[idx];
    const progressStep = Object.assign(step, {progress});
    deployment.steps[idx] = progressStep;
    Deployment.update(deployment._id, deployment);
  }
  _mgStepDone(deployment, idx) {
    const step = deployment.steps[idx];
    const doneStep = Object.assign(step, {progress: 1});
    deployment.steps[idx] = doneStep;
    Deployment.update(deployment._id, deployment);
  }
  _mgDeploymentDone(deployment) {
    this._mgStatus(deployment, 'done');
  }
  _mgStatus(deployment, status) {
    const update = {status};
    const updatedDeployment = Object.assign(deployment, update);
    Deployment.update(deployment._id, updatedDeployment);
    return updatedDeployment;
  }
  _turnOffListeners(emitter) {
    this._currentHandlers.forEach((hh) => emitter.removeListener(hh.name, hh.handler));
  }
  _loadProducts(deployment) {
    return deployment.steps.map(step => {
      const modulePath = path.join(__dirname, 'deployment-step', step.type, step.type);
      let module;
      try {
        module = require(modulePath);
      } catch(error) {
        throw {
          message: `ERROR: Could not dynamically load ${modulePath}`,
          error: error
        };
      }
      return module;
    })
  }
}

module.exports = DeploymentExecutor;
