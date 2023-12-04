$("div#darkness").on("click",function(){ darkness(false); });

if(!localStorage.getItem("color")){
  localStorage.setItem("color", "#ff0066");
}


$("body").get(0).style.setProperty("--primary", localStorage.getItem("color"));

function onHashChange(e){
  let hash = window.location.hash.slice(1);
  let url = hash.split("&").reduce((previous, current)=> { const [key, value] = current.split("="); previous[key] = value; return previous },{})

  console.log(url);

  $("div.sidebar-item").removeClass("active");
  $("div.sidebar-item a[href='#" + (url.view ? "view="+url.view : "") + "']").parent().addClass("active");

  if(url.view === "artists" || url.view === "" || typeof url.view === "undefined") {

    if(url.artist){
      let artist = new Artist(decodeURI(url.artist ?? ""));
      artist.refresh();
    }else{
      let artists = new Artists();
      artists.refresh();
    }

  }else if(url.view === "albums"){

    if(url.album){
      let album = new Album(decodeURI(url.album ?? ""), decodeURI(url.artist ?? ""));
      album.refresh();
    }else{
      let albums = new Albums();
      albums.refresh();
    }

  }else if(url.view === "files"){

    let paths = splitPathForFilebrowser();


    window.views.files = new Template("files",{paths: paths});

    window.filebrowser = new FileBrowser(url.path || "", function(data){
      data.paths = paths;
      window.views.files.setData(data);
      $("div#split-left").html(window.views.files.render());
    });



    $("div#split-left").html(window.views.files.render());
  }else if(url.view === "shortcuts"){
    window.views.shortcuts = new Template("shortcuts")
    $("div#split-left").html(window.views.shortcuts.render());
  }else if(url.view === "settings") {

    window.settings = new Settings();
    $("div#split-left").html(window.settings.template.render());



  }else if(url.view === "playlists"){

    console.log(url)

    if(!url.playlist){

      window.views.playlists = new Template("playlists");
      $("div#split-left").html(window.views.playlists.render());

      $.get({
        url: window.WEBROOT + "/api/playlist.php",
        success: (r) => {
          console.log(r);
          window.views.playlists.setData({
            playlists: r.playlists,
          });
          $("div#split-left").html(window.views.playlists.render());
        }
      });

    }else{

      let name = url.playlist;
      window.views.playlist = new Template("playlist");
      $("div#split-left").html(window.views.playlist.render());

      $.get({
        url: window.WEBROOT + "/api/playlist.php",
        data: { action: "show", name: name },
        success: (r) => {
          window.views.playlist.setData({
            name: name,
            songs: r.songs
          });
          $("div#split-left").html(window.views.playlist.render());
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
