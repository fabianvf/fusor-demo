const express = require('express');
const router = express.Router();
const Deployment = require('../data').Deployment;
const DeploymentSteps = {
  cfme: require('../lib/deployment-step/cfme/cfme'),
  host: require('../lib/deployment-step/host/host'),
  openshift: require('../lib/deployment-step/openshift/openshift'),
  openstack: require('../lib/deployment-step/openstack/openstack'),
  rhv: require('../lib/deployment-step/rhv/rhv'),
  subscription: require('../lib/deployment-step/subscription/subscription'),
  unspecified: require('../lib/deployment-step/unspecified/unspecified')
};
const DeploymentExecutor = require('../lib/deployment-executor');

router.get('/:id/review', function(req, res, next) {
  Deployment.find(req.params.id).then(deployment => {
    let formattedSteps = [];
    if (deployment.steps) {
      formattedSteps = deployment.steps.map((step, index) => formatStep(step, index, deployment, 0));
    }

    return res.render('deployments/review', {
      deploymentName: deployment.name || 'New Deployment',
      deployment: deployment,
      formattedSteps: formattedSteps,
      scripts: ['tabs.js', 'review.js']
    });
  }).catch(error => {
    return res.status(500).send(JSON.stringify(error));
  })
});

router.post('/:id/execute', function(req, res, next) {
  const io = require('../socket-client').getConnection();
  const executor = new DeploymentExecutor(io);

  Deployment.find(req.params.id).then(deployment => {
    const runningDeployment = executor.executeDeployment(deployment);
    if(!runningDeployment) {
      throw { error: 'Something went wrong starting the deployment.' };
    }

    res.status(201);
    res.json({deployment: runningDeployment})
  }).catch(error => {
    return res.status(500).send(JSON.stringify(error));
  })
});

router.post('/:id/reset', function(req, res, next) {
  const io = require('../socket-client').getConnection();
  const executor = new DeploymentExecutor(io);

  Deployment.find(req.params.id).then(deployment => {
    deployment.steps = deployment.steps.map(step => Object.assign(step, {progress: 0}));
    deployment.status = 'new';
    return Deployment.update(deployment._id, deployment).then(result => {
      res.status(200);
      res.json({deployment})
    });
  }).catch(error => {
    console.log(error);
    return res.status(500).send(JSON.stringify(error));
  })
});

router.get('/:id/steps/:humanStepIndex', function(req, res, next) {
  const humanStepIndex = parseInt(req.params.humanStepIndex, 10);
  let scripts = ['tabs.js', 'deployment-step-client.js'];
  let styles = [];
  Deployment.find(req.params.id).then(deployment => {
    if (!deployment.steps) {
      res.redirect(req.params.id);
    }

    let stepIndex = humanStepIndex - 1;
    let currentStep = deployment.steps[stepIndex];
    scripts.push(`/deployments/steps/${currentStep.type}-client.js`);
    styles.push(`/deployments/steps/${currentStep.type}-client.css`);
    let formattedSteps = deployment.steps.map((step, index) => formatStep(step, index, deployment, humanStepIndex));
    let preInstallState = calculatePreInstallState(deployment, stepIndex);
    let options = currentStep.options;
    let postInstallState = calculatePostInstallState(deployment, stepIndex);
    let validation = validate(deployment, stepIndex, preInstallState);

    let fusorVars = { preInstallState, options,  postInstallState, validation };

    return res.render('deployments/steps/show', {
      isUnspecified: !currentStep.type || currentStep.type === 'unspecified',
      deploymentName: deployment.name || 'New Deployment',

      deployment: deployment,
      formattedSteps: formattedSteps,
      currentStep: currentStep,
      humanStepIndex: humanStepIndex,
      styles: styles,
      scripts: scripts,
      fusorVars: JSON.stringify(fusorVars)
    });
  }).catch(error => {
    console.log(error);
    return res.status(500).send(JSON.stringify(error));
  })
});

router.put('/:id/steps/:humanStepIndex', function(req, res, next) {
  const deploymentId = req.params.id;
  const humanStepIndex = parseInt(req.params.humanStepIndex, 10);
  Deployment.find(req.params.id).then((deployment) => {
    let currentStep = deployment.steps[humanStepIndex - 1];
    currentStep.type = req.body.type;
    currentStep.options = generateFakeOptions(currentStep);
    return Deployment.update(deploymentId, deployment);
  }).then(result => {
    return res.redirect(humanStepIndex);
  }).catch(error => {
    console.log(error);
    return res.status(500).send(JSON.stringify(error));
  })
});

router.post('/:id/steps', function(req, res, next) {
  //TODO break out the steps into it's own collection and use Mongoose.
  Deployment.find(req.params.id).then(deployment => {
    if (!deployment.steps) {
      deployment.steps  = [];
    }
    deployment.steps.push({type: 'unspecified', progress: 0});
    return new Promise((resolve, reject) => {
      Deployment.update(deployment._id, deployment).then(result => {
        let step = deployment.steps[deployment.steps.length - 1];
        step.humanIndex = deployment.steps.length;
        resolve(step);
      }).catch(error => {
        reject(error);
      });
    });
  }).then(step => {
    return res.status(201).send({step});
  }).catch(error => {
    console.log(error);
    return res.status(500).send(error);
  });
});

router.get('/:id', function(req, res, next) {
  Deployment.find(req.params.id).then(deployment => {
    let formattedSteps = [];
    if (deployment.steps) {
      formattedSteps = deployment.steps.map((step, index) => formatStep(step, index, deployment, 0));
    }

    if (req.accepts('html')) {
      return res.render('deployments/show', {
        deploymentName: deployment.name || 'New Deployment',
        deployment: deployment,
        formattedSteps: formattedSteps,
        scripts: ['tabs.js']
      });
    } else {
      return res.send({deployment});
    }
  }).catch(error => {
    console.log(error);
    return res.status(500).send({error: JSON.stringify(error)});
  })
});

router.put('/:id', function(req, res, next){
  let deploymentId = req.params.id;
  Deployment.find(deploymentId).then(deployment => {
    deployment.name = req.body.name;
    deployment.description = req.body.description;
    return Deployment.update(deploymentId, deployment)
  }).then(deployment => {
    return res.redirect(deploymentId);
  }).catch(error => {
    console.log(error);
    return res.status(500).send({error: JSON.stringify(error)});
  });
});

router.get('/', function(req, res, next) {
  Deployment.find().then(deployments => {
    return res.render('deployments/index', {deployments});
  }).catch(error => {
    console.log(error);
    return res.status(500).send({error: JSON.stringify(error)});
  });
});

router.post('/', function(req, res, next){
  Deployment.insert({status: 'new', steps: []}).then(deployment => {
    return res.redirect(`${deployment._id.toString()}`);
  }).catch(error => {
    console.log(error);
    return res.status(500).send({error: JSON.stringify(error)});
  });
});

function formatStep(step, index, deployment, humanStepIndex) {
  let formattedStep = Object.assign({}, step);

  formattedStep.deploymentId = deployment._id;
  formattedStep.humanIndex = index + 1;
  formattedStep.current = humanStepIndex === formattedStep.humanIndex;
  formattedStep.tabName = getTabName(formattedStep);

  return formattedStep;
}

function getTabName(formattedStep) {
  switch (formattedStep.type) {
  case 'subscription':
    return 'Subscriptions';
  case 'host':
    return 'Hosts';
  case 'rhv':
    return 'RHV';
  case 'openstack':
    return 'OpenStack';
  case 'openshift':
    return 'OpenShift';
  case 'cfme':
    return 'CloudForms';
  default:
    return `Step ${formattedStep.humanIndex}`;
  }
}

function calculatePreInstallState(deployment, stepIndex) {
  return calculatePostInstallState(deployment, stepIndex - 1);
}

function calculatePostInstallState(deployment, stepIndex) {
  let postInstallState = {};

  if (!deployment.steps) {
    return postInstallState;
  }

  for (let i = 0; i <= stepIndex; i++) {
    let step = deployment.steps[i];
    let stepFunctions = DeploymentSteps[step.type];
    postInstallState = stepFunctions.calculatePostInstallState(clone(postInstallState), step.options);
  }

  return postInstallState;
}

function validate(deployment, stepIndex, preInstallState) {
  if (!deployment.steps) {
    return {};
  }

  let step = deployment.steps[stepIndex];

  if (!step) {
    return {};
  }

  return DeploymentSteps[step.type].validate(preInstallState, step.options);
}

function generateFakeOptions(step) {
  let stepFunctions = DeploymentSteps[step.type];

  if (!stepFunctions || !stepFunctions.additionalFunctions || !stepFunctions.additionalFunctions.generateFakeOptions) {
    return {};
  }

  return stepFunctions.additionalFunctions.generateFakeOptions();
}

function clone(cloneable) {
  return JSON.parse(JSON.stringify(cloneable));
}

module.exports = router;
