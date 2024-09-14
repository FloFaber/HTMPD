<?php
/*
 * HTMPD
 * https://github.com/FloFaber/HTMPD
 *
 * Copyright (c) 2024 Florian Faber
 * https://www.flofaber.com
 */

if (!file_exists(__DIR__ . "/../config.php")) {
  echo "<b>ERROR!</b> config.php not found. Please move config.example.php to config.php and correctly configure it.<br>\n";
  die();
}

require_once __DIR__ . "/../config.php";