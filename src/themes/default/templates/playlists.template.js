window.templates.playlists = `
  <h2>Playlists</h2>
  
  <table id="playlists">
  {{for playlists->playlist}}
    <tr>
      <td>
        <button class="inline green" title="Load" onclick="window.playlist.load('{{playlist}}')">+</button>
        <button class="inline yellow" title="Clear Queue and Load" onclick="window.playlist.replace('{{playlist}}')">~</button>
        <button class="inline red" title="Delete Playlist">-</button>
      </td>
      <td class="library-item-name">
        <a href="#view=playlists&playlist={{playlist}}">{{playlist}}</a>
      </td>
    </tr>
  {{endfor}}
  </table>
`;