$("div#darkness").on("click",function(){ darkness(false); });

if(!localStorage.getItem("color")){
  localStorage.setItem("color", "#ff0066");
  // default colors
  if(!localStorage.getItem("colors")){
    let colors = [
      "#ff0066", // default pink
      "#4c944d", // green
      //"#7800f0",
      "#8c49d0", // purple
      "#c52b2f", // red
      "#444444", // grey
    ];
    localStorage.setItem("colors", JSON.stringify(colors));
  }

}

(new Settings()).custom_css_apply();

$.ajaxSetup({
  error: function(r){
    notification(NOTYPE_ERR, r);
  }
});

$("body").get(0).style.setProperty("--primary", localStorage.getItem("color"));

function onHashChange(e){
  let url = get_url();

  $("div.sidebar-item").removeClass("active");
  $("div.sidebar-item a[href='#" + (url.view ? "view="+url.view : "view=files") + "']").parent().addClass("active");

  if(url.view === "artists") {

    if(url.artist){
      let artist = decodeURI(url.artist ?? "");

      $.get({
        url: window.WEBROOT + "/api/library.php",
        data: { "action": "artist", "artist": artist },
        success: (r) => {
          for(let i = 0; i < r.albums.length; i++){
            r.albums[i] = {
              name: r.albums[i],
              artist: artist
            }
          }
          for(let i = 0; i < r.songs.length; i++){
            r.songs[i].display_name = r.songs[i].title || r.songs[i].file.split("/").pop()
          }

          $("div#split-left").html(window.templates.artist({
            "artist": this.name,
            "albums": r.albums,
            "songs": r.songs
          }));

        }
      })

    }else{
      $.get({
        url: window.WEBROOT + "/api/library.php",
        data: { "action": "artist" },
        success: (r) => {
          $("div#split-left").html(window.templates.artists({
            "artists": r.artists,
          }));
        }
      })
      $("div#split-left").html(window.templates.artists());
    }

  }else if(url.view === "albums"){

    if(url.album){
      let album = decodeURI(url.album ?? "");

      $.get({
        url: window.WEBROOT + "/api/library.php",
        data: { "action": "album", "album": album },
        success: (r) => {
          for(let i = 0; i < r.songs.length; i++){
            r.songs[i].track = r.songs[i].track || "";
            r.songs[i].display_name = r.songs[i].title || r.songs[i].file.split("/").pop();
          }
          $("div#split-left").html(window.templates.album({
            "album": album,
            "songs": r.songs
          }));

        }
      })

      $("div#split-left").html(window.templates.album());

    }else{
      $.get({
        url: window.WEBROOT + "/api/library.php",
        data: { "action": "album"},
        success: (r) => {
          console.log(r)
          $("div#split-left").html(window.templates.albums(r));
        }
      });

      $("div#split-left").html(window.templates.albums());
    }

  }else if(url.view === "files" || url.view === "" || typeof url.view === "undefined"){

    let paths = splitPathForFilebrowser();

    window.filebrowser = new FileBrowser(url.path || "", function(data){
      data.paths = paths;
      $("div#split-left").html(window.templates.files(data));
    });
    $("div#split-left").html(window.templates.files());

  }else if(url.view === "shortcuts"){
    $("div#split-left").html(window.templates.shortcuts());
  }else if(url.view === "settings") {

    window.settings = new Settings();

  }else if(url.view === "playlists"){

    if(!url.playlist){

      $("div#split-left").html(window.templates.playlists());

      window.playlist.refresh();

    }else{

      let name = url.playlist;
      $("div#split-left").html(window.templates.playlist());

      $.get({
        url: window.WEBROOT + "/api/playlist.php",
        data: { action: "show", name: name },
        success: (r) => {
          $("div#split-left").html(window.templates.playlist({
            name: name,
            songs: r.songs
          }));
        }
      });

    }

  }else{
    $("div#split-left").html("404 - Page not found");
  }

}

onHashChange();

window.onhashchange = onHashChange;

function form_submit(e){
  console.log(e);
  e.stopPropagation();
  e.preventDefault();

  let form = $(e.target);
  let inputs = form.find("input");
  let ondone = form.attr("ondone");
  //let onerr = form.attr("onerr");

  // on todays episode of how fucked up is fucked up:
  let action = form.attr("name");
  let url = form.attr("action");
  let type = form.attr("method") || "get";
  let data = { "action": action  };

  for(let i = 0; i < inputs.length; i++){
    let input = $(inputs[i]);
    data[input.attr("name")] = input.val();
  }

  $.ajax({
    url: url,
    type: type,
    data: data,
    success: function(r){
      for(let i = 0; i < ondone.split(";").length; i++){
        let ond = ondone.split(";")[i];
        if(ond in window){
          window[ond](r);
        }
      }
      notification(NOTYPE_SUCC, "success");
    }, error: function(r){
      notification(NOTYPE_ERR, r);
    }
  });

  return false;
}
