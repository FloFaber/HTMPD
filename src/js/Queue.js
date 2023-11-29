class Queue{

  constructor() {
    this.template = new Template("queue");

    // pre-render
    this.render();

    this.refresh();

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
    $(".queue-item[data-id='"+id+"']").addClass("active");
  }

}