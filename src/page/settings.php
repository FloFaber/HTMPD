<?php
require __DIR__ . "/../inc/config.loader.php";

$data = [
  "jss" => [ "js/settings.js" ]
];

require __DIR__ . "/../themes/".(THEME ?? "default")."/templates/header.comp.php";
?>

  <h2>Settings</h2>

  <h3>Audio Outputs</h3>
  <div id="outputs"></div>

<?php
require __DIR__ . "/../themes/".(THEME ?? "default")."/templates/footer.comp.php";
