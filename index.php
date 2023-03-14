<?php
require_once __DIR__ . "/inc/config.php";
$data = [
  "title" => "Queue",
  "body" => "
<div>
  <button id='queue-clear'>clear</button>
  <button id='queue-shuffle'>shuffle</button>
  <button id='queue-save'>save...</button>
</div>

<div id='queue'>
  <p style='color: grey;'>The Queue is empty. You can load <a href='" . WEBROOT . "/page/playlists.php'>Playlists</a> or songs from the <a href='" . WEBROOT . "/page/library.php'>Library</a>.
</div>
<script type='text/javascript' src='" . WEBROOT . "/js/queue.js'></script>"
];

require __DIR__ . "/templates/main.html.php";
