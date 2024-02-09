class Player{


  constructor(update_interval = 30) {


    this.events = {
      onUpdate: [],
      onUpdateTime: [],
      onPlay: [],
      onPlayId:[],
      onPause: [],
      onNext: [],
      onPrevious: [],
      onVolumeChange: [],
    };

    this.data = { image: { "src":"" }}

    this.on.bind(this);

    this.update();
    this.update.bind(this);

    this.increase_time.bind(this);

    setInterval(() => {
      this.update();
    }, update_interval * 1000);

    setInterval(() => {
      this.increase_time();
    }, 1000);

    this.last_elapsed = 0;
    this.last_duration = 0;

  }

  on(name, cb){
    this.events["on" + capitalizeFirstLetter(name)].push(cb);
  }

  execOns(name, data){
    for(let i = 0; i < this.events["on" + capitalizeFirstLetter(name)].length; i++){
      this.events["on" + capitalizeFirstLetter(name)][i](data);
    }
  }

  update(){
    window.ajax({
      method: "GET",
      url: window.WEBROOT + "/api/index.php",
      data: { action: "status" },
      success: (r) => {

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
          let song_split = splitSongByProgress(r.current_song, (Math.round(r.status.elapsed / (r.status.duration/100))) || 100);
          r.current_song.title_played = song_split.title_played;
          r.current_song.title_unplayed = song_split.title_unplayed;
          r.current_song.artist = r.current_song.artist || "N/A";
          r.current_song.album = r.current_song.album || "N/A";
          if(r.current_song.file.startsWith("http://") || r.current_song.file.startsWith("https://")){
            r.current_song.artist = r.current_song.name || "";
          }
        }

        this.data = {
          status: r.status,
          current_song: r.current_song,
          image: {
            src: r.current_song.haspicture ? window.WEBROOT + "/api/library.php?action=thumbnail&file=" + encodeURIComponent(r.current_song.file) : "",
          }
        };

        //this.updateTime(this.data.current_song.duration, this.data.current_song.elapsed);
        this.execOns("update", this.data);

      }
    })
  }

  increase_time(){
    if(this.data.status && (this.data.status.state === "play" || this.data.status.state === "pause")){
      this.updateTime(this.last_duration, this.last_elapsed+1);
    }
  }


  updateTime(duration, elapsed){

    this.last_duration = duration;
    this.last_elapsed = elapsed;

    this.execOns("updateTime", {
      elapsed: elapsed,
      duration: duration
    });

    if(elapsed >= duration && duration !== 0){
      this.update();
    }

  }


  action(data, onsuccess = null, ondone = null){
    window.post({
      url: window.WEBROOT + "/api/player.php",
      data: data,
      success: (r) => {
        this.update();
        if(typeof onsuccess === "function"){
          onsuccess(r);
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
    this.action({ "action": "playid", "id": id }, () => {
      this.execOns("playId", id);
    });
  }

  pause(state){
    this.action({ "action": "pause", "state": (state ? "1":"0") }, () => {
      this.execOns("pause", state);
    });
  }

  play_pause(){
    if(this.data.status.state === "play"){
      this.pause(true);
    }else{
      this.pause(false);
    }
  }

  next(){
    this.action({ "action": "next" }, (r) => {
      this.execOns("next", r);
    });
  }

  prev(){
    this.action({ "action": "previous" }, (r) => {
      this.execOns("previous", r);
    });
  }

  seek(time){
    this.action({ "action": "seek_cur", time: time });
  }

  setMode(mode, state){
    state = state === true ? 1 : 0;
    this.action({ "action": mode, state: state }, () => {
      notification(state ? NOTYPE_SUCC : NOTYPE_WARN, mode + "-mode " + (state ? "enabled" : "disabled"));
      this.update();
    });
  }

  volume(volume){
    this.action({ "action": "volume", "volume": volume }, () => {
      this.execOns("volumeChange", volume);
    });
  }

}