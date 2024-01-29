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
    echo '{"version":"v0.0.1", "mpd":"'.$mphpd->get_version().'"}';
    return true;
  }elseif($action === "status"){

    if(($status = $mphpd->status()) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    if(($current_song = $mphpd->player()->current_song()) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    $current_song["haspicture"] = false;
    // dont request image from http(s) streams
    if(isset($current_song["file"]) && !str_starts_with($current_song["file"], "http://") && !str_starts_with($current_song["file"], "https://")){
      $picture = $mphpd->db()->get_picture($current_song["file"], false);
      if($picture !== false && $picture["size"] > 0){
        $current_song["haspicture"] = true;
      }
    }


    echo (new Response())->add("status", $status)->add("current_song", $current_song);
    return true;

  }elseif($action === "tagtypes"){
    if(($tagtypes = $mphpd->tagtypes()) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo (new Response())->add("tagtypes", $tagtypes);
    return true;
  }
}

echo new Response(400);
return false;

