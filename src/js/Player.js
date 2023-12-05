class Player{

  constructor() {
    this.status = null;
    this.current_song = null;
    this.template = new Template("player");
    this.template.setData({ image: { "src": "" } })
    this.render();
    this.refresh();

    this.refresh.bind(this);
    this.increase_time.bind(this);

    setInterval(() => {
      this.refresh();
    }, 30000);
    setInterval(() => {
      this.increase_time();
    }, 1000);

    this.last_elapsed = 0;
    this.last_duration = 0;

    // Keyboard Shortcuts
    $(document).on("keypress", (e) => {
      let k = e.key;

      console.log(text_input_has_focus());
      if(text_input_has_focus()){
        return;
      }

      if(k === " "){ this.play_pause(); e.preventDefault(); }
      if(k === "a"){ this.prev(); }
      if(k === "d"){ this.next(); }
      if(k === "q"){ this.seek("-10"); }
      if(k === "e"){ this.seek("+10"); }
      if(k === "-"){
        $("input#volume").val(parseInt($("input#volume").val()) - 5).trigger("input");
      }
      if(k === "+"){
        $("input#volume").val(parseInt($("input#volume").val()) + 5).trigger("input");
      }
    });

  }

  refresh(){
    $.get({
      url: window.WEBROOT + "/api/index.php",
      data: { action: "status" },
      success: (r) => {

        // modify response as we need it for the template
        r.status.consume_active = r.status.consume === 1 ? "active" : "";
        r.status.random_active = r.status.random === 1 ? "active" : "";
        r.status.repeat_active = r.status.repeat === 1 ? "active" : "";
        r.status.single_active = r.status.single === 1 ? "active" : "";

        let time = {
          elapsed: r.status.elapsed || 0,
          duration: r.status.duration || 0,
          elapsed_readable: sec2minsec(r.status.elapsed || 0),
          duration_readable: sec2minsec(r.status.duration || 0),
          elapsed_percent: ((Math.round(r.status.elapsed / (r.status.duration/100))) || 0) + "%"
        };

        this.last_elapsed = r.status.elapsed || 0;
        this.last_duration = r.status.duration || 0;

        if(!r.current_song.file){
          r.current_song = {
            "title_played": "[ STOPPED ]",
            "title_unplayed": "",
            "artist": "N/A",
            "album": "N/A"
          }
        }else{
          let song_split = this.splitSongByProgress(r.current_song, (Math.round(r.status.elapsed / (r.status.duration/100))) || 0);
          r.current_song.title_played = song_split.title_played;
          r.current_song.title_unplayed = song_split.title_unplayed;
          r.current_song.artist = r.current_song.artist || "N/A";
          r.current_song.album = r.current_song.album || "N/A";
          if(r.current_song.file.startsWith("http://") || r.current_song.file.startsWith("https://")){
            r.current_song.artist = r.current_song.name || "";
          }
        }


        this.status = r.status;
        this.current_song = r.current_song;
        window.queue.setActiveSong(r.current_song.id);

        this.template.setData({
          status: r.status,
          time: time,
          current_song: r.current_song,
          playbutton: (r.status.state === "play" ? "⏸" : "▶"),
          image: {
            src: this.current_song.file ? window.WEBROOT + "/api/library.php?action=thumbnail&file=" + this.current_song.file : "",
          }
        });

        this.render();

        window.player_data = {
          current_song: r.current_song,
          status: r.status
        }

      }
    })
  }

  increase_time(){
    if(this.status && this.status.state === "play"){
      this.update_time(this.last_duration, this.last_elapsed+1);
    }
  }


  update_time(duration, elapsed){

    let data = this.template.getData();

    console.log(duration)
    if(typeof duration === "undefined"){ duration = 0; }

    this.last_duration = duration;
    this.last_elapsed = elapsed;



    data.current_song.title_played = "";
    data.current_song.title_unplayed = "";

    // if the song has finished playing -> refresh player and queue
    if(elapsed >= duration && duration !== 0){
      this.refresh();
      window.queue.refresh();
    }

    // update percent played
    let percent = -1;
    let percent_text = "LIVE";
    if(duration > 0){
      percent = (Math.round(elapsed / (duration/100))) || 0;
      percent_text = percent.toString() + "%";
    }

    data.time = {
      elapsed: elapsed,
      duration: duration,
      elapsed_readable: sec2minsec(elapsed),
      duration_readable: sec2minsec(duration),
      elapsed_percent: percent_text
    }


    let song_split = this.splitSongByProgress(data.current_song, percent);
    data.current_song.title_played = song_split.title_played;
    data.current_song.title_unplayed = song_split.title_unplayed;

    this.template.setData(data);
    this.render();

  }


  render(){
    $("div#player").html(this.template.render());
  }


  splitSongByProgress(current_song, percent_played){

    if(!current_song.file){ return; }

    let song = current_song.file.split("/").pop();
    if(current_song.title){
      song = current_song.title;
    }

    let data = {
      title_played: "",
      title_unplayed: ""
    };
    let chars = Math.round((song.length * percent_played) / 100);

    if(percent_played > -1){
      for(let i = 0; i < chars; i++){
        data.title_played += htmlspecialchars(song[i]);
      }

      for(let i = chars; i < song.length; i++){
        data.title_unplayed += htmlspecialchars(song[i]);
      }

    }else{
      data.title_played = htmlspecialchars(song);
    }

    return data;

  }

  action(data, onsuccess = null, ondone = null){
    $.post({
      url: window.WEBROOT + "/api/player.php",
      data: data,
      success: (r) => {
        if(typeof onsuccess === "function"){
          onsuccess(r);
        }else{
          this.refresh();
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

  seekTo(event, element){
    if(typeof this.status.duration === "undefined"){ return; }

    let w = $(element).width();
    let offset_x = $(element).offset().left;
    let x = event.pageX - offset_x;
    let seek_to = Math.round(map(x, 0, w, 0, this.status.duration) * 100)/100;

    this.seek(seek_to);
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

  next(){
    this.action({ "action": "next" });
  }

  prev(){
    this.action({ "action": "previous" });
  }

  seek(time){
    this.action({ "action": "seek_cur", time: time });
  }

  setMode(mode, state){
    state = state === true ? 1 : 0;
    this.action({ "action": mode, state: state }, () => {
      notification(state ? NOTYPE_SUCC : NOTYPE_WARN, mode + "-mode " + (state ? "enabled" : "disabled"));
      this.refresh();
    });
  }

  volume(){
    this.action({ "action": "volume", "volume": $("input#volume").val() });
  }

  // Volume change by click and mousewheel
  volumeWheel(event, elem){

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

}