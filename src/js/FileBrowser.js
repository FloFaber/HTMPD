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

}