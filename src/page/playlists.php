<?php
require __DIR__ . "/../inc/config.loader.php";

$data = [
  "jss" => "js/playlist.js"
];

require __DIR__ . "/../themes/".(THEME ?? "default")."/templates/header.comp.php";
?>

  <h2>Playlists</h2>
  <p style="color:grey;">This page is as empty as your life.</p>

<?php
require __DIR__ . "/../themes/".(THEME ?? "default")."/templates/footer.comp.php";
