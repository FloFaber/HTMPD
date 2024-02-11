class Playlist extends Events {

  constructor() {
    super();
    this.events = {
      onUpdate: [],
      onAdd: [],
      onDelete: [],
      onCreate: [],
      onLoad: [],
      onReplace: [],
      onSave: []
    }
  }


  update(){
    window.get({
      url: window.WEBROOT + "/api/playlist.php",
      success: (r) => {
        this.execOns("update", r);
      }
    });
  }

  get(cb = null){
    window.get({
      url: window.WEBROOT + "/api/playlist.php",
      success: (r) => {
        if(typeof cb === "function"){
          cb(r);
        }
      }
    });
  }

  add(playlist, uri){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: {
        action: "add",
        playlist: playlist,
        uri: uri
      },
      success: r => {
        this.execOns("add", r);
      }
    })
  }

  create(name){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "create", "name": name },
      success: (r) => {
        this.execOns("create", name);
      }
    })
  }

  load(name){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "load", "name": name },
      success: (r) => {
        this.execOns("load", name);
      }
    })
  }

  replace(name){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "replace", "name": name },
      success: (r) => {
        this.execOns("replace", name);
      }
    })
  }

  delete(name){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "delete", "name": name },
      success: (r) => {
        this.execOns("delete", name);
      }
    })
  }



}