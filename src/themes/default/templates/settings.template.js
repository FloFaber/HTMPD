window.templates.settings = Handlebars.compile(`

  <h2>Settings</h2>
  
  <h3 style="margin-top: 40px;">Audio Outputs</h3>
  
  <div id="outputs">
  {{#each outputs as |output|}}
    <div class="output">
      <button class="{{output.enabled_active}}" onclick="window.settings.output_set({{output.outputid}}, 1)">On</button>
      <button class="{{output.disabled_active}}" onclick="window.settings.output_set({{output.outputid}}, 0)">Off</button>
      <span style="margin-left: 10px">{{output.outputname}}</span>
    </div>
  {{else}}
    <p>No configured outputs.</p>
  {{/each}}
  </div>
  
  <h3 style="margin-top: 40px;">Crossfade</h3>
  <div style="display: flex;">
    <input id="crossfade" style="width:85px;" type="number" value="{{crossfade}}" min="0" max="300" onkeyup="window.settings.crossfade(event, this.value)" placeholder="seconds"/>
    <button style="margin-left:5px;" onclick="window.settings.crossfade(null, null)">Save</button>
  </div>
  
  <h3 style="margin-top: 40px;">Accent Color</h3>
  <div style="display:flex;">
    <input id="accent" type="color" oninput="window.settings.color_set(this.value)" value="{{color}}"/>
    <div style="display:flex;">
      <button style="margin-left:5px;" onclick="window.settings.color_set('#ff0066',true)">Reset</button> 
      <button onclick="window.settings.color_save()">Save</button>
    </div>
  </div>
  
  <h4>Saved colors</h4>
  {{#each colors as |color|}}
  <div>
    <button class="inline red" title="delete color" onclick="window.settings.color_delete('{{color}}')">-</button>
    <button style="color: {{color}}" onclick="window.settings.color_set('{{color}}',true)">{{color}}</button>
  </div>
  {{else}}
  <p>No saved colors.</p>
  {{/each}}
  
  <h3>Custom CSS</h3>
  <span>Enabled</span><input type="checkbox" id="custom-css-enabled" {{custom_css_enabled}}/>
  <textarea id="custom-css" placeholder="Write your custom CSS here">
    {{custom_css}}
  </textarea>
  <button onclick="window.settings.custom_css_save()">Save</button>

`.replace(/\n(\s*)/g, ""));