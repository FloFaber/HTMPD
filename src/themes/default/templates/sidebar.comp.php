<div id="sidebar">
  <h1 id="title"><span id="title-part1">HT</span><span id="title-part2">MPD</span></h1>
  <div id="subtitle">by <a href="https://www.flofaber.com">Flo Faber</a></div>

  <div class="sidebar-item <?= $_SERVER["SCRIPT_NAME"] === "queue.php" ? "active" : "" ?>"><a href="<?= WEBROOT ?? "" ?>/">Queue</a></div>
  <div class="sidebar-item <?= $_SERVER["SCRIPT_NAME"] === "files.php" ? "active" : "" ?>"><a href="<?= WEBROOT ?? "" ?>/page/files.php">Files</a></div>
  <div class="sidebar-item <?= $_SERVER["SCRIPT_NAME"] === "playlists.php" ? "active" : "" ?>"><a href="<?= WEBROOT ?? "" ?>/page/playlists.php">Playlists</a></div>
  <div class="sidebar-item <?= $_SERVER["SCRIPT_NAME"] === "settings.php" ? "active" : "" ?>"><a href="<?= WEBROOT ?? "" ?>/page/settings.php">Settings</a></div>
  <div class="sidebar-item <?= $_SERVER["SCRIPT_NAME"] === "shortcuts.php" ? "active" : "" ?>"><a href="<?= WEBROOT ?? "" ?>/page/shortcuts.php">Shortcuts</a></div>
</div>