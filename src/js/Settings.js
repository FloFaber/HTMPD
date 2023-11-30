class Settings{

  constructor() {
    this.template = new Template("settings");
  }

  refresh(){

  }

}

function output_set(id, state){
  $.post({
    url: window.WEBROOT + "/api/output.php",
    data: { action: "state", id: id, enable: state },
    success: (r) => {
      onHashChange();
    }
  })
}

function color_set(elem){
  let color;
  if(typeof elem === "string"){
    color = elem;
  }else{
    color = $(elem).val();
  }

  localStorage.setItem("color", color);
  $("body").get(0).style.setProperty("--primary", color);
}