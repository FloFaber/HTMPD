class Template{

  constructor(id, data = {}){
    this.id = id;
    this.data = data;
  }

  setData(data){
    this.data = data;
  }

  getData(){
    return this.data;
  }

  render(){

    this.content = window.templates[this.id].replace(/\n(\s*)/g, "");

    if(!this.content){ console.log("EMPTY CONTENT for #"+this.id+"!"); return ""; }

    // for-loops
    let matches = [...this.content.matchAll(/\{\{for ([a-zA-Z_]*)->([a-zA-Z_]*)}}(.*?)\{\{endfor}}/g)];
    for(let i = 0; i < matches.length; i++){
      let m = matches[i];
      let match_full = m[0]; // Full Match
      let match_object = m[1]; // name of the object-item in this.data
      let match_item = m[2];
      let match_content = m[3];

      if(!this.data[match_object] && this.data[match_object] !== []){
        console.log("data["+match_object+"] is empty")
        continue;
      }

      let s = "";
      for(let j = 0; j < this.data[match_object].length; j++){
        let item = this.data[match_object][j];
        let s_tmp = match_content;

        let matches;

        // object->item
        matches = [...this.content.matchAll(/\{\{([a-zA-Z_]*)\.([a-zA-Z_]*)}}/g)];
        for(let k = 0; k < matches.length; k++){
          let match = matches[k];
          s_tmp = s_tmp.replaceAll("{{"+match[1]+"."+match[2]+"}}", this.data[match_object][j][match[2]] || "");
        }

        // array
        matches = [...this.content.matchAll(/\{\{([a-zA-Z_]*)}}/g)];
        for(let k = 0; k < matches.length; k++){
          let match = matches[k];
          s_tmp = s_tmp.replaceAll("{{"+match[1]+"}}", this.data[match_object][j] || "");
        }



        s += s_tmp;
      }

      this.content = this.content.replace(match_full, s);

    }

    // this needs recursion
    Object.keys(this.data).forEach(key => {
      if(typeof this.data[key] === "object"){
        Object.keys(this.data[key]).forEach(key2 => {

          if(typeof this.data[key2] === "object"){
            Object.keys(this.data[key2]).forEach(key3 => {
              this.content = this.content.replaceAll("{{"+key+"."+key2+"."+key3+"}}", this.data[key][key2][key3]);
            });
          }else{
            this.content = this.content.replaceAll("{{"+key+"."+key2+"}}", this.data[key][key2]);
          }
        });
      }else{
        this.content = this.content.replaceAll("{{"+key+"}}", this.data[key]);
      }
    });

    return this.content;
  }

}