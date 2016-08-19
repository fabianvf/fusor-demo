const express = require('express');
const router = express.Router();
const Deployment = require('../data').Deployment;

/* GET deployments listing. */
router.get('/', function(req, res, next) {
  res.render('deployments/index', { });
});

router.get('/:id', function(req, res, next) {
  Deployment.find(req.params.id).then((deployment) => {
    res.render('deployments/show', { deploymentId: deployment._id.toString() });
  }).catch(error => {
    res.status(500);
  })
});

router.post('/', function(req, res, next){
  Deployment.insert({}).then(deployment => {
    res.redirect(`${deployment._id.toString()}`);
  }).catch(error => {
    res.status(500);
  });
});

module.exports = router;
