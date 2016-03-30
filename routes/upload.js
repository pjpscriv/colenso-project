var express = require('express');
var router = express.Router();

// Open Basex Server
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");


function renderPage(req, res, message) {

  res.render('upload', {title: "Upload",
                        message: message});
}


function addToDatabase(req, res) {

  if (req.query.fileSrc) {

    var input = req.query.fileSrc;
    var path = req.query.fileDest;
    //var path = /added/;

    var query = "ADD TO "+path+" "+input;

    client.execute(query, function(error, result) {
      if (error) {
        console.error(error);
        renderPage(req, res, error);
      } else {
        console.log("SUCC! RES: ", result.result)
        var message = "Success!\nFile: '" + input + "'' added to database at location: '" + path +"'";
        renderPage(req, res, message);
      }
    });
  } else {
    renderPage(req, res, "No file detected");
  }
}


/* GET home page. */
router.get("/",function(req,res){
  addToDatabase(req, res);
});


module.exports = router;