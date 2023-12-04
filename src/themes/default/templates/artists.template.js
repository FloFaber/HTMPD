window.templates.artists = `
  <h2>Artists</h2>
  <table>
    {{for artists->artist}}
    <tr>
      <td>
        <a href="#view=artists&artist={{artist}}">{{artist}}</a>  
      </td>
    </tr>
    {{endfor}}
  </table>
`;