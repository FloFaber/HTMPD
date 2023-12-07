window.templates.playlists = Handlebars.compile(`
  
  
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px">
    <h2 style="margin:0">Playlists</h2>
    <button onclick="window.playlist.create()">Create</button>
  </div>
  
  {{#if playlists}}
  <table id="playlists">
  {{#each playlists as |playlist|}}
    <tr>
      <td>
        <button class="inline green" title="Load" onclick="window.playlist.load('{{playlist}}')">+</button>
        <button class="inline yellow" title="Clear Queue and Load" onclick="window.playlist.replace('{{playlist}}')">~</button>
        <button class="inline red" title="Delete Playlist" onclick="window.playlist.delete('{{playlist}}')">-</button>
      </td>
      <td class="library-item-name">
        <a href="#view=playlists&playlist={{playlist}}">{{playlist}}</a>
      </td>
    </tr>
  {{/each}}
  </table>
  {{else}}
  <p>No playlists.</p>
  {{/if}}
`.replace(/\n(\s*)/g, ""));