<?php

require_once __DIR__ . "/../inc/MphpD/MphpD.php";
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
    echo json_encode([ "version" => "v0.0.1" ]);
    return true;
  }elseif($action === "info"){

    if(($currentsong = $mphpd->player()->current_song()) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo json_encode($currentsong);
    return true;

  }

}elseif($method === "post"){

  if($action === "pause"){

    $s = null;
    $state = getrp("state", "post");
    if($state === "0"){ $s = MPD_STATE_OFF; }
    elseif($state === "1"){ $s = MPD_STATE_ON; }

    if($mphpd->player()->pause($s) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }
    echo new Response();
    return true;

  }elseif($action === "play"){

    if(($pos = getrp("pos", "post")) === null){
      echo new Response(400); return false;
    }

    if($mphpd->player()->play($pos) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo new Response();
    return true;

  }elseif($action === "playid"){

    if(($id = getrp("id", "post")) === null){
      echo new Response(400); return false;
    }

    if($mphpd->player()->play_id($id) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo new Response();
    return true;

  }elseif($action === "volume"){
    if(($vol = getrp("volume", "post")) === null){
      echo new Response(400); return false;
    }

    if($mphpd->player()->volume($vol) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo new Response();
    return true;

  }elseif($action === "previous"){
    if($mphpd->player()->previous() === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }
    echo new Response();
    return true;
  }elseif($action === "next"){
    if($mphpd->player()->next() === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }
    echo new Response();
    return true;

  }elseif(in_array($action, [ "consume", "repeat", "single", "random" ])){

    if(($state = getrp("state", "post", null)) === null){
      echo new Response(400);
      return false;
    }

    $state = intval(boolval($state));
    if($mphpd->player()->$action($state) === false){ // oh shit
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }
    echo new Response();
    return true;

  }elseif($action === "seek_cur"){

    if(($time = getrp("time", "post", null)) === null){
      echo new Response(400);
      return false;
    }

    if($mphpd->player()->seek_cur($time) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }
    echo new Response();
    return true;


  }

}

// bad request
echo new Response(400);
