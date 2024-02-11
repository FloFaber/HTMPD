class Events {

  constructor() {
    this.events = {}
  }

  on(name, cb){
    this.events["on" + capitalizeFirstLetter(name)].push(cb);
  }

  off(name){
    delete this.events["on" + capitalizeFirstLetter(name)];
  }

  execOns(name, data){
    for(let i = 0; i < this.events["on" + capitalizeFirstLetter(name)].length; i++){
      this.events["on" + capitalizeFirstLetter(name)][i](data);
    }
  }

}