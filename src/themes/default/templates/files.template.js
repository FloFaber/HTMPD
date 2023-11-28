window.templates.files = `
  <h2>Files</h2>
  <div id="action-buttons">
    <button id="db-update">Update DB</button>
  </div>

  <div id='library-path'>
    {{paths@library_path_item}}
  </div>
  <table id='library'>
    <tbody>
    {{directories@file_directory}}
    {{files@file_song}}
    </tbody>
  </table>
`;

window.templates.library_path_item = `
  <span class='library-path-item'><a href='#view=files&path={{path}}'>{{name}}</a>/</span>
`;



window.templates.file_directory = `
  <tr class="library-item">
    <td class="library-item-actions">
      <button class="inline green" data-uri="{{name}}" data-replace="false" onclick="library_add('{{name}}',false,true);">+</button>
      <button class="inline yellow" data-uri="{{name}}" data-replace="true" onclick="library_add('{{name}}',true,true);">~</button>
    </td>
    <td class="library-item-name"><a href="#view=files&path={{name}}">{{display_name}}/</a></td>
  </tr>
`;

window.templates.file_song = `
  <tr class="library-item">
    <td class="library-item-actions">
      <button class="inline green" data-uri="{{name}}" data-replace="false" onclick="library_add('{{name}}',false,true);">+</button>
      <button class="inline yellow" data-uri="{{name}}" data-replace="true" onclick="library_add('{{name}}',true,true);">~</button>
    </td>
    <td class="library-item-name"><span>{{display_name}}</span></td>
  </tr>
`;