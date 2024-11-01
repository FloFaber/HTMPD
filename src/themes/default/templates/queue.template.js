window.templates.queue = Handlebars.compile(`
  <h2>Queue</h2>

  <div id="action-buttons">
    <button id="queue-clear" onclick="window.queue.clear()">clear</button>
    <button id="queue-shuffle" onclick="window.queue.shuffle()">shuffle</button>
    <button id="queue-save" onclick="window.queue.save_dialog()">save...</button>
    <button id="queue-add" onclick="window.queue.add(prompt('URI?'))">add...</button>
  </div>

  {{#if queue_items}}
  <table id="queue-items">
    <thead>
      <th></th>
      <th class="track">#</th>
      <th class="title">Title</th>
      <th class="album">Album</th>
      <th class="artist">Artist</th>
    </thead>
    {{#each queue_items as |queue_item|}}
    <tr class="queue-item" data-id="{{queue_item.id}}" onclick="window.player.play_id({{queue_item.id}})" data-pos="{{queue_item.pos}}">
      <td>
        <button class="inline white" onclick="window.queue.delete_id({{queue_item.id}}, event)" title="Remove from Queue">-</button>
      </td>
      <td class="track">{{queue_item.track}}</td>
      <td class="title">{{queue_item.title}}</td>
      <td class="album">{{queue_item.album}}</td>
      <td class="artist">{{queue_item.artist}}</td>
    </tr>
    {{/each}}
  </table>
  {{else}}
  <p>The Queue is empty. Go to <a href="#view=files">Files</a>, <a href="#view=artists">Artists</a> or <a href="#view=albums">Albums</a> to add songs.</p>
  {{/if}}
`.replace(/\n(\s*)/g, ""));