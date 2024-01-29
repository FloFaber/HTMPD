// this template is fucked up
window.templates.search = Handlebars.compile(`
  <h2>Search</h2>
  <form id="search" onsubmit="{
      
    event.preventDefault();
    event.stopPropagation();
    
    let filters = [];
    for(let i = 0; i < $('div.search-item').length; i++){
      let si = $($('div.search-item')[i]);
      let tagtype = si.find('select.tagtype').val();
      let operator = si.find('select.operator').val();
      let value = si.find('input.value').val();
      filters.push({
        tag: tagtype,
        operator: operator,
        value: value
      });
    }
    
    $.get({
      url: window.WEBROOT + '/api/library.php',
      data: {
        action: 'tagsearch',
        filters: filters
      },
      success: (r) => {
        $('div#split-left').html(window.templates.search({
          tagtypes: window.tagtypes,
          filters: filters,
          results: r.files,
        }));
      }
    });
    return false;
  }">
  
    <div id="searches">
    
      {{#each filters as |filter|}}
      <div class="search-item">
        <select class="tagtype">
          <b>{{tagtypes}}</b>
          {{#each ../tagtypes as |tagtype|}}
          <option value="{{tagtype}}" {{#ifEquals tagtype filter.tag}}selected{{/ifEquals}}>{{tagtype}}</option>
          {{/each}}
        </select>
        <select class="operator">
          <option value="startswith" {{#ifEquals filter.operator "startswith"}}selected{{/ifEquals}}>starts with</option>
          <option value="endswith" {{#ifEquals filter.operator "endswith"}}selected{{/ifEquals}}>ends with</option>
          <option value="contains" {{#ifEquals filter.operator "contains"}}selected{{/ifEquals}}>contains</option>
        </select>
        <input class="value" type="text" placeholder="value" value="{{filter.value}}"/>
      </div>
      {{else}}
      <div class="search-item">
        <select class="tagtype">
          {{#each tagtypes as |tagtype|}}
          <option value="{{tagtype}}">{{tagtype}}</option>
          {{/each}}
        </select>
        <select class="operator">
          <option value="startswith">starts with</option>
          <option value="endswith">ends with</option>
          <option value="contains">contains</option>
        </select>
        <input class="value" type="text" placeholder="value"/>
      </div>
      {{/each}}
    </div>
  
  </form>
  <div>
    <button onclick="{
      $($('div.search-item')[0]).clone().appendTo('div#searches');
    }">add filter</button>
  </div>
  
  <div>
    <button type="submit">search</button>
  </div>
  
  <h2 style="margin-top: 20px;">Result</h2>
  <div>
    {{#each results as |result|}}
    <div>{{result.file}}</div>
    {{else}}
    <p>No results yet, go search something.</p>
    {{/each}}
  </div>
`);