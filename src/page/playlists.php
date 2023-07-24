<?php

if (!file_exists(__DIR__ . "/../config.php")) {
  echo "ERROR: config.php not found. Please move config.example.php to config.php and configure correctly.<br>\n";
  die();
}
require_once __DIR__ . "/../config.php";
require_once __DIR__ . "/../inc/twig.loader.php";

echo $twig->render("main.html", [
  "title" => "Playlists",
  "jss" => [ "js/playlist.js" ],
]);
