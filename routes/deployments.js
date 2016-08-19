const express = require('express');
const router = express.Router();
const Deployment = require('../data').Deployment;

/* GET deployments listing. */
router.get('/', function(req, res, next) {
  Deployment.find().then((deployments) => {
    console.log(deployments);
    res.render('deployments/index', {deployments});
  }).catch(error => {
    res.status(500);
  });
});

router.get('/:id', function(req, res, next) {
  Deployment.find(req.params.id).then((deployment) => {
    res.render('deployments/show', {
      deploymentName: deployment.name || 'New Deployment',
      deployment: deployment
    });
  }).catch(error => {
    res.status(500);
  })
});

router.post('/', function(req, res, next){
  Deployment.insert({status: 'new'}).then(deployment => {
    res.redirect(`${deployment._id.toString()}`);
  }).catch(error => {
    res.status(500);
  });
});

router.put('/:id', function(req, res, next){
  Deployment.update(req.params.id, req.body).then(deployment => {
    res.redirect(req.params.id);
  }).catch(error => {
    res.status(500);
  });
});

module.exports = router;
