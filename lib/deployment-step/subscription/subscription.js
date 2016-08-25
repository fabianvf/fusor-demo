const DeploymentStep = require('../deployment-step');
const EventEmitter = require('events');

const Subscription = Object.assign({}, DeploymentStep, {
  type: 'subscription',
  run: (deploymentOpt) => {
    const emitter = new EventEmitter();
    console.log('running sub');

    let ticks = 0;
    const tickCount = 11;
    const period = 500;

    const interval = setInterval(() => {
      if(ticks === tickCount) {
        clearInterval(interval);
        emitter.emit('done');
      }

      const progress = ticks++ / tickCount;
      emitter.emit('progress', {progress});

    }, period);

    return emitter;
  }
});

module.exports = Subscription;
