let last_queue_item_marked = null;

function queue_item_mark(e){
  let btn = $(e.target);
  let id = btn.parent().parent().data("id");

  if(id === "all"){
    let marked = btn.attr("marked");
    let btns = $("div.queue-item").find("button.queue-item-mark");
    btns.text((marked === "1" ? " " : "x"));
    btns.attr("marked", (marked === "1" ? "0" : "1"));
    return;
  }

  if(e.originalEvent.shiftKey === true && id != last_queue_item_marked){

  }

  last_queue_item_marked = id;

  if(btn.attr("marked") === "1"){
    btn.attr("marked", "0");
    btn.text(" ");
    let x = $("div#queue-item-all").find("button.queue-item-mark");
    x.attr("mark", "0");
    x.text(" ");
  }else{
    btn.attr("marked", "1");
    btn.text("x");
  }
}

function queue_refresh(){
  $.ajax({
    url: window.WEBROOT + "/api/queue.php",
    success: function(r){
      let s = `<div class="queue-item" id="queue-item-all" data-id="all">
        <span class="queue-item-actions">
          <button class="queue-item-mark inline blue" title="mark all"> </button>
          <button class="queue-item-remove inline red" title="remove all from queue">-</button>
          <button class="queue-item-add inline green" title="add all to playlist">+</button>
        </span>
      </div>`.replace(/\n(\s*)/g, "");

      for(let i = 0; i < r.queue.length; i++){
        let q = r.queue[i];
        s += `<div class="queue-item" id="queue-item-${ q.id }" data-id="${ q.id }">
          <span class="queue-item-actions">
            <button class="queue-item-mark inline blue" title="mark"> </button>
            <button class="queue-item-remove inline red" title="remove from queue">-</button>
            <button class="queue-item-add inline green" title="add to playlist">+</button>
          </span>
          <span class="queue-item-title">${ htmlspecialchars(q.file) }</span>
        </div>`.replace(/\n(\s*)/g, ""); // remove linebreaks and spaces from indentation
      }
      if(r.queue.length === 0){
        s = `<p style="color: grey;">The Queue is empty. You can load <a href="${ window.WEBROOT }/page/playlists.php">Playlists</a> or songs from the <a href="${ window.WEBROOT }/page/library.php">Library</a>.`;
      }
      $("div#queue").html(s);

      $("span.queue-item-title").click(function(){
        let id = $(this).parent().data("id");
        if(!id){ return; }
        $("div.queue-item").removeClass("active");
        player_play_id(id);
      });

      $("button.queue-item-mark").click(queue_item_mark);


    },
    error: function(r){
      notification(NOTYPE_ERR, "asdf asdf");
    }
  });
}

//setInterval(queue_refresh, 5000);
queue_refresh();
