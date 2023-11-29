class Player{

  constructor() {
    this.status = null;
    this.current_song = null;
    this.template = new Template("player");
    this.render();
    this.refresh();

    this.last_elapsed = 0;
    this.last_duration = 0;

  }

  refresh(){
    $.get({
      url: window.WEBROOT + "/api/index.php",
      data: { action: "status" },
      success: (r) => {
        console.log(r);
        this.status = r.status;
        this.current_song = r.current_song;
        window.queue.setActiveSong(r.current_song.id);
        //this.template.setData({ status: r.status, current_song: r.current_song });
        this.render();


        // Volume change by click and mousewheel
        $("input#volume").on("input", () => {
          let vol = $("input#volume").val();
          this.volume(vol);
        }).on("wheel", function(e){

          if(e.originalEvent.deltaY < 0){ // up
            $(this).val(parseInt($(this).val()) + parseInt($(this).attr("step")));
          }else{ // down
            $(this).val(parseInt($(this).val()) - parseInt($(this).attr("step")));
          }
          $(this).trigger("input");

          e.preventDefault();
          e.stopPropagation();
          return false;
        });


        if(this.current_song){
          $(".queue-item[data-id='"+this.current_song.id+"']").addClass("active");
        }

        if($("img#thumbnail").data("file") !== this.current_song.file){

          console.log(this.current_song.file)

          $.get({
            url: window.WEBROOT + "/api/library.php",
            data: { "action": "thumbnail", "file": this.current_song.file, "check_only": true },
            success: (r) => {
              $("div#player-thumbnail")
                .css("height", $("div#player").height()+"px")
                .css("width", $("div#player").height()+"px")
                .css("display", "flex");
              $("img#thumbnail")
                .attr("src", window.WEBROOT + "/api/library.php?action=thumbnail&file=" + this.current_song.file)
                .data("file", this.current_song.file);
            }, error: function(r){
              $("div#player-thumbnail").css("display", "none");
            }
          })


        }

        // update song title
        let text = song2text(this.current_song);
        if(!text){
          text = "[ STOPPED ]";
        }
        $("div#player-song").text(text);
        $("div#player-song-artist").text(this.current_song.artist || "");

        // update volume
        $("input#volume").val(this.status.volume);

        // update time
        this.update_time(this.status.duration, this.status.elapsed);

        // update play-state
        let states = {
          "stop": "▶",
          "play": "⏸",
          "pause": "▶"
        };
        $("button#player-pp").text(states[this.status.state]);

        // update active song in queue
        $(".queue-item").removeClass("active");
        $(".queue-item[data-id='"+r.current_song.id+"']").addClass("active");

        // update mode buttons
        $("div#player-modes").find("button").removeClass("active");
        $("button#player-mode-single").addClass(this.status.single === 1 ? "active" : "");
        $("button#player-mode-repeat").addClass(this.status.repeat === 1 ? "active" : "");
        $("button#player-mode-random").addClass(this.status.random === 1 ? "active" : "");
        $("button#player-mode-consume").addClass(this.status.consume === 1 ? "active" : "");



      }
    })
  }


  update_time(duration, elapsed){

    if(typeof duration === "undefined"){ duration = 0; }

    this.last_duration = duration;
    this.last_elapsed = elapsed;

    if(elapsed >= duration && duration !== 0){
      this.refresh();
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
    let player_song = "<span id='player-song-played'>";
    let current = $("div#player-song").text();
    let chars = Math.round((current.length * percent) / 100);

    if(duration > 0){
      for(let i = 0; i < chars; i++){
        player_song += htmlspecialchars(current[i]);
      }
      player_song += "</span><span id='player-song-unplayed'>";
      for(let i = chars; i < current.length; i++){
        player_song += htmlspecialchars(current[i]);
      }
      player_song += "</span>";
    }else{
      player_song = "<span id='player-song-played'>" + htmlspecialchars(current) + "</span>";
    }

    $("div#player-song").html(player_song);
  }


  render(){
    $("div#player").html(this.template.render());
  }

  action(data, onsuccess = null, ondone = null){
    $.post({
      url: window.WEBROOT + "/api/player.php",
      data: data,
      success: (r) => {
        if(typeof onsuccess === "function"){
          onsuccess(r);
        }else{
          //this.refresh();
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

  play_id(id){
    this.action({ "action": "playid", "id": id });
  }

  pause(state){
    this.action({ "action": "pause", "state": (state ? "1":"0") });
  }

  play_pause(){
    if(this.status.state === "play"){
      this.pause(true);
    }else{
      this.pause(false);
    }
  }

  volume(){
    this.action({ "action": "volume", "volume": $("input#volume").val() });
  }

}