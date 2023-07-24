function playlist_refresh(){
  $.get({
    url: window.WEBROOT + "/api/playlist.php",
    success: function (r) {
      console.log(r);
    }, error: function (r) {
      notification(NOTYPE_ERR, r);
    }
  });
}

playlist_refresh();