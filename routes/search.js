var express = require('express');
var router = express.Router();

// Open Basex Server

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

// GET What the user requested 
router.get("/",function(req,res){
  
  var command = "";
  var xquery_string = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; ";

  if (req.query.xquery_box || req.query.basex_box) {

    if (req.query.xquery_box) {
      command = xquery_string + req.query.xquery_box
    } else {
      command = req.query.basex_box;
    }

    client.execute(command, 
      function (error, result) {
        if(error) {
          console.error(error);
        } else {
          res.render('search', { title: "Search", query: command, result: result.result});
        }
      }
    );

  } else {
    res.render('search', {title: "Search", query: "none", result: "none"});
  }
});

module.exports = router;
