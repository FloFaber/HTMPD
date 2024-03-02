function show_playlists(r){

  if(!r.playlists.length){
    $("p#no-playlists").show();
    return;
  }

  let playlists = [];
  r.playlists.forEach((playlist, i) => {
    playlists.push({
      name: playlist
    });
  })
  console.log(playlists);

  (new Table({

    id: "playlists",
    parent: $("div#playlists"),
    heads: [{
      title: "",
      attr: "name"
    }],
    itemActions: [
      {
        title: "Load",
        text: "+",
        onclick: (item) => (new Playlist(item.name)).load({ clear: false })
      },{
        title: "Replace",
        text: "~",
        onclick: (item) => (new Playlist(item.name)).load({ clear: true })
      }
    ],
    topActions: [
      {
        title: "Create new playlist",
        text: "create",
        onclick: () => {
          let name = prompt("Name?");
          if(name){
            (new Playlist(name)).create({
              success: () => {
                notification(NOTYPE_SUCC, "Playlist '" + htmlspecialchars(name) + "'created");
                (new Playlist()).getAll({
                  success: show_playlists
                })
              },
              error: () => notification(NOTYPE_ERR, "Playlist creation failed"),
              clear: true
            });
          }
        }
      },{
        title: "Delete selected playlists",
        text: "delete",
        onclick: (items) => {
          let pls = [];
          items.forEach((item, i) => {
            pls.push(item.name);
          });
          if(pls.length && confirm(`Delete ${pls.length} playlist${(pls.length > 1 ? "s" : "")}?`)){
            pls.forEach((pl, i) => {
              (new Playlist(pl)).delete({
                success: () => {
                  (new Playlist()).getAll({ success: show_playlists });
                }
              });
            });
          }
        }
      },{
        title: "Rename selected playlist",
        text: "Rename",
        onclick: (items) => {
          if(items.length !== 1){ return; }
          let name = prompt("New Name:", items[0].name);
          (new Playlist(items[0].name)).rename({
            name: name,
            success: () => {
              (new Playlist()).getAll({success: show_playlists});
            }
          });
        }
      }
    ],
    onItemClick: (item) => {
      window.location.hash = "view=playlists&playlist=" + item.name;
    }

  }, playlists)).render();

}


function show_playlist(name, r){
  $("h2#playlist").text(name);

  if(!r.songs.length) {
    $("p#no-songs").show();
    return;
  }

  for(let i = 0; i < r.songs.length; i++){
    r.songs[i].pos = i;
  }

  let playlist = new Playlist(name);

  (new Table({
    id: "playlist",
    parent: $("div#playlists"),
    heads: [{
      title: "Title",
      attr: "title",
      attr_fb: "file"
    },{
      title: "Artist",
      attr: "artist"
    }],
    topActions: [
      {
        title: "Add URI to playlist",
        text: "add uri",
        onclick: () => {
          let uri = prompt("URI?");
          if(!uri){ return; }
          playlist.add({
            uris: [uri],
            success: (r) => {
              playlist.get({ success: show_playlist });
            }
          });
        }
      },{
        title: "Remove selected items from playlist",
        text: "remove",
        onclick: (items) => {
          if(items.length && confirm("Remove " + items.length + " songs from '" + name + "'?")){
            let poss = [];
            items.forEach(item => {
              poss.push(item.pos);
            });

            playlist.remove({
              positions: poss,
              success: (r) => {
                playlist.get({ success: show_playlist });
              }
            });

          }
        }
      }
    ],
    itemActions: [
      {
        title: "Load",
        text: "+",
        onclick: (item) => window.queue.add({ uri: item.file, replace: false, success: update_queue })
      },{
        title: "Replace",
        text: "~",
        onclick: (item) => window.queue.add({ uri: item.file, replace: true, success: update_queue })
      }
    ],
    onItemClick: (item) => window.queue.add_id({ uri: item.file, play: true, success: update_queue })
  }, r.songs)).render();

  let pos_old;
  let pos_new;
  $("table#playlist").sortable({
    cursor: 'row-resize',
    placeholder: 'ui-state-highlight',
    opacity: '0.55',
    items: 'tr.item',
    helper:'clone', // fix for #2
    start: function(event, item){
      pos_old = $(item.item).index()-1;
    }, stop: (event, item) => {
      pos_new = $(item.item).index()-1;
      console.log(pos_old, pos_new);
      (new Playlist(name)).move({ from: pos_old, to: pos_new });
    }
  }).disableSelection();
}


function select_playlist(cb = null, preselect = ""){

  if(typeof cb === "function") {
    window.select_playlist_cb = cb;
  }

  (new Playlist()).getAll({
    success: r => {
      $("div#darkness").load(window.WEBROOT + "/themes/" + window.THEME + "/html/playlist-selection.html", () => {
        if (r.playlists.length) {
          r.playlists.forEach((playlist, i) => {
            $("select#playlist").append(`
            <option value="${playlist}">${playlist}</option>
          `);
          });

          if ($("select#playlist > option[value='" + preselect + "']").length) {
            $("select#playlist").val(preselect);
          }

          $("form#playlist-selection").on("submit", function (e) {
            if (typeof cb === "function") {
              cb($('select#playlist').val());
            }

            // hack
            if (cb === null && typeof window.select_playlist_cb === "function") {
              window.select_playlist_cb($('select#playlist').val());
            }

            e.stopPropagation();
            e.preventDefault();
            return false;
          });

        } else {
          $("form#playlist-selection").hide();
          $("p#no-playlists").show();
        }

      }).css("display", "flex");
    }
  });


}