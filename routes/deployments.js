var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('deployments/index', { });
});

router.get('/:id', function(req, res, next) {
  res.render('deployments/show', { });
});

router.post('/', function(req, res, next){

  //TODO persist something and use the ID
  var id = 1;
  res.redirect(`${id}`);
});

module.exports = router;
