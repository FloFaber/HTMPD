class Library{

  constructor() {
    this.data = {};
  }

  render(){
    $("div#split-left").html(window.templates.library(this.data));
  }

  refresh(){

    $.get({
      url: window.WEBROOT + "/api/library.php",
      data: { "action": "get" },
      success: (r) => {
        this.data = {
          artists: r.artists
        };
        this.render();
      }
    })
  }

  update_db(){
    $.post({
      url: window.WEBROOT + "/api/library.php",
      data: {
        action: "update"
      },
      success: function(r){
        console.log(r);
        notification(NOTYPE_SUCC, "Updating DB with Job #" + r.job);
      },
      error: function(r){ notification(NOTYPE_ERR, r) }
    })
  }

  search_add(filters, replace = false){
    $.post({
      url: window.WEBROOT + "/api/queue.php",
      data: { action: "search_add", filters: filters, replace: replace },
      complete: (r) => {
        window.queue.refresh();
      }
    })
  }

}