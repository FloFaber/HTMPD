// we dont need jquery for this
window.ajax = (params) => {
  fetch(params.url || "/", {
    method: params.method || "GET",
    /*mode: 'cors',*/
    redirect: 'follow',
    body: params.data ? JSON.stringify(params.data) : null,
    /*headers: new Headers({ 'Content-Type': 'application/json' })*/
  }).then(params.success);
}

window.get = (params) => {
  params.method = "GET";
  window.ajax(params);
}

window.post = (params) => {
  params.method = "POST",
  window.ajax(params);
}
