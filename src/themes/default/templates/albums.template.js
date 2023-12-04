window.templates.albums = `
  <h2>Albums</h2>
  <table>
    {{for albums->album}}
    <tr>
      <td>
        <a href="#view=albums&album={{artist}}">{{album}}</a>  
      </td>
    </tr>
    {{endfor}}
  </table>
`;