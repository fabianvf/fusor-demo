const express = require('express');
const router = express.Router();
const Deployment = require('../data').Deployment;

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
  Deployment.find(req.params.id).then(deployment => {
    console.log('executing...', deployment._id);
    res.status(200);
    res.json({foo: deployment._id})
  }).catch(error => {
    return res.status(500).send(JSON.stringify(error));
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

    return res.render('deployments/steps/show', {
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
    return res.status(500).send(JSON.stringify(error));
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

router.post('/:id/steps', function(req, res, next) {
  //TODO break out the steps into it's own collection and use Mongoose.
  Deployment.find(req.params.id).then(deployment => {
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
    return res.status(500).send({error: JSON.stringify(error)});
  });
});

router.get('/', function(req, res, next) {
  Deployment.find().then(deployments => {
    return res.render('deployments/index', {deployments});
  }).catch(error => {
    return res.status(500).send({error: JSON.stringify(error)});
  });
});

router.post('/', function(req, res, next){
  Deployment.insert({status: 'new', steps: []}).then(deployment => {
    return res.redirect(`${deployment._id.toString()}`);
  }).catch(error => {
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

module.exports = router;
