const calculatePostInstallState = function (preInstallState, options) {
  return preInstallState;
};

const validate = function (preInstallState, options) {
  return {
    valid: false,
    errors: ['Nothing to do.  Please specify a deployment step type.'],
    warnings: []
  };
};

const run = function (options) {
  //Can't run.
};

const additionalFunctions = {};

module.exports = {calculatePostInstallState, validate, run, additionalFunctions};