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

    if(($queue = $mphpd->queue()->get()) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    //$r = new Response();
    //$r->add("queue", $queue);
    echo (new Response)->add("queue", $queue);
    return true;

  }

}

// bad request
echo new Response(400);
