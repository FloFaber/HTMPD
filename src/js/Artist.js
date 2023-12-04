class Artist{

  constructor(name) {
    this.name = name;
    this.template = new Template("artist");
    this.render();
  }

  render(){
    $("div#split-left").html(this.template.render());
  }

  refresh(){
    $.get({
      url: window.WEBROOT + "/api/library.php",
      data: { "action": "artist", "artist": this.name },
      success: (r) => {
        for(let i = 0; i < r.albums.length; i++){
          r.albums[i] = {
            name: r.albums[i],
            artist: this.name
          }
        }
        this.template.setData({
          "artist": this.name,
          "albums": r.albums
        });
        this.render();
      }
    })
  }

}