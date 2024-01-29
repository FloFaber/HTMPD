window.templates.popup_playlist_selection = Handlebars.compile(`
  <div class="popup" onclick="event.stopPropagation();">
    <h2>Select Playlist:</h2>
    <button onclick="window.playlist.create(
      (r, name) => {
        $('select#playlist').val(name).change();
      }
    ); window.queue.save_dialog();">create playlist</button>
    {{#if playlists}}
    <form id="playlist-selection" onsubmit="window.queue.save(); event.stopPropagation(); event.preventDefault(); return false;">
      <select id="playlist" style="width: 100%;">
        {{#each playlists as |playlist|}}
        <option value="{{playlist}}">{{playlist}}</option>
        {{/each}}
      </select>
      <div style="margin-top: 15px">
        <button type="submit">save</button>
      </div>
    </form>
    {{else}}
    <p>No playlists...</p>
    {{/if}}
  </div>
`);