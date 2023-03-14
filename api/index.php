<?php

require_once __DIR__ . "/../inc/mphpd/mphpd.php";
require_once __DIR__ . "/../inc/config.php";
require_once __DIR__ . "/../inc/Response.class.php";
require_once __DIR__ . "/../inc/utils.php";

header("Content-type: application/json");

$mphpd = new FloFaber\MphpD(CONFIG);

try{
  $mphpd->connect();
}catch(FloFaber\MPDException $e){
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


    echo (new Response())->add("status", $status)->add("current_song", $current_song);
    return true;

  }
}

echo new Response(400);
return false;

