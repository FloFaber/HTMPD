const NOTYPE_WARN = 2;
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
  if(type === NOTYPE_WARN){ classname += " warning"; }

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
  let seconds = Math.floor(secs - minutes * 60);
  return minutes.toString().padStart(2,"0") + ":" + seconds.toString().padStart(2,"0");
}

function song2text(song){
  let text = "";
  if(song && song.file){
    if(song.file.startsWith("http://") || song.file.startsWith("https://")){
      if(song.name){
        text = song.name;
      }else{
        text = song.file;
      }
    }else{
      if(song.name){ text += song.name+": "; }
      if(song.title){ text += song.title; }else{ text = song.file.split("/").pop(); }
    }
  }
  return text;
}

function set_content_cursor(cursor = "unset"){
  $("div#content").attr("class", "cursor-"+cursor); // ugly hack
}

function map(i, in_min, in_max, out_min, out_max){
  return (i - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function darkness(state){
  if(state){
    $("div#darkness").css("display", "flex");
  }else{
    $("div#darkness").css("display", "none");
  }
  $("div.darkness-item").click(function(e){ console.log("CLICK"); e.stopPropagation(); });
}

// example hash: #artist:ABBA;album:Arrival
function hash_parse(hash = window.location.hash){
  let r = [];
  hash = hash.replace("#", "");
  let hs = hash.split(";");
  for(let i = 0; i < hs.length; i++){
    let hsi = hs[i].split(":");
    r[hsi[0]] = decodeURI(hsi[1]);
  }
  return r;
}

function get_url(hash = window.location.hash){
  return hash.slice(1).split("&").reduce((previous, current)=> {
    const [key, value] = current.split("=");
    previous[key] = decodeURI(value);
    return previous
  },{});
}

function darkness_on(){ darkness(true); }
function darkness_off(){ darkness(false); }

function text_input_has_focus(){
  return $("input[type='text'],textarea").is(":focus");
}

function splitPathForFilebrowser(){

  let url = window.location.hash.slice(1).split("&").reduce((previous, current)=> { const [key, value] = current.split("="); previous[key] = value; return previous },{})

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
  return paths;
}