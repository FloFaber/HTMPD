window.templates.artist = `
  <h2>Artist: {{artist}}</h2>
  <table>
    {{for albums->album}}
    <tr>
      <td>
        <a href="#view=albums&album={{album.name}}&artist={{album.artist}}">{{album.name}}</a>
      </td>
    </tr>
    {{endfor}}
  </table>
`;