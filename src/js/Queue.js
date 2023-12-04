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
            if(!r.queue[i].file.startsWith("http://") && !r.queue[i].file.startsWith("https://")){
              r.queue[i].title = r.queue[i].file.split("/").pop();
            }else{
              r.queue[i].title = r.queue[i].file;
            }
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
    $(".queue-item").removeClass("active");
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

  add(uri){
    this.action({"action": "add", uri: uri });
  }

  add_id(uri, play = false){
    this.action({ "action": "add_id", "uri": uri, "play": play });
  }

  replace(uri){
    this.action({"action": "replace", uri: uri });
  }

  shuffle(){
    this.action({ "action": "shuffle" });
  }

  clear(){
    this.action({ "action": "clear" });
  }

  delete_id(id, event){
    event.preventDefault();
    event.stopPropagation();
    this.action({ "action": "delete_id", "id": id });
  }

}