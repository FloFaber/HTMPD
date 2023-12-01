class Library{

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
