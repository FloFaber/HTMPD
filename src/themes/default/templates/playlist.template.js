window.templates.playlist = Handlebars.compile(`
  <h2>Playlist: {{name}}</h2>
  {{#if songs}}
  <table id="playlist">
    {{#each songs as |song|}}
    <tr>
      <td>
        <button class="inline green" title="Load" onclick="window.queue.add('{{song.file}}')">+</button>
        <button class="inline green" title="Clear Queue and Load" onclick="window.queue.replace('{{song.file}}')">~</button>
        <button class="inline green" title="Remove from playlist">-</button>
      </td>
      <td class="library-item-name">
        <span onclick="window.queue.add_id('{{song.file}}', true)">{{song.file}}</span>
      </td>
    </tr>
      
    {{/each}}
  </table>
  {{else}}
  <p>The playlist is empty.</p>
  {{/if}}
`.replace(/\n(\s*)/g, ""));