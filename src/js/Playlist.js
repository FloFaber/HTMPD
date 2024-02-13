class Playlist extends Events {

  constructor() {
    super();
    this.events = {
      onUpdate: [],
      onAdd: [],
      onRemove: [],
      onDelete: [],
      onCreate: [],
      onLoad: [],
      onReplace: [],
      onSave: [],
      onMove: []
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

  show(name, cb = null){
    window.get({
      url: window.WEBROOT + "/api/playlist.php",
      data: {
        action: "show",
        name: name
      },
      success: (r) => {
        if(typeof cb === "function"){
          cb(r);
        }
      }
    });
  }

  add(playlist, uris){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: {
        action: "add",
        playlist: playlist,
        uris: uris
      },
      success: r => {
        this.execOns("add", playlist, uris);
      }
    })
  }

  remove(playlist, poss){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: {
        action: "remove",
        playlist: playlist,
        poss: poss
      },
      success: r => {
        this.execOns("remove", playlist, poss);
      }
    })
  }

  move(playlist, from, to){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "move", "name": playlist, "from": from, "to": to },
      success: (r) => {
        this.execOns("move", playlist, from, to);
      }
    })
  }

  create(name, clear = true){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "create", "name": name, clear: clear },
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

  delete(names){
    window.post({
      url: window.WEBROOT + "/api/playlist.php",
      data: { "action": "delete", "names": names },
      success: (r) => {
        this.execOns("delete", names);
      }
    })
  }



}