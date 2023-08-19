function output_refresh(){
  $.get({
    url: window.WEBROOT + "/api/output.php",
    success: function(r){
      let s = "";
      for(let i = 0; i < r.outputs.length; i++){
        let o = r.outputs[i];
        s += `
          <div class="output">
            <span>${o.outputname}</span>
            <span>
              <button class="output_enable ${(o.outputenabled ? "active":"")}" data-outputname="${o.outputname}" data-outputid="${o.outputid}">On</button>
              <button class="output_disable ${(o.outputenabled ? "":"active")}" data-outputname="${o.outputname}" data-outputid="${o.outputid}">Off</button>
            </span>
          </div>
        `;
      }
      $("div#outputs").html(s);

      $("button.output_enable").on("click", function(){
        output_set_state($(this).data("outputid"), true);
      });
      $("button.output_disable").on("click", function(){
        output_set_state($(this).data("outputid"), false);
      });

    }
  })
}



function output_set_state(id, enable){
  $.post({
    url: window.WEBROOT + "/api/output.php",
    data: { "action": "state", "id": id, enable: (enable ? 1 : 0) },
    success: function(){
      player_refresh();
      output_refresh();
    },
    error: function(r){
      notification(NOTYPE_ERR, r);
    }
  })
}

output_refresh();