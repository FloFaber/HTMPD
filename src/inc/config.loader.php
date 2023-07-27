<?php
if (!file_exists(__DIR__ . "/../config.php")) {
  echo "<b>ERROR!</b> config.php not found. Please move config.example.php to config.php and correctly configure it.<br>\n";
  die();
}

require_once __DIR__ . "/../config.php";