<?php
/*
 * HTMPD
 * https://github.com/FloFaber/HTMPD
 *
 * Copyright (c) 2024 Florian Faber
 * https://www.flofaber.com
 */

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

  }elseif($action === "bytagtype"){

    $tagtype = getrp("tagtype", "get", null);
    $value = getrp("value", "get", null);
    $group = getrp("group", "get", null);

    $filter = null;
    if(!$value){
      if(($result = $mphpd->db()->list($tagtype, $filter)) === false){
        echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
        return false;
      }
      usort($result, "strnatcasecmp");
    }else{
      $filter = new \FloFaber\MphpD\Filter($tagtype, "==", $value);
      if(($result = $mphpd->db()->search($filter)) === false){
        echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
        return false;
      }
    }



    echo (new Response(200))->add(strtolower($tagtype)."s", $result);
    return true;

  }elseif($action === "ls"){

    $uri = getrp("uri", "get", "");
    $metadata = boolval(getrp("metadata", "get", false));
    $recursive = boolval(getrp("recursive", "get", false));


    if(($result = $mphpd->db()->ls($uri, $metadata, $recursive)) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo (new Response(200))
      ->add("files", $result["files"] ?? [])
      ->add("directories", $result["directories"] ?? [])
      ->add("playlists", $result["playlists"] ?? []);
    return true;

  }elseif($action === "artist"){

    $artist = getrp("artist", "get", null);

    if(!$artist){
      if(($artists = $mphpd->db()->list("AlbumArtist")) === false){
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

    $filter = new \FloFaber\MphpD\Filter();
    $filters = getrp("filters", "get", null);
    foreach($filters as $f){
      if(is_numeric($f["value"])){ $f["value"] = (int)$f["value"]; }
      $filter->and($f["tag"], $f["operator"], $f["value"]);
    }

    if($path){
      $filter = $filter->and("file", "=~", "^$path");
    }


    if(($files = $mphpd->db()->search($filter)) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"] . " / " . (string)$filter);
      return false;
    }

    echo (new Response(200))->add("files", $files);
    return true;

  }elseif($action === "tagsearch"){

    $filters = getrp("filters", "get", null);
    if($filters === null || gettype($filters) !== "array"){
      echo (new Response(401))->add("type", gettype($filters));
      return false;
    }

    for($i = 0; $i < count($filters); $i++){
      $f = $filters[$i];

      if($f["operator"] === "startswith"){
        $f["operator"] = "=~";
        $f["value"] = "^".$f["value"];
      }elseif($f["operator"] === "endswith"){
        $f["operator"] = "=~";
        $f["value"] = $f["value"]."\$";
      }elseif($f["operator"] === "contains"){
        $f["operator"] = "=~";
      }elseif($f["operator"] === "equals"){
        $f["operator"] = "==";
      }elseif($f["operator"] === "notequals"){
        $f["operator"] = "!=";
      }else{
        continue; // skip invalid
      }

      if($i === 0){
        $filter = new \FloFaber\MphpD\Filter($f["tag"], $f["operator"], $f["value"]);
      }else{
        $filter->and($f["tag"], $f["operator"], $f["value"]);
      }
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

    // hack
    $thumbnail = $mphpd->db()->read_picture($file);
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
    return true;

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
