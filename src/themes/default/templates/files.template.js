window.templates.files = `
  <h2>Files</h2>
  <div id="action-buttons">
    <button id="db-update">Update DB</button>
  </div>

  <div id='library-path'>
    {{for paths->path}}
    <span class='library-path-item'><a href='#view=files&path={{path.path}}'>{{path.name}}</a>/</span>
    {{endfor}}
  </div>
  <table id='library'>
    <tbody>
    {{for directories->dir}}
    <tr class="library-item">
      <td class="library-item-actions">
        <button class="inline green" data-uri="{{dir.name}}" data-replace="false" onclick="library_add('{{dir.name}}',false,true);">+</button>
        <button class="inline yellow" data-uri="{{dir.name}}" data-replace="true" onclick="library_add('{{dir.name}}',true,true);">~</button>
      </td>
      <td class="library-item-name"><a href="#view=files&path={{dir.name}}">{{dir.display_name}}/</a></td>
    </tr>
    {{endfor}}
    
    {{for files->file}}
    <tr class="library-item">
      <td class="library-item-actions">
        <button class="inline green" data-uri="{{file.name}}" data-replace="false" onclick="library_add('{{file.name}}',false,true);">+</button>
        <button class="inline yellow" data-uri="{{file.name}}" data-replace="true" onclick="library_add('{{file.name}}',true,true);">~</button>
      </td>
      <td class="library-item-name"><span>{{file.display_name}}</span></td>
    </tr>
    {{endfor}}
    
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