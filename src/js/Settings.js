class Settings{

  constructor() {
    $("div#split-left").html(window.templates.settings());
    this.refresh();
  }

  refresh(){

    $.get({
      url: window.WEBROOT + "/api/output.php",
      success: (r) => {
        for(let i = 0; i < r.outputs.length; i++){
          r.outputs[i].outputid = r.outputs[i].outputid.toString();
          r.outputs[i].enabled_active = (r.outputs[i]["outputenabled"] === 1 ? "active" : "");
          r.outputs[i].disabled_active = (r.outputs[i]["outputenabled"] === 0 ? "active" : "");
        }
        console.log(localStorage.getItem("colors") || []);

        $("div#split-left").html(window.templates.settings({
          outputs: r.outputs,
          crossfade: window.player.status.xfade || 0,
          color: localStorage.getItem("color") || "#ff0066",
          colors: JSON.parse(localStorage.getItem("colors")) || []
        }));
      }
    });

  }

  crossfade(event, value){
    if(event === null && value === null){
      event = {
        key: "Enter"
      };
      value = $("input#crossfade").val();
    }
    if(event.key === "Enter"){
      $.post({
        url: window.WEBROOT + "/api/player.php",
        data: { action: "crossfade", "crossfade": value},
        success: function(r){
          notification(NOTYPE_SUCC, "Crossfade changed to "+value+" seconds.");
        }
      })
    }
  }


  output_set(id, state){
    $.post({
      url: window.WEBROOT + "/api/output.php",
      data: { action: "state", id: id, enable: state },
      success: (r) => {
        this.refresh();
      }
    })
  }

  color_set(color, update_input = false){
    localStorage.setItem("color", color);
    $("body").get(0).style.setProperty("--primary", color);
    if(update_input){
      $("input#accent").val(color);
    }
  }

  // save the current color
  color_save(){
    let colors = JSON.parse(localStorage.getItem("colors")) || [];
    let current = localStorage.getItem("color");
    if(!colors.includes(current)){
      colors.push(current);
      localStorage.setItem("colors", JSON.stringify(colors));
    }
    this.refresh();
  }

  color_delete(color){
    let colors = JSON.parse(localStorage.getItem("colors"));
    let colors_new = []; // this is BS
    for(let i = 0; i < colors.length; i++){
      if(colors[i] !== color){
        colors_new.push(colors[i]);
      }
    }
    localStorage.setItem("colors", JSON.stringify(colors_new));
    this.refresh();
  }


}
