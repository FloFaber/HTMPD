$("div#darkness").click(function(){ darkness(false); });

$("div.sidebar-item a[href='" + window.WEBROOT + window.location.pathname + "']").parent().addClass("active");

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
