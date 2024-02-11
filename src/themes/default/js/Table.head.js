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
  }

  render(){

    let str = `<table id="${this.params.id}"><tr>`;

    if(this.params.itemActions.length){
      str += "<th></th>";
    }

    for(let i = 0; i < this.params.heads.length; i++){
      str += "<th>" + this.params.heads[i].title + "</th>";
    }

    str += "</tr>";

    for(let i = 0; i < this.items.length; i++){
      let item = this.items[i];
      str += `<tr id="${this.params.id}-${i}" class="item">`;

      if(this.params.itemActions.length){
        str += "<td>";
        for(let j = 0; j < this.params.itemActions.length; j++){
          let action = this.params.itemActions[j];
          str += `<button class="inline" id="${this.params.id}-${i}-${j}" title="${action.title}">${action.text}</button>`;
        }
        str += "</td>";
      }


      for(let j = 0; j < this.params.heads.length; j++){

        str += `<td class="val">${this.items[i][this.params.heads[j].attr]}</td>`;

      }
      str += `</tr>`;
    }

    str += `</table>`;

    this.params.parent.append(str);

    for(let i = 0; i < this.items.length; i++){
      $(`tr#${this.params.id}-${i}`).on("click", (e) => {
        this.params.onItemClick(this.items[i]);
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