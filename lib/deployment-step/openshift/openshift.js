const EventEmitter = require('events');

const calculatePostInstallState = function (preInstallState, options) {
  let validation = validate(preInstallState, options);
  if (!validation.valid) {
    return preInstallState;
  }

  let postInstallState = preInstallState;

  if (!postInstallState.openshiftInstances) {
    postInstallState.openshiftInstances = [];
  }

  postInstallState.subscriptions.openshift--;
  postInstallState.openshiftInstances = postInstallState.openshiftInstances.concat(options.openshiftInstances);
  let firstHypervisor = postInstallState.rhvInstances[0];
  firstHypervisor.ram -= 32;

  return postInstallState;
};

const validate = function (preInstallState, options) {
  let errors = [];
  let warnings = [];

  if (!options || !options.openshiftInstances) {
    errors.push('No OpenShift instances to deploy');
  }

  if (!preInstallState.rhvInstances || preInstallState.rhvInstances.length <= 0) {
    errors.push('No hypervisor available');
  }

  let lastHypervisor = preInstallState.rhvInstances[0];
  if (lastHypervisor.ram < 32) {
    errors.push('Not enough ram available');
  }

  let valid = errors.length === 0;
  return {valid, errors, warnings}
};

const run = function (options) {
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
};

const additionalFunctions = {
  generateFakeOptions: function (preInstallState) {
    return {
      openshiftInstances: [
        {
          name: 'ose_' + getRandomIntInclusive(0, 9999),
          role: 'master',
          ram: 16
        },
        {
          name: 'ose_' + getRandomIntInclusive(0, 9999),
          role: 'worker',
          ram: 16
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