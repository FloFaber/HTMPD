/*
 * HTMPD
 * https://github.com/FloFaber/HTMPD
 *
 * Copyright (c) 2024 Florian Faber
 * https://www.flofaber.com
 */

class Table {

  /*
    params = {
      id: asdf,
      parent: selector,
      heads: [{
        title: "Name",
        attr: "display_name"
      },{
        title: "Album",
        attr: "album"
      }],
      topActions: [
        {
          title: "clear queue",
          text: "clear",
          onclick: function(item)
        }
      ],
      itemActions: [
        {
          title: "remove from queue",
          text: "-",
          onclick: function(item)
        }
      ],
      onItemClick: function,
    }
   */
  constructor(params, items) {
    this.params = params;
    this.items = items;
    this.last_selected = null;
    this.render.bind(this);
  }

  render(){

    let str = "";

    if(this.params.topActions && this.params.topActions.length){

      str += "<div id='table-actions'>";
      for(let i = 0; i < this.params.topActions.length; i++){
        let topAction = this.params.topActions[i];
        str += `<button id="topaction-${this.params.id}-${i}" title="${topAction.title}">${topAction.text}</button>`;
      }
      str += "</div>";

    }

    str += `<table id="${this.params.id}"><tr>`;

    if(this.params.itemActions.length || this.params.topActions.length){
      str += "<th></th>";
    }

    for(let i = 0; i < this.params.heads.length; i++){
      str += "<th>" + this.params.heads[i].title + "</th>";
    }

    str += "</tr>";

    for(let i = 0; i < this.items.length; i++){
      let item = this.items[i];
      str += `<tr id="${this.params.id}-${i}" class="item "`;

      Object.keys(item).forEach(key => {
        str += "data-"+key + "='" + item[key] + "'";
      });

      str += ">";

      // add action buttons
      if(this.params.itemActions.length || this.params.topActions.length){

        str += "<td>";
        if(this.params.topActions && this.params.topActions.length){
          str += `<button class='inline' id="select-${this.params.id}-${i}" title="select"> </button>`;
        }

        for(let j = 0; j < this.params.itemActions.length; j++){
          let action = this.params.itemActions[j];
          str += `<button class="inline" id="${this.params.id}-${i}-${j}" title="${action.title || ''}">${action.text || ''}</button>`;
        }
        str += "</td>";
      }

      // add item->value
      for(let j = 0; j < this.params.heads.length; j++){
        str += `<td class="val">${this.items[i][this.params.heads[j].attr] || this.items[i][this.params.heads[j].attr_fb] || ''}</td>`;
      }
      str += `</tr>`;
    }

    str += `</table>`;

    // render
    this.params.parent.html(str);

    // bind topAction-events
    if(this.params.topActions && this.params.topActions.length){
      for(let i = 0; i < this.params.topActions.length; i++){
        let topAction = this.params.topActions[i];
        $("button#topaction-"+this.params.id+"-"+i).on("click", (e) => {

          let selected = [];
          $(`button[id^=select-${this.params.id}-][data-selected='1']`).each((i, item) => {
            let id = $(item).attr("id").split("-").pop();
            selected.push(this.items[id]);
          });

          topAction.onclick(selected);
        });
      }
    }

    // bind item-events
    for(let i = 0; i < this.items.length; i++){
      $(`tr#${this.params.id}-${i}`).on("click", (e) => {
        this.params.onItemClick(this.items[i]);
      });

      $(`button#select-${this.params.id}-${i}`).on("click",(e) => {

        console.log(this.last_selected)

        let item = $(`button#select-${this.params.id}-${i}`);
        e.stopPropagation();

        let selected = !!$(item).attr("data-selected");
        if(selected){
          $(item).attr("data-selected", "0").html('&nbsp;');
        }else{

          if(this.last_selected !== null && e.shiftKey){
            let start, end;
            if(this.last_selected > i){
              start = i; end = this.last_selected;
            }else{
              start = this.last_selected; end = i;
            }

            for(let j = start; j <= end; j++){
              $(`button#select-${this.params.id}-${j}`).attr("data-selected","1").text("x");
            }
          }else{
            $(item).attr("data-selected", "1").text("x");
            this.last_selected = i;
          }

        }
      });

      for(let j = 0; j < this.params.itemActions.length; j++){
        let action = this.params.itemActions[j];
        $(`button#${this.params.id}-${i}-${j}`).on("click", (e) => {
          e.stopPropagation();
          action.onclick(this.items[i]);
        });
      }
    }



  }



}