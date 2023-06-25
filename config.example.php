<?php


/*
 * Config parameters passed to MphpD.
 * See https://mphpd.org/doc/latest/guides/configuration for more information.
 */
const CONFIG = [
  "host" => "127.0.0.1",
  "port" => 6600,
  "timeout" => 10
];


/*
 * If MphpD-WebUI should run in a subfolder eg "http://example.com/mpd" set the path after the domain as WEBROOT eg "/mpd".
 * If it should run inside the root folder, leave it empty.
 */
const WEBROOT = "/mphpd";
// const WEBROOT = "";
