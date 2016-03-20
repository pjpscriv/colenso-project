var found = new Map();
var res_arr = [];

client.execute("LIST Colenso",
  function(error, result) {

    if(error) {
      console.error(error);
    
    } else {
      found = new Map();
      res_arr = result.result.split("\n");

    }
  }
);

for (var i = 0; i < res_arr.length; i++) {
  var item = res_arr[i];
  var slash_index = item.search("/");
  var name = item.slice(0,slash_index);

  if (found.has(name)) {
    found.set(name, found.get(name) + 1);
  } else {
    found.set(name, 1);
  }
}

for (var key of found.keys()) {
  console.log(key+" : "+found.get(key));
}

console.log("And thus it was done.");
console.log("ATIWD");