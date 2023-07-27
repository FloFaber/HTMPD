<?php
require __DIR__ . "/../inc/config.loader.php";

$data = [
  "jss" => [ "js/queue.js" ]
];

require __DIR__ . "/../themes/".(THEME ?? "default")."/templates/header.comp.php";
?>

  <h2>Queue</h2>

  <div id="action-buttons">
    <button id="queue-clear">clear</button>
    <button id="queue-shuffle">shuffle</button>
    <button id="queue-save">save...</button>
    <button id="queue-add">add...</button>
  </div>

  <div id="queue">
    <p style='color: grey;'>
      The Queue is empty. You can load <a href="<?= WEBROOT ?? "" ?>/page/playlists.php">Playlists</a>
      or songs from <a href="<?= WEBROOT ?? "" ?>/page/files.php">Files</a>, <a href="<?= WEBROOT ?? "" ?>/page/artists.php">Artists</a> or <a href="<?= WEBROOT ?? "" ?>/page/albums.php">Albums</a>.
  </div>

<?php
require __DIR__ . "/../themes/".(THEME ?? "default")."/templates/footer.comp.php";

