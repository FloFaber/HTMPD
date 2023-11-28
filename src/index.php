<?php
require __DIR__ . "/inc/config.loader.php";
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
foreach(scandir(__DIR__ . "/themes/" . (THEME ?? "default") . "/css/") as $css){
  if(!str_ends_with($css, ".css")){ continue; }
?>
  <link rel="stylesheet" href="<?= WEBROOT ?? "" ?>/themes/<?= THEME ?? "default" ?>/css/<?= $css ?? "" ?>"/>
<?php
}
?>
  <link rel="icon" href="<?= WEBROOT ?? "" ?>/favicon.png" type="image/png"/>

  <script type="text/javascript">
    window.WEBROOT = "<?= WEBROOT ?? "" ?>";
    window.templates = {};
  </script>
<?php
foreach(scandir(__DIR__ . "/themes/" . (THEME ?? "default") . "/templates/") as $js){
  if(!str_ends_with($js, ".js")){ continue; }
?>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/themes/<?= (THEME ?? "") . "/templates/$js" ?>"></script>
<?php
}
?>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/jquery-3.6.4.min.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/utils.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Template.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/FileBrowser.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Library.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Queue.js"></script>

</head>
<body>
  <div id="notifications"></div>
  <div id="sidebar">
    <h1 id="title"><span id="title-part1">HT</span><span id="title-part2">MPD</span></h1>
    <div id="subtitle">by <a href="https://www.flofaber.com">Flo Faber</a></div>

    <div class="sidebar-item"><a href="#">Library</a></div>
    <div class="sidebar-item"><a href="#view=files">Files</a></div>
    <div class="sidebar-item"><a href="#view=playlists">Playlists</a></div>
    <div class="sidebar-item"><a href="#view=settings">Settings</a></div>
    <div class="sidebar-item"><a href="#view=shortcuts">Shortcuts</a></div>
  </div>

  <div id="body">
    <div id="darkness"></div>
    <div id="player">
      <div id="player-thumbnail">
        <img alt="thumbnail" id="thumbnail"/>
      </div>
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
      <div id="player-song-data">
        <div id="player-song" title="click to seek">N/A</div>
        <div id="player-song-artist"></div>
      </div>

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

    <div id="split-view">
      <div id="split-left"></div>
      <div id="split-right"></div>
    </div> <!-- End div#content -->
  </div> <!-- End div#body -->


  <script type="text/javascript">
    window.library = new Library();
    window.queue = new Queue();
  </script>

  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/player.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/main.js"></script>

</body>
</html>
<!-- End footer -->