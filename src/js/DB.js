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

}