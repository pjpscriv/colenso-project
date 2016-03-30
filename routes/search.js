var express = require('express');
var router = express.Router();

// Open Basex Server
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

// String format function
String.prototype.format = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};



// Renders page given: folder list, 
function renderPage(req, res, xqQuery, xqResult, strQuery, strResult) {
  res.render('search', {title: "Search",
                        xqquery: xqQuery, 
                        strquery: strQuery,
                        xqresult: xqResult,
                        strresult: strResult});
}

// Creates the string for the String literal results to render
function makeResultLinks(result) {
  var fileArray = result.split('\n');
  var fileString = '';

  for (var i = 0; i < fileArray.length; i++) {
    var item = fileArray[i];
    var tag = '<li class=list-group-item>\n'+
                '<a href="/view/{0}">'+
                  '{0}'+
                '</a>\n'+
              '</li>\n';
    tag = tag.format(item);

    fileString = fileString + tag;
  }
  return fileString;
}

//
function makeXqueryResults(result) {

  var resultArray = result.split('\n');
  var fileMap = new Map();
  var resultsString = '';

  for (var i = 0; i < resultArray.length; i++) {
    var file = resultArray[i];
    if (!fileMap.has(file)) {
      // Insert into Map
      fileMap.set(file, 1);
    } else {
      // Increment Count
      fileMap.set(file, fileMap.get(file) + 1);
    }
  }

  for (var file of fileMap.keys()) {
    tag = '<li class=list-group-item><span class="badge">{1}</span>\n'+
          '  <a href="/view/{0}">{0}</a>\n'+
          '</li>\n';
    tag = tag.format(file, fileMap.get(file))

    resultsString += tag;
  }
  return resultsString;
}


function renderTextBoxQuery(req, res) {
  var title = "Search";
  var command = "none"
  var result = "none";
  var xquery_string = "XQUERY declare default element namespace " + 
                      "'http://www.tei-c.org/ns/1.0'; ";

  if (req.query.xquery_box || req.query.string_box) {
    
    // XQuery Box Search
    if (req.query.xquery_box) {
      command = xquery_string + "for $x in " + req.query.xquery_box + 
      " return db:path($x)";

      client.execute(command, function (error, result) {
        if(error) {
          console.error(error);
          renderPage(req, res, command, error, "none", "none");
        } else {
          var resultString = makeXqueryResults(result.result);
          renderPage(req, res, command, resultString, "none", "none");
        }
      });

    // String Box Search
    } else {
      command = xquery_string + "\nfor $v in .//TEI[. contains text (" + 
                                 req.query.string_box + 
                                 ") using wildcards] \nreturn db:path($v)";

      command = command.replace(new RegExp("AND", "g"), "ftand");
      command = command.replace(new RegExp("OR", "g"), "ftor");
      command = command.replace(new RegExp("NOT", "g"), "ftnot");


      client.execute(command, function (error, result) {
        if(error) {
          console.error(error);
          renderPage(req, res, "none", "none", command, error);
        } else {
          var resultString = makeResultLinks(result.result)
          renderPage(req, res, "none", "none", command, resultString);
        }
      });
    } 

  // No Search Query
  } else {
    renderPage(req, res, command, result);
  }
}




// Render the Page
router.get("/",function(req,res){
  renderTextBoxQuery(req, res);
});

module.exports = router;
