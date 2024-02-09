class DB {

  byTagType(tagtype, value = null, group = false, cb = null){

    $.get({
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


  search(filters = [], cb = null){
    $.get({
      url: window.WEBROOT + "/api/library.php",
      data: {
        action: "search",
        filters: filters
      },
      success: (r) => {
        if(typeof cb === "function"){ cb(r); }
      }
    });
  }

  ls(uri = "", recursive = false, metadata = false, cb = null){
    $.get({
      url: window.WEBROOT + "/api/library.php",
      data: {
        action: "ls",
        uri: uri,
        recursive: recursive,
        metadata: metadata
      },
      success: (r) => {
        if(typeof cb === "function"){ cb(r); }
      }
    });
  }


}
