var express = require('express');
// var app = express();
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Authorize.net Integration' });
});

module.exports = router;
