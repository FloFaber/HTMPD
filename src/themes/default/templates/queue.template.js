window.templates.queue = `
  <h2>Queue</h2>

  <div id="action-buttons">
    <button id="queue-clear" onclick="window.queue.clear()">clear</button>
    <button id="queue-shuffle" onclick="window.queue.shuffle()">shuffle</button>
    <button id="queue-save" onclick="window.queue.save()">save...</button>
    <button id="queue-add" onclick="window.queue.add()">add...</button>
  </div>

  <table id="queue-items">
    <thead>
      <th class="track">#</th>
      <th class="title">Title</th>
      <th class="album">Album</th>
      <th class="artist">Artist</th>
    </thead>
    {{for queue_items->queue_item}}
    <tr class="queue-item" data-id="{{queue_item.id}}" onclick="window.player.play_id({{queue_item.id}})">
      <td class="track">{{queue_item.track}}</td>
      <td class="title">{{queue_item.title}}</td>
      <td class="album">{{queue_item.album}}</td>
      <td class="artist">{{queue_item.artist}}</td>
    </tr>
    {{endfor}}
  </table>
`;