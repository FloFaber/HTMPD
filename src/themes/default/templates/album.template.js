window.templates.album = `
  <h2>Album: {{album}}</h2>
  <table>
    {{for songs->song}}
    <tr>
      <td>{{song.title}}</td>
    </tr>
    {{endfor}}
  </table>
`;