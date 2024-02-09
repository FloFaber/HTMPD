// we don't need jquery for this
window.ajax = (params) => {

  let form = null;
  if(params.data){
    form = Object.keys(params.data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(
      typeof params.data[key] === "boolean" ? (params.data[key] ? 1 : 0) : params.data[key]
    )).join('&');
  }

  let init = {
    method: params.method || "GET",
    redirect: 'follow',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  }

  if(init.method === "GET" || init.method === "HEAD"){
    params.url = params.url + "?" + form;
  }else{
    init.body = form || null;
  }

  fetch(params.url || "/", init).then(data => data.json())
    .then(data => {
      if(typeof params.success === "function"){ params.success(data); }
      if(typeof params.complete === "function"){ params.complete(data); }
    })
    .catch(error => {
      console.error(error);
      if(typeof params.error === "function"){ params.error(error); }
      if(typeof params.complete === "function"){ params.complete(error); }
    });
}

window.get = (params) => {
  params.method = "GET";
  window.ajax(params);
}

window.post = (params) => {
  params.method = "POST";
  window.ajax(params);
}
