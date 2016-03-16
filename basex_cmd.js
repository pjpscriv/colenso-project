client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
               " //name[@type = 'place']",
  function(error, result) {
    if(error) {
      console.error(error);
    } else {
      console.log(result.result);
      console.log("OK  :"+result.ok);
      console.log("Info:"+result.info.trim());
      
      console.log("And thus it was done.");
    }
  }
);

client.execute("LIST .", function(e, r) { if(!e) console.log(r.result)})