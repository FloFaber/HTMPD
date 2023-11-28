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
        this.template.setData({queue_items: r.queue});
        this.render();
        if(typeof callback === "function"){
          callback(r.queue);
        }
      },
      error: function(r){
        notification(NOTYPE_ERR, r);
      }
    });
  }

}