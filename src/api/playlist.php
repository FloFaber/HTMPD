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
    sort($playlists);
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

    if(($names = getrp("names", $method, null)) === null){
      echo new Response(400); return false;
    }

    foreach($names as $name){
      if(($playlist = $mphpd->playlist($name)) !== null){
        if($playlist->delete() === false){
          echo new Response(404); return false;
        }
      }
    }

    echo new Response();
    return true;

  }elseif($action === "create"){

    if(($name = getrp("name", $method, null)) === null){
      echo new Response(400); return false;
    }

    $clear = getrp("clear", $method, true);

    if(($playlist = $mphpd->playlist($name)) === null){
      echo new Response(400); return false;
    }

    if($playlist->save() === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    if($clear){
      $playlist->clear();
    }


    echo new Response();
    return true;

  }elseif($action === "save"){

    if(($name = getrp("name", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($playlist = $mphpd->playlist($name)) === null){
      echo new Response(400); return false;
    }

    // delete playlist if already existing
    $playlist->delete();

    if($playlist->save() === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo new Response();
    return true;

  }elseif($action === "add"){

    if(($name = getrp("playlist", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($uris = getrp("uris", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($playlist = $mphpd->playlist($name)) === null){
      echo new Response(404); return false;
    }

    foreach($uris as $uri){
      if(($result = $mphpd->playlist($name)->add($uri)) === false){
        echo new Response(404); return false;
      }
    }

    echo new Response(); return true;


  }elseif($action === "remove"){
    if(($name = getrp("playlist", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($poss = getrp("poss", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($playlist = $mphpd->playlist($name)) === null){
      echo new Response(404); return false;
    }

    // we need to start with the highest position first
    rsort($poss, SORT_NUMERIC);

    foreach($poss as $pos){
      if(($result = $mphpd->playlist($name)->remove_song($pos)) === false){
        echo new Response(404); return false;
      }
    }


    echo new Response(); return true;
  }elseif($action === "rename"){

    if(($name_old = getrp("name_old", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($name_new = getrp("name_new", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($playlist = $mphpd->playlist($name_old)) === null){
      echo new Response(404); return false;
    }

    if($playlist->rename($name_new) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo new Response();
    return true;

  }elseif($action === "move"){

    if(($name = getrp("name", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($from = getrp("from", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($to = getrp("to", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($playlist = $mphpd->playlist($name)) === null){
      echo new Response(404); return false;
    }

    if($playlist->move_song($from, $to) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo new Response();
    return true;

  }

}

echo new Response(400);
return false;
