class Popup {

  constructor(content = "") {
    this.content = content;
    $("div#darkness").html(this.content).css("display", "flex");
  }

  remove(){
    $("div#darkness").hide().html("");
  }

}