window.templates.album = Handlebars.compile(`
  <h2>Album: {{album}}</h2>
  <table>
    <thead>
      <th></th>
      <th class="track">#</th>
      <th class="title">Title</th>
    </thead>
    {{#each songs as |song|}}
    <tr>
      <td>
        <button class="inline green" title="Load" onclick="window.queue.add('{{song.file}}')">+</button>
        <button class="inline yellow" title="Clear queue and Load" onclick="window.queue.replace('{{song.file}}')">~</button>
      </td>
      <td>
        {{song.track}}
      </td>
      <td class="library-item-name">
        <span onclick="window.queue.add_id('{{song.file}}', true)">{{song.display_name}}</span>
      </td>
    </tr>
    {{/each}}
  </table>
`.replace(/\n(\s*)/g, ""));