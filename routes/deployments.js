const express = require('express');
const router = express.Router();
const Deployment = require('../data').Deployment;

/* GET deployments listing. */
router.get('/', function(req, res, next) {
  Deployment.find().then(deployments => {
    console.log(deployments);
    res.render('deployments/index', {deployments});
  }).catch(error => {
    res.status(500).send(error);
  });
});

router.post('/:deploymentId/steps', function(req, res, next) {
  //TODO break out the steps into it's own collection and use Mongoose.
  Deployment.find(req.params.deploymentId).then(deployment => {
    if (!deployment.steps) {
      deployment.steps  = [];
    }
    deployment.steps.push({type: 'unspecified'});
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
      res.render('deployments/show', {
        deploymentName: deployment.name || 'New Deployment',
        deployment: deployment,
        formattedSteps: formattedSteps,
        scripts: ['tabs.js']
      });
    } else {
      res.send({deployment});
    }
  }).catch(error => {
    res.status(500).send({error: JSON.stringify(error)});
  })
});

router.get('/:id/review', function(req, res, next) {
  Deployment.find(req.params.id).then(deployment => {
    let formattedSteps = [];
    if (deployment.steps) {
      formattedSteps = deployment.steps.map((step, index) => formatStep(step, index, deployment, 0));
    }

    res.render('deployments/review', {
      deploymentName: deployment.name || 'New Deployment',
      deployment: deployment,
      formattedSteps: formattedSteps,
      scripts: ['tabs.js']
    });
  }).catch(error => {
    res.status(500).send(JSON.stringify(error));
  })
});

router.get('/:id/steps/:humanStepIndex', function(req, res, next) {
  const humanStepIndex = parseInt(req.params.humanStepIndex, 10);
  let scripts = ['tabs.js'];
  let styles = [];
  Deployment.find(req.params.id).then(deployment => {
    if (!deployment.steps) {
      res.redirect(req.params.id);
    }

    let currentStep = deployment.steps[humanStepIndex - 1];
    scripts.push(`/deployments/steps/${currentStep.type}-client.js`);
    let formattedSteps = deployment.steps.map((step, index) => formatStep(step, index, deployment, humanStepIndex));

    res.render('deployments/steps/show', {
      isUnspecified: !currentStep.type || currentStep.type === 'unspecified',
      deploymentName: deployment.name || 'New Deployment',
      deployment: deployment,
      formattedSteps: formattedSteps,
      currentStep: currentStep,
      humanStepIndex: humanStepIndex,
      styles: styles,
      scripts: scripts
    });
  }).catch(error => {
    res.status(500).send(JSON.stringify(error));
  })
});

router.put('/:id/steps/:humanStepIndex', function(req, res, next) {
  const deploymentId = req.params.id;
  const humanStepIndex = parseInt(req.params.humanStepIndex, 10);
  Deployment.find(req.params.id).then((deployment) => {
    let currentStep = deployment.steps[humanStepIndex - 1];
    currentStep.type = req.body.type;
    return Deployment.update(deploymentId, deployment);
  }).then(result => {
    return res.redirect(humanStepIndex);
  }).catch(error => {
    return res.status(500).send(JSON.stringify(error));
  })
});

router.post('/', function(req, res, next){
  Deployment.insert({status: 'new', steps: []}).then(deployment => {
    res.redirect(`${deployment._id.toString()}`);
  }).catch(error => {
    res.status(500).send(error);
  });
});

router.put('/:id', function(req, res, next){
  Deployment.update(req.params.id, req.body).then(deployment => {
    res.redirect(req.params.id);
  }).catch(error => {
    res.status(500).send(error);
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
  }}

module.exports = router;
