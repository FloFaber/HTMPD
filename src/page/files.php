<?php
require __DIR__ . "/../inc/config.loader.php";

$data = [
  "jss" => [ "js/library.js" ],
  "csss" => [ "css/library.css" ]
];

require __DIR__ . "/../themes/".(THEME ?? "default")."/templates/header.comp.php";
?>

  <h2>Files</h2>

  <div id="action-buttons">
    <button id="db-update">Update DB</button>
  </div>

  <div id='library-path'><a href=''>C:</a>/</div>
  <div id='library'>Empty...</div>

<?php
require __DIR__ . "/../themes/".(THEME ?? "default")."/templates/footer.comp.php";
