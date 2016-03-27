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

// Returns a Map of directory name: file counts
function getfolderMap(fileArray, depth) {



}

// Gets the correct folder view or the given address
function renderFolders(req, res, dirPath, dirDepth) {

  client.execute("LIST Colenso "+dirPath, function(error, result) {

      // PART 1/2 -  SEE WHERE YOU ARE

      var fileArray = [];
      var folderMap = new Map();
      var folderArray = [];
      var folderStr = "";

      console.log("\n");


      if(error) {
        console.error(error);
      } else {
        // Add directories to Map and Array
        fileArray = result.result.split("\n");

        for (var i = 2; i < fileArray.length - 3; i++) {

          var item = fileArray[i];
          var cut_index = item.indexOf("/");
          var space_index = item.indexOf(" ");
          var depth = 0;

          while (depth < dirDepth) {
            cut_index = item.indexOf("/", (cut_index+1));
            //console.log("cut "+depth+": "+(cut_index;
            depth++;
          }

          if (space_index < cut_index) {
            var nameList = item.split(" ");
            var name = "/" + nameList[0];
            console.log("- FILE!, File?");
          } else {
            var name = "/"+item.slice(0, cut_index);
            console.log("- FOLDER: "+cut_index+", "+space_index);
          }

          if (folderMap.has(name)) {
            // Name is already in Map or...
            folderMap.set(name, folderMap.get(name) + 1);
          } else {
            // ...Insert name into Map for first time
            folderMap.set(name, 1);
            var tag = '<li>\n  <a href="/browse'+name+'">'+name.slice(1).replace(new RegExp("_", "g"), " ")+"</a>\n</li>\n";
            folderStr = folderStr + tag;
            folderArray.push(name);
            console.log("Insert in Map  :   "+name);
          }
        }
      }


      // PART 2/2 - FIGURE OUT WHERE YOU NEED TO GO

      
      console.log("\nPATH: "+req.path);
      console.log("DIRPATH: "+dirPath+"\n");
      

      var isStart = false;
      var isEqual = false;
      var dirName = "";
      var i = 0;
      
      while (!isEqual && i < folderArray.length) {
        
        if ((req.path !== "/") && req.path.startsWith(folderArray[i])) {
          isStart = true;
          dirName = folderArray[i];

          if (req.path === dirName) {
            isEqual = true;
          }
        }
        console.log(folderArray[i]+" : "+req.path);
        console.log("    start: "+isStart+"\n    equal: "+isEqual);
        i++;
      }


      if (dirPath === req.path) {
        // YOU ARE WHERE YOU'RE MENT TO BE! folderStr is Correct!!!
        renderPage(res, res, folderStr);
        console.log("\nRENDERED!!! SUCC!!!\n");

      } else if (isEqual) {
          renderFolders(req, res, dirName, dirDepth+1);

      } else if (isStart) {
        renderFolders(req, res, dirName, dirDepth+1);
          
      } else {
          console.log("NOT FOUND!!");
      }
    }
  );
}



/* GET users listing. */
router.get('/*', function(req, res) {
  renderFolders(req, res, "/", 0);
});

module.exports = router;
