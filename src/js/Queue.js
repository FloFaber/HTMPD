class Queue{

  constructor() {
    this.template = new Template("queue");

    // pre-render
    this.render();

    this.refresh();

    this.refresh.bind(this);

  }

  render(){
    $("div#split-right").html(this.template.render());
  }

  refresh(callback = function(e){}){
    $.get({
      url: window.WEBROOT + "/api/queue.php",
      success: (r) => {
        for(let i = 0; i < r.queue.length; i++){
          if(!r.queue[i].title){
            r.queue[i].title = r.queue[i].file.split("/").pop();
          }
        }

        this.template.setData({queue_items: r.queue});
        this.render();

        console.log(window.player_data)
        if(window.player_data && window.player_data.current_song){
          this.setActiveSong(window.player_data.current_song.id);
        }

        if(typeof callback === "function"){
          callback(r.queue);
        }
      },
      error: function(r){
        notification(NOTYPE_ERR, r);
      }
    });
  }

  setActiveSong(id){
    console.log("SETTING ACTIVE SONG: "+id)
    $(".queue-item[data-id='"+id+"']").addClass("active");
  }

  action(data, onsuccess = null, ondone = null){
    $.post({
      url: window.WEBROOT + "/api/queue.php",
      data: data,
      success: (r) => {
        this.refresh();
        if(typeof onsuccess === "function"){ onsuccess(r); }
      },
      error: function(r){
        notification(NOTYPE_ERR, r);
      },
      complete: (r) => {
        if(typeof ondone === "function"){ ondone(r); }
      }
    });
  }

  shuffle(){
    this.action({ "action": "shuffle" });
  }

  clear(){
    this.action({ "action": "clear" });
  }

}