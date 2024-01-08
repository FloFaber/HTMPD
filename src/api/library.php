<?php

require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/../config.php";
require_once __DIR__ . "/../inc/Response.class.php";
require_once __DIR__ . "/../inc/utils.php";

use FloFaber\MphpD\MphpD;
use FloFaber\MphpD\MPDException;

header("Content-type: application/json");

$mphpd = new MphpD(CONFIG);

try{
  $mphpd->connect();
}catch(MPDException $e){
  echo new Response(500, "ERR_CONNECTION", $e->getMessage());
  return false;
}

$method = strtolower($_SERVER["REQUEST_METHOD"]);
$action = getrp("action", $method, null);

if($method === "get"){

  if($action === null){
    $path = urldecode(getrp("path", "get", null) ?? "");
    if(($library = $mphpd->db()->ls($path, true, false)) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }
    echo (new Response(200))->add("library", $library);
    return true;

  }elseif($action === "artist"){

    $artist = getrp("artist", "get", null);

    if(!$artist){
      if(($artists = $mphpd->db()->list("artist")) === false){
        echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
        return false;
      }
      usort($artists, "strnatcasecmp");
      echo (new Response(200))->add("artists", $artists);
      return true;
    }

    $f = new \FloFaber\MphpD\Filter("artist", "==", $artist);
    if(($albums = $mphpd->db()->list("album", $f)) === false){
      echo (new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]))->add("filter", (string)$f);
      return false;
    }

    $filter = (new \FloFaber\MphpD\Filter("artist", "==", $artist))->and("album", "==", "");

    if(($songs = $mphpd->db()->search(
        (new \FloFaber\MphpD\Filter("artist", "==", $artist))
          ->and("album", "==", "")
      )) === false){
      echo (new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]))->add("filter", (string)$filter);
      return false;
    }



    echo (new Response(200))->add("albums", $albums)->add("songs", $songs)->add("filter", (string)$filter);
    return true;

  }elseif($action === "album"){

    $artist = getrp("artist", "get", null);
    $album = getrp("album", "get", null);

    if($album){

      $filter = new \FloFaber\MphpD\Filter("album", "==", $album);
      if($artist){
        $filter = $filter->and("artist", "==", $artist);
      }

      if(($songs = $mphpd->db()->search($filter)) === false){
        echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
        return false;
      }

      echo (new Response(200))->add("songs", $songs);
      return true;
    }


    if(($albums = $mphpd->db()->list("album", null, "AlbumArtist")) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }
    echo (new Response(200))->add("artists", $albums);
    return true;

  }elseif($action === "search") {

    $path = urldecode(getrp("path", "get", null) ?? "");
    $keyword = urldecode(getrp("keyword", "get", null) ?? "");

    $filter = new \FloFaber\MphpD\Filter("file", "contains", $keyword);

    if($path){
      $filter = $filter->and("file", "=~", "^$path");
    }


    if(($files = $mphpd->db()->search($filter)) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"] . " / " . (string)$filter);
      return false;
    }

    echo (new Response(200))->add("files", $files);
    return true;

  }elseif($action === "thumbnail"){

    if(($file = getrp("file", "get", null)) === null){
      echo new Response(400);
      return false;
    }

    $check_only = getrp("check_only", "get", false);

    if(($thumbnail = $mphpd->db()->read_picture($file)) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"] ?? "Failed to load picture");
      return false;
    }

    if(!$thumbnail){
      $thumbnail = file_get_contents(__DIR__ . "/../broken.gif");
    }

    if($check_only){
      echo new Response(200, "ERR_OK"); return true;
    }


    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->buffer($thumbnail);
    header("Content-type: $mimeType");
    header("Cache-Control: public, max-age=604800");

    echo $thumbnail;

  }

}elseif($method === "post"){

  if($action === "update"){
    if(($update = $mphpd->db()->update()) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo (new Response(200))->add("job", $update);
    return true;
  }

}

echo new Response(400);
return false;
