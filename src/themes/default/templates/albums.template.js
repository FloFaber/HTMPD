window.templates.albums = Handlebars.compile(`
  <h2>Albums</h2>
  
  {{#each artists as |artist artistId|}}
    {{#if artist.album}}
      <h3>{{artistId}}</h3>
      <table style="padding-bottom: 30px;">
        {{#each artist.album as |album|}}
        <tr>
          <td>
            <button class="inline green" title="Load" onclick="window.library.search_add([{
              tag: 'album',
              operator: '==',
              value: '{{album}}'
            }], false)">+</button>
            <button class="inline green" title="Load" onclick="window.library.search_add([{
              tag: 'album',
              operator: '==',
              value: '{{album}}'
            }], true)">~</button>
          </td>
          <td class="library-item-name">
            <a href="#view=albums&album={{album}}">{{album}}</a>
          </td>
        </tr>
        {{/each}}
      </table>
    {{/if}}
  {{/each}}
`.replace(/\n(\s*)/g, ""));