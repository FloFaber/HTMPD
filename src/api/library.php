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
