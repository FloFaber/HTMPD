class Template{

  constructor(id, data = {}){
    this.id = id;
    this.data = data;
  }

  setData(data){
    this.data = data;
    console.log(data);
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

      if(!this.data[match_object]){
        console.log("data["+match_object+"] is empty")
        continue;
      }

      let s = "";
      for(let j = 0; j < this.data[match_object].length; j++){
        let item = this.data[match_object][j];
        let s_tmp = match_content;

        let matches = [...this.content.matchAll(/\{\{([a-zA-Z_]*)\.([a-zA-Z_]*)}}/g)];
        for(let k = 0; k < matches.length; k++){
          let match = matches[k];
          s_tmp = s_tmp.replaceAll("{{"+match[1]+"."+match[2]+"}}", this.data[match_object][j][match[2]] || "");
        }


        s += s_tmp;
      }

      this.content = this.content.replace(match_full, s);

    }


    Object.keys(this.data).forEach(key => {
      this.content = this.content.replaceAll("{{"+key+"}}", this.data[key]);
    });

    return this.content;
  }

}