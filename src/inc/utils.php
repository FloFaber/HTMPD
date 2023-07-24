<?php

// getRequestParam
function getrp(string $key, string $method = "get", $default = null)
{
  if($method === "get"){
    if(!isset($_GET[$key])){
      return $default;
    }
    return $_GET[$key];
  }elseif($method === "post"){
    if(!isset($_POST[$key])){
      return $default;
    }
    return $_POST[$key];
  }
}
