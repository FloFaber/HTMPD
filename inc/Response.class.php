<?php

class Response
{

  private array $data;
  private int $http_status_code;

  public function __construct(int $http_status_code = 200, string $error_code = "", string $error_message = "")
  {
    $this->data = [];
    $this->http_status_code = $http_status_code;

    switch($http_status_code){
      case 200:
        $this->data["error"] = "ERR_OK";
        $this->data["msg"] = null;
        break;
      case 400:
        $this->data["error"] = "ERR_BAD_REQUEST";
        $this->data["msg"] = "Bad Request";
        break;
    }

    if(!empty($error_code)){
      $this->data["error"] = $error_code;
    }
    if(!empty($error_message)){
      $this->data["msg"] = $error_message;
    }
  }

  public function __toString()
  {
    http_response_code($this->http_status_code);
    return json_encode($this->data);
  }

  public function add($key, $value){
    $this->data[$key] = $value;
    return $this;
  }

}
