window.templates.artists = `
  <h2>Artists</h2>
  <table>
    {{for artists->artist}}
    <tr>
      <td>
        <button class="inline green" title="Load" onclick="window.library.search_add([
          {
            'tag': 'artist',
            'operator': '==',
            'value': '{{artist}}'
          }], false)">+</button>
        <button class="inline yellow" title="Clear queue and load" onclick="window.library.search_add([
          {
            'tag': 'artist',
            'operator': '==',
            'value': '{{artist}}'
          }], true)">~</button>
      </td>
      <td class="library-item-name">
        <a href="#view=artists&artist={{artist}}">{{artist}}</a>  
      </td>
    </tr>
    {{endfor}}
  </table>
`;