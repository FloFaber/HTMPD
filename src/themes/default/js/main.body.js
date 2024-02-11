window.db = new DB();
window.queue = new Queue();
window.player = new Player();
window.playlist = new Playlist();

window.addEventListener("hashchange", function(e){
  load();
});
color_set(localStorage.getItem("color") || "#ff0066");
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
  $("div.sidebar-item > a[href='" + window.location.hash + "']").parent().addClass("active");

  if(hash.view === "db" && hash.tagtype){
    $("div.sidebar-item > a[href='#view=" + hash.view + "&tagtype=" + hash.tagtype + "']").parent().addClass("active");
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

          console.log(r);

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

          for(let i = 0; i < r.directories.length; i++){
            let dir = r.directories[i];
            $("table#library").append(`
            <tr class="library-item">
              <td class="library-item-actions">
                <button class="inline green" data-uri="${dir.name}" data-replace="false" onClick="window.queue.add('${dir.name}');">+</button>
                <button class="inline yellow" data-uri="${dir.name}" data-replace="true" onClick="window.queue.replace('${dir.name}');">~</button>
              </td>
              <td class="library-item-name"><a href="#view=files&path=${dir.name}">${dir.name.split("/").pop()}/</a></td>
            </tr>
          `);
          }

          for(let i = 0; i < r.files.length; i++){
            let file = r.files[i];
            $("table#library").append(`
            <tr class="library-item">
              <td class="library-item-actions">
                <button class="inline green" data-uri="${htmlspecialchars(file.name)}" data-replace="false" onclick="window.queue.add('${htmlspecialchars(file.name)}');">+</button>
                <button class="inline yellow" data-uri="${htmlspecialchars(file.name)}" data-replace="true" onclick="window.queue.replace('${htmlspecialchars(file.name)}');">~</button>
              </td>
              <td class="library-item-name" title="Title: ${file.title}
Artist: ${htmlspecialchars(file.artist)}
Album: ${htmlspecialchars(file.album)}">
                <span onclick="window.queue.add_id('${htmlspecialchars(file.name)}', true)">${htmlspecialchars(file.name.split("/").pop())}</span>
              </td>
            </tr>
          `);
          }

          if(r.files.length === 0 && r.directories.length === 0){
            $("p#no-files").show();
          }

        }
      });

    }else if(hash.view === "settings"){

      window.settings = new Settings();
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

        $("input#crossfade-val").val(window.player.data.status.xfade || 0);

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


    }else if(hash.view === "db"){

      console.log(hash.value)
      window.db.byTagType(hash.tagtype, hash.value || null, false, (r) => {

        if(hash.value){
          $("h2#db-heading").text(decodeURIComponent(hash.value));
        }else{
          $("h2#db-heading").text(hash.tagtype + "s");
        }

        r[hash.tagtype.toLowerCase() + "s"].forEach((item, i) => {
          console.log(item)
          if(typeof item === "string"){
            $("div#db-items").append(`
              <div><a href="#view=db&tagtype=${htmlspecialchars(hash.tagtype)}&value=${encodeURIComponent(item)}">${htmlspecialchars(item)}</a></div>
            `);
          }else{
            $("div#db-items").append(`
              <div>${htmlspecialchars(item.title)}</div>
            `);
          }

        });
        console.log(r);
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


  window.queue.on("saveAs", r => {
    $("div#darkness").load(window.WEBROOT + "/themes/" + window.THEME + "/html/playlist-selection.html", () => {
      if(r.playlists.length){
        r.playlists.forEach((playlist, i) => {
          $("select#playlist").append(`
          <option value="${playlist}">${playlist}</option>
        `);
        })
      }else{
        $("form#playlist-selection").hide();
        $("p#no-playlists").show();
      }

    }).css("display", "flex");
  });

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

  window.playlist.on("save", playlist => {
    notification(NOTYPE_SUCC, "Song saved to playlist \""+playlist+"\"");
    $('div#darkness').hide();
  });

}

function select_playlist(cb = null){

  window.playlist.get((r) => {
    $("div#darkness").load(window.WEBROOT + "/themes/" + window.THEME + "/html/playlist-selection.html", () => {
      if(r.playlists.length){
        r.playlists.forEach((playlist, i) => {
          $("select#playlist").append(`
          <option value="${playlist}">${playlist}</option>
        `);
        });

        $("form#playlist-selection").on("submit", function(e){
          if(typeof cb === "function"){
            cb($('select#playlist').val());
          }

          e.stopPropagation();
          e.preventDefault();
          return false;
        })

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
function color_save(){
  let colors = JSON.parse(localStorage.getItem("colors")) || [];
  let current = localStorage.getItem("color");
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