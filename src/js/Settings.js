class Settings{

  constructor() {
    this.events = {
      onUpdate: [],
      onOutputSet: [],
      onCrossfadeChange: []
    }

    this.update();

  }

  on(name, cb){
    this.events["on" + capitalizeFirstLetter(name)].push(cb);
  }

  execOns(name, data){
    for(let i = 0; i < this.events["on" + capitalizeFirstLetter(name)].length; i++){
      this.events["on" + capitalizeFirstLetter(name)][i](data);
    }
  }

  update(){

    $.get({
      url: window.WEBROOT + "/api/output.php",
      success: (r) => {
        this.execOns("update", {
          outputs: r.outputs
        });
      }
    });

  }

  crossfade(value){
    $.post({
      url: window.WEBROOT + "/api/player.php",
      data: { action: "crossfade", "crossfade": value},
      success: (r) => {
        this.execOns("crossfadeChange", value);
      }
    })
  }




  output_set(id, state){
    $.post({
      url: window.WEBROOT + "/api/output.php",
      data: { action: "state", id: id, enable: state },
      success: (r) => {
        this.execOns("outputSet", {
          id: id,
          state: state
        });
      }
    })
  }




}
