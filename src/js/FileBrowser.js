class FileBrowser{

  constructor(path = "", callback = function(){}) {
    $.get({
      url: window.WEBROOT + "/api/library.php",
      data: { path: path, },
      success: function(r){
        for(let i = 0; i < r.library.directories.length; i++){
          r.library.directories[i]["display_name"] = r.library.directories[i]["name"].split("/").pop();
        }
        for(let i = 0; i < r.library.files.length; i++){
          r.library.files[i]["display_name"] = r.library.files[i]["name"].split("/").pop();
        }
        callback(r.library);
      }
    })
  }

  search(keyword, event){

    if(event.key !== "Enter"){ return; }

    let url = window.location.hash.slice(1).split("&").reduce((previous, current)=> { const [key, value] = current.split("="); previous[key] = value; return previous },{})
    let paths = splitPathForFilebrowser();
    let path = decodeURI(url.path);

    console.log(path)

    $.get({
      url: window.WEBROOT + "/api/library.php",
      data: { "action": "search", "keyword": keyword, "path": path },
      success: (r) => {

        for(let i = 0; i < r.files.length; i++){
          r.files[i].name = r.files[i].file;
          r.files[i].display_name = r.files[i].file.slice(path.length > 0 ? path.length+1 : 0);
        }

        window.views.files.setData({
          paths: paths,
          files: r.files,
          directories: []
        });

        $("div#split-left").html(window.views.files.render());

      }
    })

    event.preventDefault();
    event.stopPropagation();
  }

}