window.templates.files = `
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px">
    <h2 style="margin:0">Files</h2>
    <button id="db-update" onclick="window.library.update_db()">Update DB</button>
  </div>

  <div>
    <div id='library-path'>
      {{for paths->path}}
      <span class='library-path-item'><a href='#view=files&path={{path.path}}'>{{path.name}}</a>/</span>
      {{endfor}}
    </div>
    <div style="margin-bottom: 15px;">
      <input type="text" id="search" placeholder="Search" onkeydown="window.filebrowser.search(this.value, event)">
      <button class="inline red" onclick="window.onHashChange()">X</button>
    </div>  
  </div>
  
  <table id='library'>
    <tbody>
    {{for directories->dir}}
    <tr class="library-item">
      <td class="library-item-actions">
        <button class="inline green" data-uri="{{dir.name}}" data-replace="false" onclick="window.queue.add('{{dir.name}}',false);">+</button>
        <button class="inline yellow" data-uri="{{dir.name}}" data-replace="true" onclick="window.queue.add('{{dir.name}}',true);">~</button>
      </td>
      <td class="library-item-name"><a href="#view=files&path={{dir.name}}">{{dir.display_name}}/</a></td>
    </tr>
    {{endfor}}
    
    {{for files->file}}
    <tr class="library-item">
      <td class="library-item-actions">
        <button class="inline green" data-uri="{{file.name}}" data-replace="false" onclick="window.queue.add('{{file.name}}',false);">+</button>
        <button class="inline yellow" data-uri="{{file.name}}" data-replace="true" onclick="window.queue.add('{{file.name}}',true);">~</button>
      </td>
      <td class="library-item-name">
        <span onclick="window.queue.add_id('{{file.name}}', true)">{{file.display_name}}</span>
      </td>
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
      <button class="inline green" data-uri="{{name}}" data-replace="false" onclick="window.queue.add('{{name}}',false);">+</button>
      <button class="inline yellow" data-uri="{{name}}" data-replace="true" onclick="window.queue.add('{{name}}',true);">~</button>
    </td>
    <td class="library-item-name"><a href="#view=files&path={{name}}">{{display_name}}/</a></td>
  </tr>
`;

window.templates.file_song = `
  <tr class="library-item">
    <td class="library-item-actions">
      <button class="inline green" data-uri="{{name}}" data-replace="false" onclick="window.queue.add('{{name}}',false);">+</button>
      <button class="inline yellow" data-uri="{{name}}" data-replace="true" onclick="window.queue.add('{{name}}',true);">~</button>
    </td>
    <td class="library-item-name"><span>{{display_name}}</span></td>
  </tr>
`;