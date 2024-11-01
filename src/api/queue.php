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

    if(($queue = $mphpd->queue()->get()) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    //$r = new Response();
    //$r->add("queue", $queue);
    echo (new Response)->add("queue", $queue);
    return true;

  }

}elseif($method === "post"){

  if($action === "add" || $action === "replace"){

    if(($uri = getrp("uri", "post", null)) === null){
      echo new Response(400); return false;
    }

    if($action === "replace"){
      $mphpd->queue()->clear();
    }

    if($mphpd->queue()->add($uri) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]); return false;
    }

    echo new Response(); return true;

  }elseif($action === "add_id") {
    if(($uri = getrp("uri", "post", null)) === null){
      echo new Response(400); return false;
    }

    $play = boolval(getrp("play", "post", false));

    if(($id = $mphpd->queue()->add_id($uri)) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]); return false;
    }

    if($mphpd->player()->play_id($id) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]); return false;
    }

    echo new Response(200, "ERR_OK", "", [ "id" => $id ]); return true;

  }elseif($action === "search_add"){

    $replace = getrp("replace", "post", false) === "true";
    $filters = getrp("filters", "post", []);

    if($replace === true){
      $mphpd->queue()->clear();
    }

    $filter = null;
    foreach($filters as $f){
      if($filter === null){
        $filter = new \FloFaber\MphpD\Filter($f["tag"], $f["operator"], $f["value"]);
      }else{
        $filter = $filter->and($f["tag"], $f["operator"], $f["value"]);
      }
    }

    if($mphpd->queue()->add_search($filter) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]);
      return false;
    }

    echo (new Response(200))->add("asdf", $replace);
    return true;

  }elseif($action === "clear"){
    if($mphpd->queue()->clear() === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]); return false;
    }

    echo new Response(); return true;

  }elseif($action === "shuffle"){
    if($mphpd->queue()->shuffle() === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]); return false;
    }

    echo new Response(); return true;

  }elseif($action === "delete_id"){

    if(($id = getrp("id", "post", null)) === null){
      echo new Response(400); return false;
    }

    if($mphpd->queue()->delete_id($id) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]); return false;
    }

    echo new Response(); return true;

  }elseif($action === "move"){

    if(($from = getrp("from", "post", null)) === null){
      echo new Response(400); return false;
    }
    if(($to = getrp("to", "post", null)) === null){
      echo new Response(400); return false;
    }

    if($mphpd->queue()->move($from, $to) === false){
      echo new Response(500, "ERR_MPD", $mphpd->get_last_error()["message"]); return false;
    }

    echo new Response(); return true;

  }

}


// bad request
echo new Response(400);
