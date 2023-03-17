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
    $path = urldecode(getrp("path", "get", null) ?? "");
    if(($library = $mphpd->db()->ls($path ?? "", true, false)) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }
    echo (new Response(200))->add("library", $library);
    return true;
  }

}

echo new Response(400);
return false;
