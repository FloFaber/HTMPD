<?php
require __DIR__ . "/../inc/config.loader.php";

$data = [
  "jss" => [ "js/playlist.js" ],
  "csss" => [ "css/playlist.css" ]
];

require __DIR__ . "/../themes/".(THEME ?? "default")."/templates/header.comp.php";
?>

  <h2>Playlists</h2>
  <h3 id="playlist-name"></h3>
  <div id="playlists"></div>
  <div id="playlist-items"></div>

<?php
require __DIR__ . "/../themes/".(THEME ?? "default")."/templates/footer.comp.php";
