var express = require('express');
var router = express.Router();

// Open Basex Server
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

function renderPage(req, res, docTitle, content) {
  res.render('view', {title: "View Document",
                      docTitle: docTitle,
                      content: content});
}


function queryDatabase(req, res) {

  var xquery_string = "XQUERY declare default element namespace" + 
                      "'http://www.tei-c.org/ns/1.0'; ";

  var query = xquery_string + "doc('Colenso"+ req.path + "')";

  client.execute(query, function(error, result) {
    if (error) {
      console.error(error);
      console.log(query);
    } else {
      renderPage(req, res, req.path, result.result);
    }
  });
}


/* GET home page. */
router.get("/*",function(req,res){
  queryDatabase(req, res);
});


module.exports = router;