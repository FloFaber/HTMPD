/*
 * HTMPD
 * https://github.com/FloFaber/HTMPD
 *
 * Copyright (c) 2024 Florian Faber
 * https://www.flofaber.com
 */

class Queue {

  constructor() {
    this.update.bind(this);
  }

  /**
   * Update the queue.
   * @param options callback function.
   */
  update(options = {}){

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

        if(typeof options.success === "function"){
          options.success(r.queue);
        }

      }, error: r => typeof options.error === "function" && options.error(r)
    });


  }

  move(options = {}){

    if(!options.from || ! options.to){
      return false;
    }

    window.post({
      url: window.WEBROOT + "/api/queue.php",
      data: { "action": "move", "from": options.from, "to": options.to },
      success: (r) => {

        if(typeof options.success === "function"){
          options.success({
            from: options.from, to: options.to
          });
        }
      }, error: r => typeof options.error === "function" && options.error(r)
    });
  }

  move_id(options = {}){

    if(!options.from || ! options.to){
      return false;
    }

    window.post({
      url: window.WEBROOT + "/api/queue.php",
      data: { "action": "move_id", "from": options.from, "to": options.to },
      success: (r) => {

        if(typeof options.success === "function"){
          options.success({
            from: options.from, to: options.to
          });
        }
      }, error: r => typeof options.error === "function" && options.error(r)
    });
  }

  // save current queue as playlist
  save(options = {}){

    if(!options.name){ return false; }

    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "save", "name": options.name },
      success: (r) => {
        if(typeof options.success === "function"){
          options.success({
            name: options.name
          });
        }
      }, error: r => typeof options.error === "function" && options.error(r)
    });
  }

  action(data, onsuccess = null, onerror = null){
    window.post({
      url: window.WEBROOT + "/api/queue.php",
      data: data,
      success: (r) => {
        this.update();
        window.player.update();
        if(typeof onsuccess === "function"){ onsuccess(r); }
      },
      error: r => typeof onerror === "function" && onerror(r),
    });
  }

  add(options = {}){
    if(!options.uri){ return false; }
    this.action({
      action: "add",
      uri: options.uri,
      replace: options.replace,
    }, options.success, options.error);
  }

  addSearch(options = {}){
    this.action({
      action: "add_search",
      filters: options.filters,
      replace: options.replace
    }, options.success, options.error);
  }

  add_id(options = {}){
    this.action({
      action: "add_id",
      uri: options.uri,
      play: options.play
    }, options.success, options.error);
  }

  replace(options = {}){
    this.action({
      action: "replace",
      uri: options.uri
    }, options.success, options.error);
  }

  shuffle(options = {}){
    this.action({
      action: "shuffle"
    }, options.success, options.error);
  }

  clear(options = {}){
    this.action({
      action: "clear"
    }, options.success, options.error);
  }

  delete_id(options = {}){
    this.action({
      "action": "delete_id",
      "ids": options.ids
    }, options.success, options.error);
  }

}