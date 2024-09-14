
/*
 * HTMPD
 * https://github.com/FloFaber/HTMPD
 *
 * Copyright (c) 2024 Florian Faber
 * https://www.flofaber.com
 */

function queue_save(r){
  notification(NOTYPE_SUCC, "Queue saved to playlist \""+playlist+"\"");
  $('div#darkness').hide();
}

function update_queue(){
  window.queue.update({ success: queue_update });
}

function queue_update(r){
  console.log(r);

  if(!r.length){
    $("p#queue-empty").show();
    $("table#queue-items").hide();
    return;
  }else{
    $("p#queue-empty").hide();
    $("table#queue-items").show();
  }

  (new Table({
    id: "queue-items",
    parent: $("div#queue"),
    heads: [{
      title: "#",
      attr: "track"
    },{
      title: "Title",
      attr: "title"
    },{
      title: "Album",
      attr: "album"
    },{
      title: "Artist",
      attr: "artist"
    }],
    topActions: [{
      text: "clear",
      title: "Clear Queue",
      onclick: () => { window.queue.clear({ success: update_queue }) }
    },{
      text: "shuffle",
      title: "Shuffle Queue",
      onclick: () => { window.queue.shuffle({ success: update_queue }) }
    },{
      text: "add uri",
      title: "Add custom URI to Queue",
      onclick: () => {
        window.queue.add({ uri: prompt('URI?'), success: update_queue });
      }
    },{
      text: "save",
      title: "Add selected items to playlist",
      onclick: (items) => { select_playlist(playlist => {
        let uris = [];
        items.forEach(item => {
          uris.push(item.file);
        })
        window.playlist.add(playlist, uris);
      }); }
    },{
      text: "remove",
      title: "Remove selected items from Queue",
      onclick: (items) => {
        let ids = [];
        items.forEach(item => ids.push(item.id));
        window.queue.delete_id({ ids: ids, success: update_queue });
      }
    }],
    itemActions: [],
    onItemClick: (item) => { window.player.play_id(item.id) }
  }, r)).render();


  /*$("table#queue-items tr.queue-item").remove();

  for(let i = 0; i < r.length; i++){
    let q = r[i];
    $("table#queue-items").append(`
      <tr class="queue-item" data-id="${q.id}" onclick="window.player.play_id(${q.id})" data-pos="${q.pos}">
        <td>
          <button class="inline white" onclick="{
            event.preventDefault();
            event.stopPropagation();
            window.queue.delete_id(${q.id});
          }" title="Remove from Queue">-</button>
        </td>
        <td class="track">${q.track || ""}</td>
        <td class="title">${q.title || ""}</td>
        <td class="album">${q.album || ""}</td>
        <td class="artist">${q.artist || ""}</td>
      </tr>
    `);
  }*/

  let pos_old;
  let pos_new;
  $("table#queue-items").sortable({
    cursor: 'row-resize',
    placeholder: 'ui-state-highlight',
    opacity: '0.55',
    items: 'tr',
    helper:'clone', // fix for #2
    start: function(event, item){
      pos_old = $(item.item).data("pos");
    }, stop: (event, item) => {
      pos_new = $(item.item).index()-1;
      window.queue.move({ from: pos_old, to: pos_new });
    }
  }).disableSelection();

  $("table#queue-items tr.item").removeClass("active");
  $("table#queue-items tr.item[data-id='"+window.player.data.current_song.id+"']").addClass("active");

  $("div#split-right").scrollTop(localStorage.getItem("scrollTop") || 0);
}
