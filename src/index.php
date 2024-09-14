<?php
/*
 * HTMPD
 * https://github.com/FloFaber/HTMPD
 *
 * Copyright (c) 2024 Florian Faber
 * https://www.flofaber.com
 */

require __DIR__ . "/inc/config.loader.php";

if(!empty($_COOKIE["theme"])){
  if(is_dir(__DIR__ . "/themes/" . $_COOKIE["theme"])){
    define("THEME", $_COOKIE["theme"]);
  }
}

if(!defined("THEME")){
  define("THEME", "default");
}

?>
<!--
Hi there :)
-->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>HTMPD - MPD WebUI</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
<?php
foreach(scandir(__DIR__ . "/themes/" . (THEME) . "/css/") as $css){
  if(!str_ends_with($css, ".css")){ continue; }
?>
  <link rel="stylesheet" href="<?= WEBROOT ?? "" ?>/themes/<?= THEME ?>/css/<?= $css ?? "" ?>"/>
<?php
}
?>
  <link rel="icon" href="<?= WEBROOT ?? "" ?>/favicon.png" type="image/png"/>

  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Events.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Popup.js"></script>

  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/ajax.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/utils.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/DB.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Playlist.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Queue.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Player.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Settings.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Navigation.js"></script>

  <script type="text/javascript">
    window.WEBROOT = "<?= WEBROOT ?? "" ?>";
    window.THEME = "<?= THEME ?>";
  </script>
<?php
foreach(scandir(__DIR__ . "/themes/" . THEME . "/js/") as $js){
  if(!str_ends_with($js, ".head.js")){ continue; }
?>
  <script type="text/javascript" src="<?= (WEBROOT ?? "")."/themes/".THEME."/js/$js" ?>"></script>
<?php
}
?>

</head>

<body>
<?php
include __DIR__ . "/themes/" . THEME . "/html/index.html";

foreach(scandir(__DIR__ . "/themes/" . THEME . "/js/") as $js){
  if(!str_ends_with($js, ".body.js")){ continue; }
?>
  <script type="text/javascript" src="<?= (WEBROOT ?? "")."/themes/".THEME."/js/$js" ?>"></script>
<?php
}
?>

</body>
</html>
