class Queue{

  constructor() {

    this.update.bind(this);

    this.data = {};

    this.events = {
      onUpdate: [],
      onMove: []
    };

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

    $.get({
      url: window.WEBROOT + "/api/queue.php",
      success: (r) => {
        for(let i = 0; i < r.queue.length; i++){

          if(r.queue[i].file.startsWith("http://") || r.queue[i].file.startsWith("https://")){
            r.queue[i].title = r.queue[i].name || r.queue[i].title || r.queue[i].file;
          }

          if(!r.queue[i].title){
            if(!r.queue[i].file.startsWith("http://") && !r.queue[i].file.startsWith("https://")){
              r.queue[i].title = r.queue[i].file.split("/").pop();
            }
          }
        }

        this.execOns("update", r.queue);

        return r.queue;

      }
    });


  }

  move(from, to){
    $.post({
      url: window.WEBROOT + "/api/queue.php",
      data: { "action": "move", "from": from, "to": to },
      success: (r) => {
        this.update();
        this.execOns("move", { from: from, to: to });
      }
    });
  }

  // save the current queue
  save_dialog(){
    if(this.popup){ this.popup.remove(); }
    $.get({
      url: window.WEBROOT + "/api/playlist.php",
      success: (r) => {
        this.popup = new Popup(window.templates.popup_playlist_selection({
          playlists: r.playlists,
        }));
      }
    });
  }

  save(){
    let playlist = $("select#playlist").val();
    console.log(playlist);

    $.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "save", "name": playlist },
      success: (r) => {
        notification(NOTYPE_SUCC, "Queue saved to playlist \""+playlist+"\"");
      },
      complete: () => {
        this.popup.remove();
      }
    });
  }


  action(data, onsuccess = null, ondone = null){
    $.post({
      url: window.WEBROOT + "/api/queue.php",
      data: data,
      success: (r) => {
        this.update();
        window.player.update();
        if(typeof onsuccess === "function"){ onsuccess(r); }
      },
      complete: (r) => {
        if(typeof ondone === "function"){ ondone(r); }
      }
    });
  }

  add(uri){
    if(!uri){ return; }
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