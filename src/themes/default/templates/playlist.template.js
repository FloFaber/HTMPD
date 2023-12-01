window.templates.playlist = `
  <h2>Playlist: {{name}}</h2>
  <table id="playlist">
    {{for songs->song}}
    <tr>
      <td>
        <button class="inline green" title="Load" onclick="window.queue.add('{{song.file}}')">+</button>
        <button class="inline green" title="Clear Queue and Load" onclick="window.queue.replace('{{song.file}}')">~</button>
        <button class="inline green" title="Remove from playlist">-</button>
      </td>
      <td>
        <span>{{song.file}}</span>
      </td>
    </tr>
      
    {{endfor}}
  </table>
`