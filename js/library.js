function library_refresh(){
  let h = window.location.hash.replace("#", "");
  let p = "";
  if(h.split(":").length === 2){
    p = h.split(":")[1];
  }

  let s = "<span class='library-path-item'><a href=''>C:</a>/</span>";
  let ppi = "";
  if(p){
    let ps = p.split("/");
    for(let i = 0; i < ps.length; i++){
      let pp = decodeURI(ps[i]);
      //ppi += pp + (i === ps.length-1 ? "" : "/");
      ppi += (i === 0 ? "": "/") + pp;
      s += "<span class='library-path-item'><a href='#path:"+ppi+"'>"+pp+"</a>/</span>";
    }
  }
  $("div#library-path").html(s);

  $.get({
    url: window.WEBROOT + "/api/library.php",
    data: { "path": p },
    success: function(r){

      let s = "";
      for(let i = 0; i < r.library.directories.length; i++){
        let f = r.library.directories[i];
        let path = f.name.split("/");
        let name = path.pop();
        s += `
          <div class="library-item library-item-dir">
            <a href="#path:${f.name}">${name}/</a>
          </div>
        `;
      }
      for(let i = 0; i < r.library.files.length; i++){
        let f = r.library.files[i];
        let path = f.name.split("/");
        let name = path.pop();
        s += `
          <div class="library-item library-item-dir">
            <span>${name}</span>
          </div>
        `;
      }
      $("div#library").html(s);
    },
    error: function(r){
      notification(NOTYPE_ERR, r);
    }
  });
}

library_refresh();

$(window).on("hashchange", function(e){
  library_refresh();
});
