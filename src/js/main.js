$("div#darkness").click(function(){ darkness(false); });


function onHashChange(e){
  let hash = window.location.hash.slice(1);
  console.log(window.location.hash);

  let url = hash.split("&").reduce((previous, current)=> { const [key, value] = current.split("="); previous[key] = value; return previous },{})


  $("div.sidebar-item").removeClass("active");
  $("div.sidebar-item a[href='#view=" + url.view + "']").parent().addClass("active");

  if(url.view === "files"){

    let paths = [{
      "path": "",
      "name": "C:"
    }]

    let ps = (url.path ? url.path.split("/") : []);
    let pf = "";
    if(url.path){
      console.log(ps);
      for(let i = 0; i < ps.length; i++){
        let pp = decodeURI(ps[i]);
        pf += (i === 0 ? "": "/") + pp;
        paths.push({
          "path": pf,
          "name": pp
        });
      }
    }


    let template = new Template("files",{paths: paths});

    new FileBrowser(url.path || "", function(data){
      data.paths = paths;
      template.setData(data);
      $("div#split-left").html(template.render());
    });

    $("div#split-left").html(template.render());
  }else if(url.view === "shortcuts"){
    $("div#split-left").html((new Template("shortcuts")).render());
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
