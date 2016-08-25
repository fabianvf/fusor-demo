const DeploymentStep = require('../deployment-step');
const EventEmitter = require('events');

const Rhv = Object.assign({}, DeploymentStep, {
  type: 'rhv',
  run: (deploymentOpt) => {
    console.log('running, ', 'rhv');
    const emitter = new EventEmitter();

    let ticks = 0;
    const tickCount = 20;
    const period = 350;

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

module.exports = Rhv;
