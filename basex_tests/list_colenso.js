client.execute("LIST Colenso",
  function(error, result) {

    //  Declare new variables
    var folders = new Map();
    var array = [];
    var folder_set = [];

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
        }
      }

      /*// Print out the Counts
      for (var key of folders.keys()) {
        console.log(key+" : "+folders.get(key));
        folder_set.push(key);
      }*/
    }
  console.log(folder_set);
  return folder_set;
  }
);