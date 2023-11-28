class Library{

  add(uri, replace = false, callback = function(){}){
    $.post({
      url: window.WEBROOT + "/api/queue.php",
      data: { "action": (replace ? "replace" : "add"), uri: uri },
      success: function(r){
        notification(NOTYPE_SUCC, "loaded \"" + uri + "\".");
        callback(r);
      }, error: function(r){
        notification(NOTYPE_ERR, r);
      }
    })
  }

}

function library_add(uri, replace= false, rerender= true){

  let cb = function(){};
  if(rerender){
    cb = function(){
      window.queue.refresh();
    }
  }

  window.library.add(uri, replace, cb)

}

$("button#db-update").on("click", function (){
  $.post({
    url: window.WEBROOT + "/api/library.php",
    data: {
      action: "update"
    },
    success: function(r){
      console.log(r);
      notification(NOTYPE_SUCC, "Updating DB with Job #" + r.job);
    },
    error: function(r){ notification(NOTYPE_ERR, r) }
  })
});
