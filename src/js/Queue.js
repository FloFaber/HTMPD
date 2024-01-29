class Queue{

  constructor() {

    this.render.bind(this);
    this.refresh.bind(this);

    // pre-render
    this.render();
    this.refresh();

    this.data = {};

  }

  render(){
    $("div#split-right").html(window.templates.queue(this.data));

    let pos_old;
    let pos_new;

    $("table#queue-items").sortable({
      cursor: 'row-resize',
      placeholder: 'ui-state-highlight',
      opacity: '0.55',
      items: 'tr',
      helper:'clone', // fix for #2
      start: function(event, item){
        pos_old = $(item.item).data("pos");
      }, stop: (event, item) => {
        pos_new = $(item.item).index();

        $.post({
          url: window.WEBROOT + "/api/queue.php",
          data: { "action": "move", "from": pos_old, "to": pos_new },
          success: (r) => {
            this.refresh();
          }
        });

      }
    }).disableSelection();

  }

  refresh(callback = null){

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

        this.data = {queue_items: r.queue};
        this.render();

        window.player.refresh((r) => {
          if(r && r.current_song){
            this.setActiveSong(r.current_song.id);
          }
        });

        if(typeof callback === "function"){
          callback(r.queue);
        }
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
        window.player.refresh();
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