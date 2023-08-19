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

    if(($outputs = $mphpd->outputs()) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo (new Response())->add("outputs", $outputs);
    return true;

  }
}elseif($method === "post"){
  if($action === "state"){

    if(($id = getrp("id", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($enable = getrp("enable", $method, null)) === null){
      echo new Response(400); return false;
    }

    if(($enable ? $mphpd->output($id)->enable() : $mphpd->output($id)->disable()) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo new Response(); return true;

  }
}



// bad request
echo new Response(400);
return false;