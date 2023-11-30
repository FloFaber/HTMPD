$("div#darkness").on("click",function(){ darkness(false); });

let color = localStorage.getItem("color") || "#ff0066";
$("body").get(0).style.setProperty("--primary", color);

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
  }else if(url.view === "settings") {

    let template = new Template("settings");
    $("div#split-left").html(template.render());

    $.get({
      url: window.WEBROOT + "/api/output.php",
      success: (r) => {
        for(let i = 0; i < r.outputs.length; i++){
          r.outputs[i].outputid = r.outputs[i].outputid.toString();
          r.outputs[i].enabled_active = (r.outputs[i]["outputenabled"] === 1 ? "active" : "");
          r.outputs[i].disabled_active = (r.outputs[i]["outputenabled"] === 0 ? "active" : "");
        }
        template.setData({
          outputs: r.outputs,
          color: color
        });
        $("div#split-left").html(template.render());
      }
    })

    $("div#split-left").html("lul");
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
