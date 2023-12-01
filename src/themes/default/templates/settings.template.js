window.templates.settings = `

  <h2>Settings</h2>
  
  <h3>Audio Outputs</h3>
  
  <div id="outputs">
  {{for outputs->output}}
    <div class="output">
      <button class="{{output.enabled_active}}" onclick="window.settings.output_set({{output.outputid}}, 1)">On</button>
      <button class="{{output.disabled_active}}" onclick="window.settings.output_set({{output.outputid}}, 0)">Off</button>
      <span style="margin-left: 10px">{{output.outputname}}</span>
    </div>
  {{endfor}}
  </div>
  
  <h3>Accent Color</h3>
  <div style="display:flex;">
    <input id="accent" type="color" oninput="window.settings.color_set(this.value)" value="{{color}}"/>
    <div style="display:flex;">
      <button onclick="window.settings.color_set('#ff0066',true)">Reset</button> 
      <button onclick="window.settings.color_save()">Save</button>
    </div>
  </div>
  
  <h4>Saved colors</h4>
  {{for colors->color}}
  <div>
    <button class="inline red" title="delete color" onclick="window.settings.color_delete('{{color}}')">-</button>
    <button style="color: {{color}}" onclick="window.settings.color_set('{{color}}',true)">{{color}}</button>
  </div>
  {{endfor}}

`