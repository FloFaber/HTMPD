window.templates.artist = Handlebars.compile(`
  <h2>Artist: {{artist}}</h2>
  
  <h2>Albums</h2>
  {{#if albums}}
  <table>
    {{#each albums as |album|}}
    <tr>
      <td>
        <button class="inline green" title="Load" onclick="window.library.search_add([{
          tag: 'album',
          operator: '==',
          value: '{{album}}'
        }], false)">+</button>
        <button class="inline yellow" title="Clear queue and Load" onclick="window.library.search_add([{
          tag: 'album',
          operator: '==',
          value: '{{album}}'
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
        <button class="inline green" title="Load">+</button>
        <button class="inline green" title="Clear queue and Load">~</button>
      </td>
      <td class="library-item-name">
        <span title="{{song.file}}">{{song.display_name}}</span>
      </td>
    </tr>
    {{/each}}
  </table>
  {{else}}
  <p>None.</p>
  {{/if}}
`.replace(/\n(\s*)/g, ""));