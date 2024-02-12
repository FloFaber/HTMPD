window.db = new DB();
window.queue = new Queue();
window.player = new Player();
window.playlist = new Playlist();
window.settings = new Settings();

window.addEventListener("hashchange", function(e){
  load();
});
color_set(localStorage.getItem("color") || "#ff0066");

if(localStorage.getItem("colors") === null){
  color_save("#ff0066");
  color_save("#4c944d");
  color_save("#444444");
  color_save("#259d75");
  color_save("#2969d1");
}
load();

$("div#split-right").load(window.WEBROOT + "/themes/" + window.THEME + "/html/queue.html", function(){
  console.log("Loaded quque");
  window.queue.update();
}).on("scroll", () => {
  localStorage.setItem("scrollTop", $("div#split-right").scrollTop());
});

function volumeWheel(event, elem){
  if(event.deltaY < 0){ // up
    $(elem).val(parseInt($(elem).val()) + parseInt($(elem).attr("step")));
  }else{ // down
    $(elem).val(parseInt($(elem).val()) - parseInt($(elem).attr("step")));
  }
  $(elem).trigger("input");

  event.preventDefault();
  event.stopPropagation();
  return false;
}

function seekTo(event, element){
  if(typeof window.player.data.status.duration === "undefined"){ return; }

  let w = $(element).width();
  let offset_x = $(element).offset().left;
  let x = event.pageX - offset_x;
  let seek_to = Math.round(map(x, 0, w, 0, window.player.data.status.duration) * 100)/100;

  window.player.seek(seek_to);
}

// Keyboard Shortcuts
$(document).on("keypress", (e) => {

  $("button").blur(); // Fix #3

  let k = e.key;

  console.log(text_input_has_focus());
  if(text_input_has_focus()){
    return;
  }

  let vol = $("input#volume");
  if(k === " "){ window.player.play_pause(); e.preventDefault(); }
  if(k === "a"){ window.player.prev(); }
  if(k === "d"){ window.player.next(); }
  if(k === "q"){ window.player.seek("-10"); }
  if(k === "e"){ window.player.seek("+10"); }
  if(k === "-"){ vol.val(parseInt(vol.val()) - 5).trigger("input"); }
  if(k === "+"){ vol.val(parseInt(vol.val()) + 5).trigger("input"); }
});


function load(){
  let hash = get_url();
  console.log(hash);

  //default view
  if(!hash.view){
    hash.view = "files";
  }

  $("div.sidebar-item").removeClass("active");
  /*$("div.sidebar-item > a[href='" + window.location.hash + "']").parent().addClass("active");*/

  if(hash.view === "db" && hash.tagtype){
    $("div.sidebar-item > a[href='#view=" + hash.view + "&tagtype=" + hash.tagtype + "']").parent().addClass("active");
  }else{
    $("div.sidebar-item > a[href^='#view=" + hash.view + "']").parent().addClass("active");
  }


  // apply custom css
  custom_css_apply();

  $("div#split-left").load(window.WEBROOT + "/themes/" + window.THEME + "/html/" + hash.view + ".html", (r, status, xhr) => {
    if(status === "error"){
      $("div#split-left").text("Error loading " + hash.view + ".html: " + xhr.status + " " + xhr.statusText);
      return;
    }


    if(hash.view === "files"){

      window.db.ls({
        uri: hash.path || "",
        metadata: true,
        success: (r) => {

          let path = hash.path || "";
          let paths = path.split("/");

          let paths_ = [
            {
              name: "C:",
              path: ""
            }
          ]

          let x = "";
          for(let i = 0; i < paths.length; i++){
            x += (i !== 0 ? "/" : "") + paths[i];
            if(paths[i] === ""){ continue; }
            paths_.push({
              name: paths[i].split("/").pop(),
              path: x
            })
          }


          for(let i = 0; i < paths_.length; i++){
            let path = paths_[i];
            $("div#library-path").append(`
              <span class='library-path-item'><a href='#view=files&path=${path.path}'>${path.name}</a>/</span>          
            `);
          }

          if(r.directories.length){
            r.directories.map((dir, i ) => {
              dir.display_name = dir.name.split("/").pop() + "/";
              return dir;
            });

            (new Table({
              id: "directories",
              parent: $("div#library"),
              heads: [{
                title: "",
                attr: "display_name"
              }],
              itemActions: [
                {
                  title: "Load",
                  text: "+",
                  onclick: (item) => {
                    window.queue.add(item.name, false);
                  }
                },{
                  title: "Replace",
                  text: "~",
                  onclick: (item) => {
                    window.queue.add(item.name, true);
                  }
                }
              ],
              onItemClick: (item) => {
                window.location.hash = "#view=files&path="+item.name;
              }
            }, r.directories)).render();
          }


          if(r.files.length){

            r.files.map((file, i ) => {
              file.display_name = file.name.split("/").pop();
              return file;
            });

            (new Table({
              id: "files",
              parent: $("div#library"),
              heads: [{
                title: "",
                attr: "display_name"
              }],
              itemActions: [
                {
                  title: "Load",
                  text: "+",
                  onclick: (item) => {
                    window.queue.add(item.name, false);
                  }
                },{
                  title: "Replace",
                  text: "~",
                  onclick: (item) => {
                    window.queue.add(item.name, true);
                  }
                }
              ],
              onItemClick: (item) => {
                window.queue.add_id(item.name, true);
              }
            }, r.files)).render();
          }

          if(r.files.length === 0 && r.directories.length === 0){
            $("p#no-files").show();
          }

        }
      });

    }else if(hash.view === "settings"){

      window.settings.on("update", r => {
        console.log(r)
        if (r.outputs.length) {
          $("div#outputs").html("");
          r.outputs.forEach((output, i) => {
            $("div#outputs").append(`
            <div class="output">
              <button class="${output.outputenabled ? 'active' : ''}" onclick="window.settings.output_set(${output.outputid}, 1)">On</button>
              <button class="${output.outputenabled ? '' : ' active'}" onclick="window.settings.output_set(${output.outputid}, 0)">Off</button>
              <span style="margin-left: 10px">${output.outputname}</span>
            </div>
          `);
          })
        } else {
          $("div#outputs").hide();
          $("p#no-outputs").show();
        }

        $("input#crossfade-val").val(window.player.data.status ? (window.player.data.status.xfade || 0) : 0 );

        $("input#accent").val(localStorage.getItem("color") || "#ff0066");

        let colors = JSON.parse(localStorage.getItem("colors")) || [];
        if(colors.length){
          $("div#colors").html("");
          (colors).forEach((color, i) => {
            $("div#colors").append(`
            <div>
              <button class="inline red" title="delete color" onClick="color_delete('${color}')">-</button>
              <button style="color: ${color}" onClick="color_set('${color}',true)">${color}</button>
            </div>
          `);
          });
        }else{
          $("div#colors").hide();
          $("p#no-colors").show();
        }



        $("input#custom-css-enabled").prop("checked", localStorage.getItem("custom_css_enabled") === "1");
        $("textarea#custom-css").text(localStorage.getItem("custom_css") || "");


      });

      window.settings.on("outputSet", output => {
        window.settings.update();
      });
      window.settings.on("crossfadeChange", val => {
        notification(NOTYPE_SUCC, "Crossfade changed to " + val + " seconds.");
      });

      window.settings.update();

    }else if(hash.view === "db"){

      console.log(hash.value)
      window.db.byTagType(hash.tagtype, hash.value || null, false, (r) => {

        if(hash.value){
          $("h2#db-heading").text(decodeURIComponent(hash.value));
        }else{
          $("h2#db-heading").text(hash.tagtype + "s");
        }

        let heads = [];
        let items = r[hash.tagtype.toLowerCase() + "s"];
        let onclick_load;
        let onclick_item;
        if(items.length){


          if(typeof items[0] === "string"){
            let items_ = [];
            items.forEach((item, i) => {
              items_.push({
                name: item
              });
            });
            items = items_;

            heads = [{
              title: "",
              attr: "name"
            }];

            onclick_load = (item, replace) => {
              window.queue.addSearch([{
                tag: hash.tagtype.toLowerCase(),
                operator: "==",
                value: item.name
              }], replace);
            }
            onclick_item = (item) => {
              window.location.hash = "#view=db&tagtype=" + hash.tagtype + "&value=" + item.name;
            }

          }else{
            heads = [
              {
                title: "#",
                attr: "track",
              },{
                title: "Title",
                attr: "title",
              },{
                title: "Album",
                attr: "album"
              }
            ];

            onclick_load = (item, replace) => {
              window.queue.add(item.file, replace);
            }
            onclick_item = (item) => {
              window.queue.add_id(item.file, true);
            }

          }


          console.log(items);

          (new Table({
            id: "db",
            parent: $("div#db"),
            heads: heads,
            itemActions: [
              {
                title: "Load",
                text: "+",
                onclick: (item) => onclick_load(item, false)
              },{
                title: "Replace",
                text: "~",
                onclick: (item) => onclick_load(item, true)
              }
            ],
            onItemClick: (item) => {
              onclick_item(item);
            }
          }, items)).render();
        }

      });

    }

  });



  window.player.on("update", r => {

    let btn = "►";
    if(r.status.state === "play"){
      btn = "⏸";
    }

    $("button#player-pp").text(btn);

    $("span#player-song-played").text(r.current_song.title_played);
    $("span#player-song-unplayed").text(r.current_song.title_unplayed);

    $("div#player-song-artist").html(`<a href="#view=db&tagtype=albumartist&value=${encodeURI(r.current_song.artist)}">${r.current_song.artist}</a>`);
    $("div#player-song-album").html(`<a href="#view=db&tagtype=album&value=${encodeURI(r.current_song.album)}">${r.current_song.album}</a>`);

    $("button.player-mode").removeClass("active");
    $("button.player-mode#player-mode-single").addClass(r.status.single ? "active" : "");
    $("button.player-mode#player-mode-random").addClass(r.status.random ? "active" : "");
    $("button.player-mode#player-mode-repeat").addClass(r.status.repeat ? "active" : "");
    $("button.player-mode#player-mode-consume").addClass(r.status.consume ? "active" : "");

    $("input#volume").val(r.status.volume);

    if(r.current_song.haspicture){
      $("div#player-thumbnail img").attr("src", window.WEBROOT + "/api/library.php?action=thumbnail&file=" + r.current_song.file);
      $("div#player-thumbnail a").attr("href", window.WEBROOT + "/api/library.php?action=thumbnail&file=" + r.current_song.file);
      $("div#player-thumbnail").show();
    }else{
      $("div#player-thumbnail").hide();
    }

    $("span#player-song-format").text(r.status.audio ?? "");
    $("span#player-song-bitrate").text(r.status.bitrate ? (r.status.bitrate + "kbps") : "");

    $(".queue-item").removeClass("active");
    $(".queue-item[data-id='"+r.current_song.id+"']").addClass("active");
    if(r.status.consume){
      window.queue.update();
    }

  });


  window.player.on("updateTime", r => {

    const elapsed = r.elapsed || 0;
    const duration = r.duration || 0;

    // update percent played
    let percent = -1;
    let percent_text = "LIVE";
    if(duration > 0){
      percent = (Math.round(elapsed / (duration/100))) || 0;
      percent_text = percent.toString() + "%";
    }

     let time = {
      elapsed: elapsed,
      duration: duration,
      elapsed_readable: sec2minsec(elapsed),
      duration_readable: sec2minsec(duration),
      elapsed_percent: percent_text
    }


    let current_song = {
      file: $("span#player-song-played").text() + $("span#player-song-unplayed").text(),
      title: $("span#player-song-played").text() + $("span#player-song-unplayed").text()
    }
    let song_split = this.splitSongByProgress(current_song, percent);

    $("span#player-song-played").text(song_split.title_played);
    $("span#player-song-unplayed").text(song_split.title_unplayed);

    $("span#player-time-elapsed").text(time.elapsed_readable);
    $("span#player-time-duration").text(time.duration_readable);
    $("span#player-time-percent").text(time.elapsed_percent);

  });

  window.player.on("playId", r => {
    $(".queue-item").removeClass("active");
    $(".queue-item[data-id='"+r+"']").addClass("active");
  });

  window.player.on("next", r => window.queue.update());
  window.player.on("previous", r => window.queue.update());


  window.queue.on("save", playlist => {
    notification(NOTYPE_SUCC, "Queue saved to playlist \""+playlist+"\"");
    $('div#darkness').hide();
  });

  window.queue.on("update", r => {

    if(!r.length){
      $("p#queue-empty").show();
      $("table#queue-items").hide();
      return;
    }else{
      $("p#queue-empty").hide();
      $("table#queue-items").show();
    }

    $("table#queue-items tr.queue-item").remove();

    for(let i = 0; i < r.length; i++){
      let q = r[i];
      $("table#queue-items").append(`
        <tr class="queue-item" data-id="${q.id}" onclick="window.player.play_id(${q.id})" data-pos="${q.pos}">
          <td>
            <button class="inline white" onclick="{
              event.preventDefault();
              event.stopPropagation();
              window.queue.delete_id(${q.id});
            }" title="Remove from Queue">-</button>
          </td>
          <td class="track">${q.track || ""}</td>
          <td class="title">${q.title || ""}</td>
          <td class="album">${q.album || ""}</td>
          <td class="artist">${q.artist || ""}</td>
        </tr>
      `);
    }

    let pos_old;
    let pos_new;
    $("table#queue-items").sortable({
      cursor: 'row-resize',
      placeholder: 'ui-state-highlight',
      opacity: '0.55',
      items: 'tr',
      helper:'clone', // fix for #2
      start: function(event, item){
        pos_old = $(item.item).data("pos");
      }, stop: (event, item) => {
        pos_new = $(item.item).index()-1;
        window.queue.move(pos_old, pos_new);
      }
    }).disableSelection();

    $(".queue-item").removeClass("active");
    $(".queue-item[data-id='"+window.player.data.current_song.id+"']").addClass("active");

    $("div#split-right").scrollTop(localStorage.getItem("scrollTop") || 0);

  });

  window.playlist.on("add", playlist => {
    notification(NOTYPE_SUCC, "Song saved to playlist \""+playlist+"\"");
    $('div#darkness').hide();
  });

}

function select_playlist(cb = null, preselect = ""){

  if(typeof cb === "function") {
    window.select_playlist_cb = cb;
  }

  window.playlist.get((r) => {
    $("div#darkness").load(window.WEBROOT + "/themes/" + window.THEME + "/html/playlist-selection.html", () => {
      if(r.playlists.length){
        r.playlists.forEach((playlist, i) => {
          $("select#playlist").append(`
            <option value="${playlist}">${playlist}</option>
          `);
        });

        if($("select#playlist > option[value='" + preselect + "']").length){
          $("select#playlist").val(preselect);
        }

        $("form#playlist-selection").on("submit", function(e){
          if(typeof cb === "function"){
            cb($('select#playlist').val());
          }

          // hack
          if(cb === null && typeof window.select_playlist_cb === "function"){
            window.select_playlist_cb($('select#playlist').val());
          }

          e.stopPropagation();
          e.preventDefault();
          return false;
        });

      }else{
        $("form#playlist-selection").hide();
        $("p#no-playlists").show();
      }

    }).css("display", "flex");
  });


}

function custom_css_apply(){
  $("style#custom-css").remove();
  let css = localStorage.getItem("custom_css") || "";
  if(localStorage.getItem("custom_css_enabled") === "1"){
    $("head").append($("<style/>",{
      type: "text/css",
      text: css,
      id: "custom-css"
    }));
  }
}

function color_set(color, update_input = false){
  localStorage.setItem("color", color);
  $("body").get(0).style.setProperty("--primary", color);
  if(update_input){
    $("input#accent").val(color);
  }
}

// save the current color
function color_save(color = null){
  let colors = JSON.parse(localStorage.getItem("colors")) || [];
  let current = color || localStorage.getItem("color");
  if(!colors.includes(current)){
    colors.push(current);
    localStorage.setItem("colors", JSON.stringify(colors));
  }
  window.settings.update();
}

function color_delete(color){
  let colors = JSON.parse(localStorage.getItem("colors"));
  let colors_new = []; // this is BS
  for(let i = 0; i < colors.length; i++){
    if(colors[i] !== color){
      colors_new.push(colors[i]);
    }
  }
  localStorage.setItem("colors", JSON.stringify(colors_new));
  window.settings.update();
}