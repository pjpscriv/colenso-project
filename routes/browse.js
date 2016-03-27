var express = require('express');
var router = express.Router();

/* Open Basex Server */
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


/* Renders page given: folder list */
function renderPage(req, res, folders) {
  res.render('browse', {title: "Browse",
                        folders: folders});
}


/* Gets the correct folder view or the given address */
function renderFolders(req, res, dirPath, dirDepth) {

  client.execute("LIST Colenso "+dirPath, function(error, result) {
      
      if(error) {
        console.error(error);
      } else {

        // PART 1/2 -  SEE WHERE YOU ARE
        console.log("\n");
        var fileArray = result.result.split("\n");
        var folderMap = new Map();
        var folderArray = [];
        var folderStr = "";

        // Add folders to Map, Array and Str
        for (var i = 2; i < fileArray.length - 3; i++) {

          var line = fileArray[i];
          var name = "";
          var isFile = false;
          var slash_index = line.indexOf("/");
          var space_index = line.indexOf(" ");

          for (var depth = 0; depth < dirDepth; depth++) {
            slash_index = line.indexOf("/", (slash_index+1));
          }

          if (space_index < slash_index) {
            isFile = true;
            name = "/" + line.slice(0, space_index);
            //console.log("- FILE!, File?");
          } else {
            name = "/" + line.slice(0, slash_index);
            //console.log("- FOLDER: "+slash_index+", "+space_index);
          }


          if (!folderMap.has(name)) {
            // Insert into Map
            if (isFile) {
              folderMap.set(name, 'file');
            } else {
              folderMap.set(name, 1);
            }
            folderArray.push(name);
          } else {
            // Increment Count
            folderMap.set(name, folderMap.get(name) + 1);
          }
        }
      }

      // Create folderStr
      for (var folder of folderMap.keys()) {
        var start = "/browse";
        if (folderMap.get(folder) === 'file') {
          start = "/view";
        }

        var tag = '<li>\n  '+
                    '<a href="{0}{1}">'+
                      '{2}<span class="badge">{3}</span>'+
                    '</a>\n'+
                  '</li>\n';

        tag = tag.format(start,
                         folder, 
                         folder.slice(1).replace(new RegExp("_", "g"), " "),
                         folderMap.get(folder));

        folderStr = folderStr + tag;
        console.log("Insert in Map  :   "+folder);
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
