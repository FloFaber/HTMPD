class Settings extends Events {

  constructor() {
    super();
    this.events = {
      onUpdate: [],
      onOutputSet: [],
      onCrossfadeChange: []
    }

    this.update();

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
