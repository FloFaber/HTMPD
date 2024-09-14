/*
 * HTMPD
 * https://github.com/FloFaber/HTMPD
 *
 * Copyright (c) 2024 Florian Faber
 * https://www.flofaber.com
 */

class DB {

  byTagType(tagtype, value = null, group = false, cb = null){

    window.get({
      url: window.WEBROOT + "/api/library.php",
      data: {
        action: "bytagtype",
        tagtype: tagtype,
        value: value ? decodeURIComponent(value) : ""
      },
      success: (r) => {
        if(typeof cb === "function"){
          cb(r);
        }
      }
    });

  }


  search(params){
    window.get({
      url: window.WEBROOT + "/api/library.php",
      data: {
        action: "search",
        path: params.path || "",
        filters: params.filters || []
      },
      success: (r) => {
        if(typeof params.success === "function"){ params.success(r); }
      }
    });
  }


  ls(params = {}){
    window.get({
      url: window.WEBROOT + "/api/library.php",
      data: {
        action: "ls",
        uri: params.path || "",
        recursive: (params.recursive ? 1 : 0),
        metadata: (params.metadata ? 1 : 0 )
      },
      success: (r) => {
        if(typeof params.success === "function"){ params.success(r); }
      }
    });
  }

  update(params = {}){
    window.post({
      url: window.WEBROOT + "/api/library.php",
      data: {
        action: "update",
      },
      success: (r) => {
        if(typeof params.success === "function"){ params.success(r); }
      }
    })
  }


}
