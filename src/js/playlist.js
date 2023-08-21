function playlists_refresh(){
  $("div#playlist-items").text("");
  $("h3#playlist-name").text("");
  $.get({
    url: window.WEBROOT + "/api/playlist.php",
    success: function (r) {
      let s = "";
      for(let i = 0; i < r.playlists.length; i++){
        let p = r.playlists[i];
        s += `
          <div class="playlist-item">
            <span class="playlist-item-actions">
              <button class="playlist-add inline green" title="Load Playlist" data-playlist="${p}">+</button>
              <button class="playlist-replace inline yellow" title="Clear queue and load playlist" data-playlist="${p}">~</button>
              <button class="playlist-delete inline red" title="Delete Playlist" data-playlist="${p}">-</button>
            </span>
            <span class="playlist-item-name"><a class="playlist-item-name" href="#list:${p}">${p}</a></span>
          </div>
        `;
      }
      $("div#playlists").html(s);

      $("button.playlist-add").on("click", function(){
        playlist_load($(this).data("playlist"));
      });

      $("button.playlist-replace").on("click", function(){
        playlist_replace($(this).data("playlist"));
      });

      $("button.playlist-delete").on("click", function(){
        playlist_delete($(this).data("playlist"));
      });

    }, error: function (r) {
      notification(NOTYPE_ERR, r);
    }
  });
}

function playlist_show(name){

  $.get({
    url: window.WEBROOT + "/api/playlist.php",
    data: { "action": "show", "name": name },
    success: function (r) {
      $("h3#playlist-name").text(name);
      let s = "";
      for(let i = 0; i < r.songs.length; i++){
        let so = r.songs[i];
        s += `
          <div class="playlist-item">
            <span class="playlist-item-actions">
              <button class="playlist-add inline green" title="Load song into queue" data-uri="${so.file}">+</button>
            </span>
            <span class="playlist-item-name" title="${so.file}" data-uri="${so.file}">${so.file.split("/").pop()}</span>
          </div>
        `;
      }

      if(r.songs.length === 0){
        s = "This playlist seems rather empty."
      }

      $("div#playlists").html("");
      $("div#playlist-items").html(s);

      $("button.playlist-add").on("click", function(){
        $.post({
          url: window.WEBROOT + "/api/queue.php",
          data: { "action": "add", "uri": $(this).data("uri") },
          success: function(r){
            notification(NOTYPE_SUCC, "Song loaded into Queue.");
          },error: function(r){
            notification(NOTYPE_ERR, r);
          }
        })
      });

      $("span.playlist-item-name").on("click", function(){
        $.post({
          url: window.WEBROOT + "/api/queue.php",
          data: { "action": "add_id", "uri": $(this).data("uri"), "play": 1 },
          success: function(r){
            player_refresh();
          },error: function(r){
            notification(NOTYPE_ERR, r);
          }
        })
      });



    }, error: function (r) {
      notification(NOTYPE_ERR, r);
    }
  });

}


function playlist_load(name){
  $.post({
    url: window.WEBROOT + "/api/playlist.php",
    data: { "action": "load", "name": name },
    success: function(r){
      notification(NOTYPE_SUCC, "Playlist loaded into Queue.");
    }, error: function(r){
      notification(NOTYPE_ERR, r);
    }
  });
}

function playlist_replace(name){
  $.post({
    url: window.WEBROOT + "/api/playlist.php",
    data: { "action": "replace", "name": name },
    success: function(r){
      notification(NOTYPE_SUCC, "Cleared Queue and loaded Playlist.");
    }, error: function(r){
      notification(NOTYPE_ERR, r);
    }
  });
}

function playlist_delete(name){
  if(confirm("Delete playlist '"+name+"'?")){
    $.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "delete", "name": name },
      success: function(r){
        notification(NOTYPE_SUCC, "Playlist deleted.");
      }, error: function(r){
        notification(NOTYPE_ERR, r);
      }
    });
  }
}


let list = hash_parse()["list"];
if(list){
  playlist_show(list);
}else{
  playlists_refresh();
}

$(window).on("hashchange", function(e){
  let list = hash_parse()["list"];
  if(list){
    playlist_show(list);
  }else{
    playlists_refresh();
  }
});