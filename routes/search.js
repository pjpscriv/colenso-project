var express = require('express');
var router = express.Router();

// Open Basex Server
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

// Renders page given: folder list, 
function renderPage(req, res, folders, query, result) {
  res.render('search', {title: "Search",
                        folders: folders, 
                        query: query, 
                        result: result});
}


function renderTextBoxQuery(req, res, folders) {
  var title = "Search";
  var command = "none"
  var result = "none";
  var xquery_string = "XQUERY declare default element namespace" + 
                      "'http://www.tei-c.org/ns/1.0'; ";

  if (req.query.xquery_box || req.query.basex_box) {
    if (req.query.xquery_box) {
      // In the XQuery Box
      command = xquery_string + req.query.xquery_box;

      client.execute(command, function (error, result) {
        if(error) {
          console.error(error);
        } else {
          renderPage(req, res, folders, command, result.result);
        }
      });
    } else {
      // in the BaseX Box
      command = req.query.basex_box;

      client.execute(command, function (error, result) {
        if(error) {
          console.error(error);
        } else {
          renderPage(req, res, folders, command, result.result);
        }
      });
    }
  } else {
    // No Text Box Query
    renderPage(req, res, folders, command, result);
  }
}


function renderFolders(req, res) {
  client.execute("LIST Colenso", function(error, result) {

      //  Declare new variables
      var folderMap = new Map();
      var array = [];
      var folderStr = "";

      if(error) {
        console.error(error);
      } else {

        // Add directories to Map
        array = result.result.split("\n");
        for (var i = 2; i < array.length-3; i++) {
          var item = array[i];
          var slash_index = item.search("/");
          var name = item.slice(0,slash_index);

          // Adding to Map done here
          if (folderMap.has(name)) {
            folderMap.set(name, folderMap.get(name) + 1);
          } else {
            folderMap.set(name, 1);
            var item = "<li>\n  <a href='#'>"+name+"</a>\n</li>\n";
            folderStr = folderStr + item;
          }
        }
      }
      renderTextBoxQuery(req, res, folderStr);
    }
  );
}


// Render the Page
router.get("/",function(req,res){
  renderFolders(req, res);
});

module.exports = router;
