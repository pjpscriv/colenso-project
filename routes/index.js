var express = require('express');
var router = express.Router();

// Open Basex Server
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");



// GET home page.
router.get("/",function(req,res){
  res.render('index', {title: "Home!"});
});


router.get("/download/*", function(req, res) {

  var path = req.path.slice(9);
  var query = "XQUERY doc('Colenso"+path+"')";

  client.execute(query, function(error, result){
    if (error){
      console.log("ERROR");
      console.log(error);
    }
    else {
      var file = result.result;
      var fileName = path;
      res.writeHead(200, {'Content-Disposition': 'attachment; filename=' + fileName,});
      res.write(file);
      res.end();
    }
  });
});

module.exports = router;