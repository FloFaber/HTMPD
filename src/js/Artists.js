class Artists{

  constructor() {
    this.template = new Template("artists");
    this.render();
  }

  render(){
    $("div#split-left").html(this.template.render());
  }

  refresh(){
    $.get({
      url: window.WEBROOT + "/api/library.php",
      data: { "action": "artist" },
      success: (r) => {
        this.template.setData({

          "artists": r.artists,
        });
        this.render();
      }
    })
  }

}