<?php
require_once __DIR__ . "/../config.php";
function is_active($page): bool
{
  $uri = $_SERVER['REQUEST_URI'];
  return $uri === WEBROOT."/page/".$page || ($page === "" && $uri === WEBROOT."/");
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>MPD WebUI</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="stylesheet" href="<?= WEBROOT ?>/css/main.css"/>
    <link rel="stylesheet" href="<?= WEBROOT ?>/css/player.css"/>
<?php
if(isset($csss)){
  foreach($csss as $css){
?>
    <link rel="stylesheet" href="<?= WEBROOT ?>/<?= $css ?>"/>
<?php
  }
}
?>
    <script type="text/javascript">window.WEBROOT = "<?= WEBROOT ?>";</script>
    <script type="text/javascript" src="<?= WEBROOT ?>/js/jquery-3.6.4.min.js"></script>
    <script type="text/javascript" src="<?= WEBROOT ?>/js/utils.js"></script>
  </head>
  <body>
    <div id="notifications"></div>
    <div id="sidebar">
      <h1 id="title">MPD WebUI</h1>
      <div id="subtitle">by <a href="https://www.flofaber.com">Flo Faber</a></div>
      <div class="sidebar-item<?= (is_active('') ? ' active' : '') ?>"><a href="<?= WEBROOT ?>/">Queue</a></div>
      <div class="sidebar-item<?= (is_active('library.php') ? ' active' : '') ?>"><a href="<?= WEBROOT ?>/page/library.php">Library</a></div>
      <div class="sidebar-item<?= (is_active('playlists.php') ? ' active' : '') ?>"><a href="<?= WEBROOT ?>/page/playlists.php">Playlists</a></div>
      <div class="sidebar-item<?= (is_active('settings.php') ? ' active' : '') ?>"><a href="<?= WEBROOT ?>/page/settings.php">Settings</a></div>
      <div class="sidebar-item<?= (is_active('shortcuts.php') ? ' active' : '') ?>"><a href="<?= WEBROOT ?>/page/shortcuts.php">Shortcuts</a></div>
    </div>
    <div id="body">
      <div id="darkness"></div>
      <div id="player">
        <div id="player-controls">
          <div id="player-controls-buttons">
            <button id="player-previous">⏮</button>
            <button id="player-pp">PP</button>
            <button id="player-next">⏭</button>
          </div>
          <div id="player-volume">
            <input id="volume" type="range" min="0" max="100" step="5"/>
          </div>
        </div>
        <div id="player-song" title="click to seek">N/A</div>
        <div id="player-time">
          <div id="player-time-button">
            <button id="player-seek-back">-10s</button>
            <button id="player-seek-forward">+10s</button>
          </div>
          <div id="player-time-status">
            <span id="player-time-elapsed">00:00</span>
            <span>/</span>
            <span id="player-time-duration">00:00</span>
            <span>(</span><span id="player-time-percent">0%</span><span>)</span>
          </div>
        </div>
        <div id="player-modes">
          <div>
            <button class="player-mode" id="player-mode-single" title="Single" data-mode="single">↫</button>
            <button class="player-mode" id="player-mode-repeat" title="Repeat" data-mode="repeat">↺</button>
          </div>
          <div>
            <button class="player-mode" id="player-mode-random" title="Random" data-mode="random">⇌</button>
            <button class="player-mode" id="player-mode-consume" title="Consume" data-mode="consume">⇏</button>
          </div>
        </div>
      </div>
      <div id="content">
        <h2><?= $title ?? "" ?></h2>
        <?= $body ?? "<span style='color:grey;'>This page is as empty as your life.</span>" ?>
      </div>
    </div>
    <script type="text/javascript" src="<?= WEBROOT ?>/js/main.js"></script>
    <script type="text/javascript" src="<?= WEBROOT ?>/js/player.js"></script>
<?php
if(isset($scripts)){
  foreach($scripts as $script){
?>
    <script type="text/javascript" src="<?= WEBROOT ?>/<?= $script ?>"></script>
<?php
  }
}
?>
  </body>
</html>
