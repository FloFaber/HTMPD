<?php

if (!file_exists(__DIR__ . "/../config.php")) {
  echo "ERROR: config.php not found. Please move config.example.php to config.php and configure correctly.<br>\n";
  die();
}
require_once __DIR__ . "/../config.php";
require_once __DIR__ . "/../inc/twig.loader.php";

echo $twig->render("main.html", [
  "title" => "Keyboard Shortcuts",
  "body" => [
    "id" => "shortcuts",
    "content" => "<table id='shortcuts'>
  <tr>
    <th>Shortcut</th>
    <th>Action</th>
  </tr><tr>
    <td>SPACE</td>
    <td>play / pause</td>
  </tr><tr>
    <td>A / D</td>
    <td>previous / next song</td>
  </tr><tr>
    <td>Q / E</td>
    <td>seek back / forward 10 seconds</td>
  </tr><tr>
    <td>+ / -</td>
    <td>increase / decrease volume</td>
  </tr>
</table>"
  ]
]);
