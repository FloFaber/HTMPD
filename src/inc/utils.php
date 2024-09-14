<?php
/*
 * HTMPD
 * https://github.com/FloFaber/HTMPD
 *
 * Copyright (c) 2024 Florian Faber
 * https://www.flofaber.com
 */

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
