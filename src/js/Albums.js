class Albums{

  constructor() {
    this.template = new Template("albums");
    this.render();
  }

  render(){
    $("div#split-left").html(this.template.render());
  }

  refresh(){
    $.get({
      url: window.WEBROOT + "/api/library.php",
      data: { "action": "album" },
      success: (r) => {
        for(let i = 0; i < r.albums.length; i++){
          r.albums[i];
        }
        this.template.setData({
          "albums": r.albums,
        });
        this.render();
      }
    })
  }

}