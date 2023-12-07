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
    if(($playlists = $mphpd->playlists()) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }
    echo (new Response(200))->add("playlists", $playlists);
    return true;
  }elseif($action === "show"){

    if(($name = getrp("name", $method, null)) === null || empty($name)){
      echo new Response(400); return false;
    }

    if(($songs = $mphpd->playlist($name)->get_songs(true)) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo (new Response())->add("songs", $songs);
    return true;

  }

}elseif($method === "post"){

  if($action === "load" || $action === "replace"){

    if(($name = getrp("name", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($playlist = $mphpd->playlist($name)) === null){
      echo new Response(400); return false;
    }

    if($action === "replace"){
      $mphpd->queue()->clear();
    }

    if($playlist->load() === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo new Response();
    return true;

  }elseif($action === "delete"){

    if(($name = getrp("name", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($playlist = $mphpd->playlist($name)) === null){
      echo new Response(400); return false;
    }

    if($playlist->delete() === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo new Response();
    return true;

  }elseif($action === "create"){

    if(($name = getrp("name", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($playlist = $mphpd->playlist($name)) === null){
      echo new Response(400); return false;
    }

    if($playlist->save() === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo new Response();
    return true;

  }

}

echo new Response(400);
return false;
