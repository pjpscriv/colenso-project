var express = require('express');
var router = express.Router();

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home Page yo' });
});
*/

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

router.get("/",function(req,res){
  /*
  if (!req.isInterger()) {
    req = 1;
  }
  */
  /*
  console.log("req object info");
  console.log(typeof req);
  console.log(req);
  */
  client.execute("XQUERY declare default element namespace "+
                 "'http://www.tei-c.org/ns/1.0'; " +
                 "(//name[@type='place'])[1]",
    function (error, result) {
      if(error) {
        console.error(error);
      } else {
        res.render('index', { title: "Home!", 
                              type: typeof req, 
                              reqthing: req,
                              info: result.result });
      }
    }
  );
});


module.exports = router;
