class Player{

  constructor() {
    this.status = null;
    this.current_song = null;
    this.template = new Template("player");
    this.render();

    $.get({
      url: window.WEBROOT + "/api/index.php",
      data: { action: "status" },
      success: (r) => {
        this.status = r.status;
        this.current_song = r.current_song;
        this.template.setData({ status: r.status, current_song: r.current_song });
        this.template.render();
      }
    })

  }

  render(){
    $("div#player").html(this.template.render());
  }

  action(data, onsuccess = null, ondone = null){
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

  play_id(id){
    this.action({ "action": "play_id", "id": id });
  }

}