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
            <span class="library-item-actions">
              <button class="library-item-add inline green" title="add to queue" data-uri="${f.name}">+</button>
            </span>
            <a class="library-item-name" href="#path:${f.name}">${name}/</a>
          </div>
        `;
      }
      for(let i = 0; i < r.library.files.length; i++){
        let f = r.library.files[i];
        let path = f.name.split("/");
        let name = path.pop();
        s += `
          <div class="library-item library-item-file">
            <span class="library-item-actions">
              <button class="library-item-add inline green" title="add to queue" data-uri="${f.name}">+</button>
            </span>
            <span class="library-item-name" data-uri="${f.name}">${name}</span>
          </div>
        `;
      }
      $("div#library").html(s);

      $("div.library-item-file span.library-item-name").on("click", function(){
        let uri = $(this).data("uri");
        $.post({
          url: window.WEBROOT + "/api/queue.php",
          data: { "action": "add_id", "uri": uri, "play": true },
          success: function(r){

          }, error: function(r){
            notification(NOTYPE_ERR, r);
          }
        })
      });

      $("button.library-item-add").on("click", function(){
        let uri = $(this).data("uri");
        library_add(uri);
      });
    },
    error: function(r){
      notification(NOTYPE_ERR, r);
    }
  });
}

function library_add(uri){
  $.post({
    url: window.WEBROOT + "/api/queue.php",
    data: { "action": "add", uri: uri },
    success: function(r){
      notification(NOTYPE_SUCC, "loaded \"" + uri + "\".");
    }, error: function(r){
      notification(NOTYPE_ERR, r);
    }
  })
}

library_refresh();

$(window).on("hashchange", function(e){
  library_refresh();
});

$("button#db-update").on("click", function (){
  $.post({
    url: window.WEBROOT + "/api/library.php",
    data: {
      action: "update"
    },
    success: function(r){
      console.log(r);
      notification(NOTYPE_SUCC, "Updating DB with Job #" + r.job);
    },
    error: function(r){ notification(NOTYPE_ERR, r) }
  })
});
