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
        for(let i = 0; i < r.songs.length; i++){
          r.songs[i].display_name = r.songs[i].title || r.songs[i].file.split("/").pop()
        }
        this.template.setData({
          "artist": this.name,
          "albums": r.albums,
          "songs": r.songs
        });
        this.render();
      }
    })
  }

}