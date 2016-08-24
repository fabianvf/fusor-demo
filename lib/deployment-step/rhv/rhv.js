const EventEmitter = require('events');

const calculatePostInstallState = function (preInstallState, options) {
  let validation = validate(preInstallState, options);
  if (!validation.valid) {
    return preInstallState;
  }

  let postInstallState = preInstallState;

  if (!postInstallState.rhvInstances) {
    postInstallState.rhvInstances = [];
  }

  // TODO add consumed hosts and check for them in the hosts module
  // if (!postInstallState.consumedHosts) {
  //   postInstallState.consumedHosts = [];
  // }

  options.newInstances.forEach(instance => {
    let rhv = postInstallState.availableHosts.pop();
    instance.ram = rhv.ram;
    instance.cpu = rhv.cpu;
    postInstallState.rhvInstances.push(instance);
    // postInstallState.consumedHosts.push(postInstallState.availableHosts.pop());
    postInstallState.subscriptions.rhv--;
  });

  return postInstallState;
};

const validate = function (preInstallState, options) {
  let errors = [];
  let warnings = [];

  if (!options || !options.newInstances) {
    errors.push('No hosts selected to deploy');
  }

  if (!preInstallState.availableHosts || preInstallState.availableHosts.length <= 0) {
    errors.push('No available hosts');
  }

  if (!preInstallState.subscriptions || !preInstallState.subscriptions.rhv || preInstallState.subscriptions.rhv < options.newInstances.length) {
    errors.push('Not enough available subscriptions');
  }

  let valid = errors.length === 0;
  return {valid, errors,  warnings}
};

const run = function (options) {
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
};

const additionalFunctions = {
  generateFakeOptions: function (preInstallState) {
    return {
      newInstances: [
        {
          name: 'rhv_' + getRandomIntInclusive(0, 9999)
        }
      ]
    }
  }
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = {calculatePostInstallState, validate, run, additionalFunctions};