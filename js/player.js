let last_duration = 0;
let last_elapsed = 0;
let current_data = null;

/*
 * PLAYER EVENTS
*/

// Volume change by click and mousewheel
$("input#volume").on("input", function(){
  let vol = $(this).val();
  player_volume(vol);
}).on("wheel", function(e){

  if(e.originalEvent.deltaY < 0){ // up
    $(this).val(parseInt($(this).val()) + parseInt($(this).attr("step")));
  }else{ // down
    $(this).val(parseInt($(this).val()) - parseInt($(this).attr("step")));
  }
  $(this).input();

  e.preventDefault();
  e.stopPropagation();
  return false;
});


// Keyboard Shortcuts
$(document).on("keypress", function(e){
  let k = e.key;
  console.log(k)
  if(k === " "){ player_pause(); }
  if(k === "a"){ player_previous(); }
  if(k === "d"){ player_next(); }
  if(k === "-"){
    $("input#volume").val(parseInt($("input#volume").val()) - 5);
    $("input#volume").input();
  }
  if(k === "+"){
    $("input#volume").val(parseInt($("input#volume").val()) + 5);
    $("input#volume").input();
  }
});


// seek to specific time when clicking on the song title
$("div#player-song").click(function(e){

  if(typeof current_data.status.duration === "undefined"){ return; }

  let w = $(this).width();
  let offset_x = $(this).offset().left;
  let x = e.pageX - offset_x;
  let seek_to = Math.round(map(x, 0, w, 0, current_data.status.duration) * 100)/100;

  player_seek_cur(seek_to);
});


$("button#player-pp").click(function(){ player_pause(); });
$("button#player-previous").click(player_previous);
$("button#player-next").click(player_next);
$("button#player-seek-back").click(function(){ player_seek_cur("-10"); });
$("button#player-seek-forward").click(function(){ player_seek_cur("+10"); });


/*
 * END PLAYER EVENTS
*/

/*
 * PLAYER FUNCTIONS
*/
function player_action(data, onsuccess = null, ondone = null){
  $.post({
    url: window.WEBROOT + "/api/player.php",
    data: data,
    success: function(r){
      if(typeof onsuccess === "function"){
        onsuccess(r);
      }else{
        player_refresh();
      }
    },
    error: function(r){
      notification(NOTYPE_ERR, r);
    },
    complete: function(r){
      if(typeof ondone === "function"){
        ondone(r);
      }
    }
  });
}


function player_seek_cur(time){
  player_action({ "action": "seek_cur", "time": time });
}

function player_volume(vol){
  player_action({ "action": "volume", "volume": vol }, function(){});
}

function player_pause(state = ""){
  player_action({ "action": "pause", "state": state });
}

function player_next(){
  player_action({ "action": "next" });
}

function player_previous(){
  player_action({ "action": "previous" });
}

function player_play_id(id){
  set_content_cursor("progress");
  player_action({ "action": "playid", "id": id }, null, function(){
    set_content_cursor();
  });
}


// function to refresh player status
function player_refresh(){
  $.get({
    url: window.WEBROOT + "/api/index.php",
    data: { "action": "status" },
    success: function(r){
      current_data = r;
      let s = r.status;
      let cs = r.current_song;

      // update song title
      let text = "";
      if(cs){
        if(cs.name){ text += cs.name+": "; }
        if(cs.title){ text += cs.title; }else{ text = cs.file.split("/").pop(); }
      }else{
        text = "[ STOPPED ]";
      }
      $("div#player-song").text(text);

      // update volume
      $("input#volume").val(s.volume);

      // update time
      player_update_time(s.duration, s.elapsed);

      // update play-state
      let states = {
        "stop": "▶",
        "play": "⏸",
        "pause": "▶"
      };
      $("button#player-pp").text(states[s.state]);

      // update active song in queue
      $("div.queue-item").removeClass("active");
      $("div.queue-item#queue-item-"+r.current_song.id).addClass("active");

    }, error: function(r){
      notification(NOTYPE_ERR, r.error);
    }
  });
}


// function to update the playtime and "progress"
function player_update_time(duration, elapsed){

  if(typeof duration === "undefined"){ duration = 0; }

  last_duration = duration;
  last_elapsed = elapsed;

  if(elapsed >= duration && duration !== 0){
    player_refresh();
    if(typeof queue_refresh === "function"){ queue_refresh(); }
  }

  // update elapsed
  $("span#player-time-elapsed").text(sec2minsec(elapsed));
  // update duration
  $("span#player-time-duration").text(sec2minsec(duration));

  // update percent played
  let percent = 0;
  let percent_text = "LIVE";
  if(duration > 0){
    percent = (Math.round(elapsed / (duration/100)));
    percent_text = percent.toString() + "%";
  }
  $("span#player-time-percent").text(percent_text);

  // update progress
  let player_song = "<span>";
  let current = $("div#player-song").text();
  let chars = Math.round((current.length * percent) / 100);

  if(chars > 0){
    for(let i = 0; i < chars; i++){
      player_song += htmlspecialchars(current[i]);
    }
    player_song += "</span><span style='color: grey;'>";
    for(let i = chars; i < current.length; i++){
      player_song += htmlspecialchars(current[i]);
    }
    player_song += "</span>";
  }else{
    player_song = "<span>" + htmlspecialchars(current) + "</span>";
  }

  $("div#player-song").html(player_song);
}


// function to increase the elapsed playtime
function player_increase_time(){
  if(current_data.status.state === "play"){
    player_update_time(last_duration, last_elapsed+1);
  }
}

/*
 * END PLAYER FUNCTIONS
*/

setInterval(player_refresh, 5000);
setInterval(player_increase_time, 1000);
player_refresh();
