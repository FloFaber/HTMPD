window.templates.library = `
  <h2>Library</h2>
  <h3>Artists</h3>
  
  <table>
  {{for artists->artist}}
    <tr>
      <td class="library-item-name">
        <a href="#view=library&artist={{artist}}">{{artist}}</a>
      </td>
    </tr>
  {{endfor}}
  </table>
  
  <h2>Albums</h2>
  <table>
  {{for artists->artist}}
    <tr>
      <td class="library-item-name">
        <a href="#view=library&artist={{artist}}">{{artist}}</a>
      </td>
    </tr>
  {{endfor}}
  </table>
  
  <h2>Genres</h2>
  <table>
  {{for artists->artist}}
    <tr>
      <td class="library-item-name">
        <a href="#view=library&artist={{artist}}">{{artist}}</a>
      </td>
    </tr>
  {{endfor}}
  </table>
`;