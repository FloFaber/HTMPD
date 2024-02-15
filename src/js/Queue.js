class Queue extends Events {

  constructor() {
    super();

    this.update.bind(this);

    this.data = {};

    this.events = {
      onUpdate: [],
      onMove: [],
      onSave: [],
    };

  }

  update(){

    window.get({
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
    window.post({
      url: window.WEBROOT + "/api/queue.php",
      data: { "action": "move", "from": from, "to": to },
      success: (r) => {
        this.update();
        this.execOns("move", { from: from, to: to });
      }
    });
  }

  // save current queue as playlist
  save(playlist){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "save", "name": playlist },
      success: (r) => {
        this.execOns("save", playlist);
      }
    });
  }

  action(data, onsuccess = null, ondone = null){
    window.post({
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

  add(uri, replace = false){
    if(!uri){ return; }
    this.action({"action": "add", uri: uri, "replace": replace });
  }

  addSearch(filters, replace = false){

    this.action({
      "action": "add_search",
      "filters": filters,
      "replace": replace
    });

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

  delete_id(ids){
    this.action({ "action": "delete_id", "ids": ids });
  }

}