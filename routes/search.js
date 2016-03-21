var express = require('express');
var router = express.Router();

// Open Basex Server
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");


function setFolders(folder_set) {
  client.execute("LIST Colenso",
    function(error, result) {

      //  Declare new variables
      var folders = new Map();
      var array = [];

      if(error) {
        console.error(error);
      } else {

        array = result.result.split("\n");

        // Add directories to Map
        for (var i = 2; i < array.length-3; i++) {
          var item = array[i];
          var slash_index = item.search("/");
          var name = item.slice(0,slash_index);

          // Adding to Map done here
          if (folders.has(name)) {
            folders.set(name, folders.get(name) + 1);
          } else {
            folders.set(name, 1);
            folder_set.push(name);
          }
        }
      }
    console.log("INT: "+folder_set);
    }
  );
}


var FOLDERS = [];

// Render the Page
router.get("/",function(req,res){
  
  //var folders = []
  setFolders(FOLDERS);
  console.log("Ext: " + FOLDERS);

  var title = "Search";
  var command = "none"
  var result = "none";
  var xquery_string = "XQUERY declare default element namespace" + 
                      "'http://www.tei-c.org/ns/1.0'; ";

  // If there is a Text Box Query
  if (req.query.xquery_box || req.query.basex_box) {
    if (req.query.xquery_box) {
      // In the XQuery Box
      command = xquery_string + req.query.xquery_box;
      client.execute(command, 
        function (error, result) {
          if(error) {
            console.error(error);
          } else {
            res.render('search', {title: "Search",
                                  folders: FOLDERS, 
                                  query: command, 
                                  result: result.result});
          }
      });
    } else {
      // in the BaseX Box
      command = req.query.basex_box;
      client.execute(command, 
        function (error, result) {
          if(error) {
            console.error(error);
          } else {
            res.render('search', {title: "Search",
                                  folders: FOLDERS, 
                                  query: command, 
                                  result: result.result});
          }
      });
    }
  // No Text Box Query
  } else {
    res.render('search', {title: "extra", 
                          folders: FOLDERS,
                          query: command, 
                          result: result});
  }
});

module.exports = router;
