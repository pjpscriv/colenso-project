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
  
  if (resultArray.length > 2) {
    var currentSrcFile = resultArray[0];
    var resultsString = '<li class=list-group-item>\n'+
                        '  <a href="/view/{0}">{0}</a>\n'.format(currentSrcFile)+
                        '</li>\n';
    resultsString += '<p>' + resultArray[1].replace(new RegExp("<","g")," ").replace(new RegExp(">","g")," ") + '</p>' + "\n";
  }
  //console.log(resultsString);
  var srcFile = '';
  for (var i = 2; i < resultArray.length; i += 2) {

    srcFile = resultArray[i];
    var line = resultArray[i+1];

    console.log('cuur: '+currentSrcFile, 'New: '+srcFile);
    if (srcFile === currentSrcFile) {
      resultsString += '<p>' + line.replace(new RegExp("<","g")," ").replace(new RegExp(">","g")," ") + '</p>' + "\n";
      
    } else {
      currentSrcFile = srcFile;
      var srcTag = '<li class=list-group-item>\n'+
                     '<a href="/view/{0}">{0}</a>\n'.format(srcFile)+
                   '</li>\n';
      resultsString += srcTag;
      resultsString += '<p>' + line.replace(new RegExp("<","g")," ").replace(new RegExp(">","g")," ") + '</p>' + "\n";
    }
  }
  resultsString += "</p>";
  //console.log(resultsString);
  return resultsString;
}


function renderTextBoxQuery(req, res) {
  var title = "Search";
  var command = "none"
  var result = "none";
  var xquery_string = "XQUERY declare default element namespace " + 
                      "'http://www.tei-c.org/ns/1.0'; ";

  if (req.query.xquery_box || req.query.string_box) {
    
    // In the XQuery Box
    if (req.query.xquery_box) {
      command = xquery_string + "for $x in " + req.query.xquery_box + " return (db:path($x), $x)";

      client.execute(command, function (error, result) {
        if(error) {
          console.error(error);
          renderPage(req, res, command, error, "none", "none");
        } else {
          resultString = makeXqueryResults(result.result);
          renderPage(req, res, command, resultString, "none", "none");
        }
      });

    // String Box
    } else {
      command = xquery_string + "\nfor $v in .//TEI[. contains text ('" + 
                                 req.query.string_box + 
                                 "') using wildcards] \nreturn db:path($v)";

      command = command.replace(new RegExp(" AND ", "g"), "' ftand '");
      command = command.replace(new RegExp(" OR ", "g"), "' ftor '");
      command = command.replace(new RegExp(" NOT ", "g"), "' ftnot '");

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
