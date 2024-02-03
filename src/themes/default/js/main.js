window.addEventListener("hashchange", function(e){
  load();
});
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
  $("div.sidebar-item > a[href='#view=" + hash.view + "']").parent().addClass("active");

  $("div#split-left").load(window.WEBROOT + "/themes/" + window.THEME + "/html/" + hash.view + ".html", (r, status, xhr) => {
    if(status === "error"){
      $("div#split-left").text("Error loading " + hash.view + ".html: " + xhr.status + " " + xhr.statusText);
      return;
    }

    if(hash.view === "files"){

      window.filebrowser.ls(hash.path || "", (r) => {
        for(let i = 0; i < r.paths.length; i++){
          let path = r.paths[i];
          $("div#library-path").append(`
            <span class='library-path-item'><a href='#view=files&path=${path.path}'>${path.name}</a>/</span>          
          `);
        }

        for(let i = 0; i < r.directories.length; i++){
          let dir = r.directories[i];
          $("table#library").append(`
            <tr class="library-item">
              <td class="library-item-actions">
                <button class="inline green" data-uri="${dir.name}" data-replace="false" onClick="window.queue.add('${dir.name}',false);">+</button>
                <button class="inline yellow" data-uri="${dir.name}" data-replace="true" onClick="window.queue.add('${dir.name}',true);">~</button>
              </td>
              <td class="library-item-name"><a href="#view=files&path=${dir.name}">${dir.display_name}/</a></td>
            </tr>
          `);
        }

        for(let i = 0; i < r.files.length; i++){
          let file = r.files[i];
          $("table#library").append(`
            <tr class="library-item">
              <td class="library-item-actions">
                <button class="inline green" data-uri="${htmlspecialchars(file.name)}" data-replace="false" onclick="window.queue.add('${htmlspecialchars(file.name)}',false);">+</button>
                <button class="inline yellow" data-uri="${htmlspecialchars(file.name)}" data-replace="true" onclick="window.queue.add('${htmlspecialchars(file.name)}',true);">~</button>
              </td>
              <td class="library-item-name" title="Title: ${file.title}
Artist: ${htmlspecialchars(file.artist)}
Album: ${htmlspecialchars(file.album)}">
                <span onclick="window.queue.add_id('${htmlspecialchars(file.name)}', true)">${htmlspecialchars(file.display_name)}</span>
              </td>
            </tr>
          `);
        }

      });

    }

  });

  window.player.on("update", r => {
    console.log(r);

    let btn = "►";
    if(r.status.state === "play"){
      btn = "⏸";
    }

    $("button#player-pp").text(btn);

    $("span#player-song-played").text(r.current_song.title_played);
    $("span#player-song-unplayed").text(r.current_song.title_unplayed);

    $("div#player-song-artist").html(`<a href="#view=artists&artist=${r.current_song.artist}">${r.current_song.artist}</a>`);
    $("div#player-song-album").html(`<a href="#view=album&album=${r.current_song.album}">${r.current_song.album}</a>`);

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
            <button class="inline white" onclick="window.queue.delete_id(${q.id}, event)" title="Remove from Queue">-</button>
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



}