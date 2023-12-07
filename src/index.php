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

  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/handlebars.min-v4.7.8.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/jquery-3.6.4.min.js"></script>
  <script type="text/javascript">
    window.WEBROOT = "<?= WEBROOT ?? "" ?>";
    window.templates = {};
    window.views = {};

    Handlebars.registerHelper('fallback', function (value, fallback) {
      return new Handlebars.SafeString(value || fallback);
    });
  </script>

  <!-- Templates Start -->
<?php
foreach(scandir(__DIR__ . "/themes/" . (THEME ?? "default") . "/templates/") as $js){
  if(!str_ends_with($js, ".js")){ continue; }
?>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/themes/<?= (THEME ?? "") . "/templates/$js" ?>"></script>
<?php
}
?>
  <!-- Templates End -->

  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/utils.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/FileBrowser.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Library.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Playlist.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Queue.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Player.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/Settings.js"></script>
</head>
<body>
  <div id="notifications"></div>
  <div id="sidebar">
    <h1 id="title"><span id="title-part1">HT</span><span id="title-part2">MPD</span></h1>
    <div id="subtitle">by <a href="https://www.flofaber.com">Flo Faber</a></div>

    <div class="sidebar-item"><a href="#view=files">Files</a></div>
    <div class="sidebar-item"><a href="#view=artists">Artists</a></div>
    <div class="sidebar-item"><a href="#view=albums">Albums</a></div>
    <div class="sidebar-item"><a href="#view=playlists">Playlists</a></div>
    <div class="sidebar-item"><a href="#view=settings">Settings</a></div>
    <div class="sidebar-item"><a href="#view=shortcuts">Shortcuts</a></div>
  </div>

  <div id="body">
    <div id="darkness"></div>
    <div id="player"></div>

    <div id="split-view">
      <div id="split-left"></div>
      <div id="split-right"></div>
    </div> <!-- End div#content -->
  </div> <!-- End div#body -->


  <script type="text/javascript">
    window.library = new Library();
    window.queue = new Queue();
    window.player = new Player();
  </script>

  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/main.js"></script>

</body>
</html>
<!-- End footer -->