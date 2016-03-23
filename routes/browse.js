var express = require('express');
var router = express.Router();

// Open Basex Server
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

// Renders page given: folder list
function renderPage(req, res, folders) {
  res.render('browse', {title: "Browse",
                        folders: folders});
}


function renderFolders(req, res) {

  var command = "Colenso";

  if (req.path in fileArray)

  client.execute("LIST Colenso", function(error, result) {

      var fileArray = [];

      var folderMap = new Map();
      var folderArray = [];
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
            var item = '<li>\n  <a href="/'+name+'">'+name.replace("_", " ")+"</a>\n</li>\n";
            folderStr = folderStr + item;
            folderArray.push("/"+name);
          }
        }
      }
      renderPage(req, res, folderStr);
    }
  );
}



/* GET users listing. */
router.get('/*', function(req, res) {
  console.log(req.path);
  renderFolders(req, res);
});

module.exports = router;
