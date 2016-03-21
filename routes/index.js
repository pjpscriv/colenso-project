var express = require('express');
var router = express.Router();

// Open Basex Server DON'T NEED TO HERE!!!!!

// GET home page.

router.get("/",function(req,res){
  res.render('index', {title: "Home!"});
});


module.exports = router;
