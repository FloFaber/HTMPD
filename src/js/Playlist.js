class Playlist{

  refresh(){
    $.get({
      url: window.WEBROOT + "/api/playlist.php",
      success: (r) => {
        $("div#split-left").html(window.templates.playlists({
          playlists: r.playlists,
        }));
      }
    });
  }

  create(){
    let name = prompt("Name for new playlist:");
    if(!name){ return; }
    $.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "create", "name": name },
      success: (r) => {
        this.refresh();
      }
    })
  }

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

  delete(name){
    if(confirm("Delete playlist '"+name+"'")){
      $.post({
        url: window.WEBROOT + "/api/playlist.php",
        data: { "action": "delete", "name": name },
        success: (r) => {
          this.refresh();
        }
      })
    }
  }

}