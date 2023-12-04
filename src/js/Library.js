class Library{

  constructor() {

    this.template = new Template("library");

  }

  render(){
    $("div#split-left").html(this.template.render());
  }

  refresh(){

    $.get({
      url: window.WEBROOT + "/api/library.php",
      data: { "action": "get" },
      success: (r) => {
        this.template.setData({
          artists: r.artists
        });
        this.render();
        console.log(r);
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

}