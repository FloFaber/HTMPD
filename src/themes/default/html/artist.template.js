window.templates.artist = Handlebars.compile(`
  <h2>{{artist}}'s Albums</h2>
  {{#if albums}}
  <table>
    {{#each albums as |album|}}
    <tr>
      <td>
        <button class="inline green" title="Load" onclick="window.library.search_add([{
          tag: 'album',
          operator: '==',
          value: '{{album.name}}'
        }], false)">+</button>
        <button class="inline yellow" title="Clear queue and Load" onclick="window.library.search_add([{
          tag: 'album',
          operator: '==',
          value: '{{album.name}}'
        }], true)">~</button>
      </td>
      <td class="library-item-name">
        <a href="#view=albums&album={{album.name}}&artist={{album.artist}}">{{album.name}}</a>
      </td>
    </tr>
    {{/each}}
  </table>
  {{else}}
  <p>None.</p>
  {{/if}}
  
  <h2>Songs not in Albums</h2>
  {{#if songs}}
  <table>
    {{#each songs as |song|}}
    <tr>
      <td>
        <button class="inline green" title="Load" onclick="window.queue.add('{{song.file}}')">+</button>
        <button class="inline green" title="Clear queue and Load" onclick="window.queue.replace('{{song.file}}')">~</button>
      </td>
      <td class="library-item-name">
        <span title="{{song.file}}" onclick="window.queue.add_id('{{song.file}}', true)">{{song.display_name}}</span>
      </td>
    </tr>
    {{/each}}
  </table>
  {{else}}
  <p>None.</p>
  {{/if}}
`.replace(/\n(\s*)/g, ""));