const NOTYPE_ERR = 1;
const NOTYPE_SUCC = 0;

function random_int(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function htmlspecialchars(unsafe){
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function notification(type, msg = ""){

  let id = random_int(0,100000);
  let classname = "notification";
  if(type === NOTYPE_ERR){ classname += " error"; }
  if(type === NOTYPE_SUCC){ classname += " success"; }

  if(typeof msg === "object"){
    let json = msg.responseJSON;
    if(typeof json !== "undefined"){
      msg = json.error + ": " + json.msg;
    }else{
      msg = "Error " + msg.status + ": " + msg.statusText;
    }
  }

  if(typeof msg === "undefined" || msg === ""){ msg = "Undefined error"; }

  $("div#notifications").append(`<div class="${ classname }" id="notification-${ id }">
    ${ htmlspecialchars(msg) }
  </div>`);

  setTimeout(function(){
    $("div#notification-"+id).fadeOut(200, function(){ $(this).remove() });
  }, 7000);
}

function sec2minsec(secs){
  let minutes = Math.floor(secs / 60);
  let seconds = secs - minutes * 60;
  return minutes.toString().padStart(2,"0") + ":" + seconds.toString().padStart(2,"0");
}

function song2text(songobj){

}

function set_content_cursor(cursor = "unset"){
  $("div#content").attr("class", "cursor-"+cursor); // ugly hack
}

function map(i, in_min, in_max, out_min, out_max){
  return (i - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
