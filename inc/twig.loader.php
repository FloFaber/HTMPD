<?php

require_once __DIR__ . "/../config.php";
require_once __DIR__ . "/../vendor/autoload.php";

$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . "/../themes/" . THEME . "/templates");
$twig = new \Twig\Environment($loader, [
  'cache' => false,
]);
$twig->addExtension(new Twig\Extension\StringLoaderExtension());