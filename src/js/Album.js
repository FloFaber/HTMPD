class Album{

  constructor(name, artist) {
    this.name = decodeURI(name);
    this.artist = decodeURI(artist) ?? "";
    this.template = new Template("album");
    this.render();
  }

  render(){
    $("div#split-left").html(this.template.render());
  }

  refresh(){
    console.log("AAAAA " + this.artist, typeof this.artist)
    $.get({
      url: window.WEBROOT + "/api/library.php",
      data: { "action": "album", "artist": this.artist ?? "", "album": this.name },
      success: (r) => {
        for(let i = 0; i < r.songs.length; i++){
          r.songs[i]
        }
        this.template.setData({
          "album": this.name,
          "songs": r.songs
        });
        this.render();
      }
    })
  }

}