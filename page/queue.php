<?php

if(!file_exists(__DIR__ . "/../config.php")){
  echo "ERROR: config.php not found. Please move config.example.php to config.php and configure correctly.<br>\n";
  die();
}
require_once __DIR__ . "/../config.php";
require_once __DIR__ . "/../inc/twig.loader.php";

echo $twig->render("main.html", [
  "title" => "Queue",
  "jss" => [ "js/queue.js" ],
  "actions" => [
    [ "id" => "queue-clear", "text" => "clear" ],
    [ "id" => "queue-shuffle", "text" => "shuffle" ],
    [ "id" => "queue-save", "text" => "save..." ],
    [ "id" => "queue-add", "text" => "add..." ],
  ],
  "body" => [
    "id" => "queue",
    "content" => "<p style='color: grey;'>The Queue is empty. You can load <a href=\"{{ constant('WEBROOT') }}/page/playlists.php\">Playlists</a> or songs from the <a href=\"{{ constant('WEBROOT') }}/page/library.php\">Library</a>."
  ]
]);
