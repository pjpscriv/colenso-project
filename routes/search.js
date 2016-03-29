var express = require('express');
var router = express.Router();

// Open Basex Server
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

// Renders page given: folder list, 
function renderPage(req, res, query, result) {
  res.render('search', {title: "Search",
                        query: query, 
                        result: result});
}


function makeResultLinks(result) {
  var fileArray = result.split('\n');
  var fileString = '';

  for (var i = 0; i < fileArray.length; i++)
    var item = fileArray[i];

    var tag = '<li class=list-group-item>\n'+
                '<a href="/view/{0}">'+
                  '{0}'+
                '</a>\n'+
              '</li>\n';

tag = tag.format(start,
                 folder, 
                 folder.slice(1).replace(new RegExp("_", "g"), " "),
                 folderMap.get(folder));

folderStr = folderStr + tag;

}

function renderTextBoxQuery(req, res) {
  var title = "Search";
  var command = "none"
  var result = "none";
  var xquery_string = "XQUERY declare default element namespace" + 
                      "'http://www.tei-c.org/ns/1.0'; ";

  if (req.query.xquery_box || req.query.basex_box || req.query.string_box) {
    
    // In the XQuery Box
    if (req.query.xquery_box) {
      
      command = xquery_string + req.query.xquery_box;

      client.execute(command, function (error, result) {
        if(error) {
          console.error(error);
          renderPage(req, res, command, error);
        } else {
          renderPage(req, res, command, result.result);
        }
      });

    // String Thing
    } else if (req.query.string_box) {

      command = xquery_string + "for $v in .//TEI[. contains text " + 
                                 req.query.string_box + 
                                 "] return db:path($v)";

      client.execute(command, function (error, result) {
        if(error) {
          console.error(error);
          renderPage(req, res, command, error);
        } else {
          renderPage(req, res, command, result.result);
        }
      });

    // In the BaseX Box
    } else {
      
      command = req.query.basex_box;

      client.execute(command, function (error, result) {
        if(error) {
          console.error(error);
          renderPage(req, res, command, error);
        } else {
          renderPage(req, res, command, result.result);
        }
      });
    }

  // No Text Box Query
  } else {
    
    renderPage(req, res, command, result);
  }
}




// Render the Page
router.get("/",function(req,res){
  renderTextBoxQuery(req, res);
});

module.exports = router;
