const EventEmitter = require('events');

const calculatePostInstallState = function (preInstallState, options) {
  let validation = validate(preInstallState, options);
  if (!validation.valid) {
    return preInstallState;
  }

  let postInstallState = preInstallState;

  if (!postInstallState.availableHosts) {
    postInstallState.availableHosts = [];
  }

  postInstallState.availableHosts = postInstallState.availableHosts.concat(options.hosts);
  return postInstallState;
};

const validate = function (preInstallState, options) {
  let errors = [];
  let warnings = [];

  if (!options || !options.hosts) {
    errors.push('No hosts registered');
  }

  let valid = errors.length === 0;
  return {valid, errors,  warnings}
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
  generateFakeOptions: function () {
    return {
      hosts: [
        {
          name: 'host_' + getRandomIntInclusive(0, 9999),
          ram: 32,
          cpu: 4
        },
        {
          name: 'host_' + getRandomIntInclusive(0, 9999),
          ram: 32,
          cpu: 4
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