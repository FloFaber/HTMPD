class Template{

  constructor(id, data = {}){
    this.id = id;
    this.data = data;

    this.content = window.templates[this.id].replace(/\n(\s*)/g, "");
  }

  setData(data){
    this.data = data;
  }

  render(){

    if(!this.content){ console.log("EMPTY CONTENT for #"+this.id+"!"); return ""; }

    Object.keys(this.data).forEach(key => {
      if(typeof this.data[key] === "object" && Array.isArray(this.data[key])){

        let re = new RegExp("{{"+key+"@.*}}", "g");
        let matches = this.content.match(re);

        if(matches){
          for(let i = 0; i < matches.length; i++){
            let match = matches[i];
            let match_sliced = match.slice(2).slice(0,-2);
            let f = match_sliced.split("@");
            if(f.length !== 2){ continue; }

            let s = "";
            for(let j = 0; j < this.data[key].length; j++){
              s += (new Template(f[1], this.data[key][j])).render();
            }
            this.content = this.content.replace(match, s);

          }
        }
      }else{
        this.content = this.content.replaceAll("{{"+key+"}}", this.data[key]);
      }
    });

    return this.content;
  }

}