var express = require('express');
var router = express.Router();
var authorizenet = require('../model/authorizenet');
var netsuite = require('../model/netsuite');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.query);
  res.render('authorizenet', { 
                                title: 'Checkout', 
                                description: req.query.description, 
                                amount: req.query.amount,
                                merchantid: req.query.merchantid,
                                invoiceid: req.query.invoiceid,
                                producttype: "Invoice #"
  });
});

//Post definitions
router.post('/', function (req, res) {
  const body = req.body;
  console.log("Transaction payment: ", body);

  var payment_transaction = new authorizenet.transaction();
  
  var callback = (result) => {
    res.json(result);
  }

  payment_transaction.card(req.body.bill, req.body.invoice, req.body.cc, callback);
});

router.post('/visa_src', function(req, res){
  var callback = (result) => {
    console.log("Result:", result);
    res.json(result);
  }

  const body = req.body;
  console.log("Visa src: ", body);

  new authorizenet.transaction().visasrc.decrypt(body, callback);
});

router.post('/push_netsuite', function(req, res){
  var body = req.body;
  console.log(body);

  var nsdata = new netsuite.suiteletCall().push(body);

  res.json(nsdata);
});

module.exports = router;