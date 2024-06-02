class Playlist {

  constructor(name = null) {
    this.name = name;
  }


  get(options = {}){
    window.get({
      url: window.WEBROOT + "/api/playlist.php",
      data: {
        action: "show",
        name: this.name
      },
      success: (r) => {
        if(typeof options.success === "function"){
          options.success(this.name, r);
        }
      }, error: r => typeof options.error === "function" && options.error(r)
    });
  }


  getAll(options = {}){
    window.get({
      url: window.WEBROOT + "/api/playlist.php",
      success: (r) => {
        if(typeof options.success === "function"){
          options.success(r);
        }
      }, error: r => typeof options.error === "function" && options.error(r)
    });
  }


  add(options = {}){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: {
        action: "add",
        playlist: this.name,
        uris: options.uris
      },
      success: r => {
        if(typeof options.success === "function"){
          options.success(this.name, r);
        }
      }, error: r => typeof options.error === "function" && options.error(r)
    })
  }


  remove(options = {}){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: {
        action: "remove",
        playlist: this.name,
        poss: options.positions
      },
      success: r => {
        if(typeof options.success === "function"){
          options.success(r);
        }
      }, error: r => typeof options.error === "function" && options.error(r)
    })
  }


  rename(options = {}){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: {
        action: "rename",
        name_old: this.name,
        name_new: options.name,
      },
      success: r => {
        this.name = options.name;
        if(typeof options.success === "function"){
          options.success(options.name);
        }
      }, error: r => typeof options.error === "function" && options.error(r)
    })
  }


  move(options = {}){

    if(typeof options.from === "undefined" || typeof options.to === "undefined"){ return false; }

    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "move", "name": this.name, "from": options.from, "to": options.to },
      success: (r) => {
        if(typeof options.success === "function"){
          options.success(r);
        }
      }, error: r => typeof options.error === "function" && options.error(r)
    })
  }


  create(options = {}){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "create", "name": this.name, clear: options.clear || true },
      success: (r) => {
        if(typeof options.success === "function"){
          options.success(name);
        }
      }, error: r => typeof options.error === "function" && options.error(r)
    })
  }


  load(options = {}){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { action: "load", name: this.name, clear: options.clear || false },
      success: (r) => {
        if(typeof options.success === "function"){
          options.success(this.name);
        }
      }, error: r => typeof options.error === "function" && options.error(r)
    })
  }


  delete(options = {}){
    console.log(this.name);
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { action: "delete", names: [this.name] },
      success: (r) => {
        if(typeof options.success === "function"){
          options.success(this.name);
        }
      }, error: r => typeof options.error === "function" && options.error(r)
    })
  }



}