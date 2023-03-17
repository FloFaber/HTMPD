<?php

require_once __DIR__ . "/../inc/config.php";

$title = "Library";
$body = "<div id='library-path'><a href=''>C:</a>/</div>
<div id='library'>Empty...</div>
<button id='update'>update db</button>
";
$scripts = [ "js/library.js" ];
$csss = [ "css/library.css" ];

require __DIR__ . "/../templates/main.html.php";
