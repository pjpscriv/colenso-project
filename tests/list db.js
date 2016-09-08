client.execute("LIST .", 
  function(e, r) { 
    if(!e) {
      console.log(r.result)
    }
  }
)