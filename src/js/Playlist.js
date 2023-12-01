class Playlist{

  load(name){
    $.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "load", "name": name },
      success: (r) => {
        window.queue.refresh();
      }
    })
  }

  replace(name){
    $.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "replace", "name": name },
      success: (r) => {
        window.queue.refresh();
      }
    })
  }

}