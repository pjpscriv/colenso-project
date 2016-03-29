var express = require('express');
var router = express.Router();

// Open Basex Server
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

String.prototype.format = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};


function renderPage() {

}


function queryDatabase(req, res) {

  var input = req.query.fileSrc;

  var query = "ADD TO "+path+" "+input;

  client.execute(query, function(error, result) {
    if (error) {
      console.error(error);
      console.log(query);
    } else {
      renderPage(req, res, result.result);
    }
  });
}


/* GET home page. */
router.get("/",function(req,res){

  res.render('upload', {title: "Upload"});
});


module.exports = router;