window.templates.settings = `

  <h2>Settings</h2>
  
  <h3>Audio Outputs</h3>
  
  <div id="outputs">
  {{for outputs->output}}
    <div class="output">
      <button class="{{output.enabled_active}}" onclick="output_set({{output.outputid}}, 1)">On</button>
      <button class="{{output.disabled_active}}" onclick="output_set({{output.outputid}}, 0)">Off</button>
      <span style="margin-left: 10px">{{output.outputname}}</span>
    </div>
  {{endfor}}
  </div>
  
  <h3>Accent Color</h3>
  <div style="display:flex;">
    <input id="accent" type="color" oninput="color_set(this)" value="{{color}}"/>
    <button onclick="color_set('#ff0066')">Reset</button>
  </div>

`