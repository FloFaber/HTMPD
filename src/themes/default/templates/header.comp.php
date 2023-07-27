<!--
Hi there :)
-->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>HTMPD - MPD WebUI</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link rel="stylesheet" href="<?= WEBROOT ?? "" ?>/themes/<?= THEME ?? "default" ?>/css/main.css"/>
  <link rel="stylesheet" href="<?= WEBROOT ?? "" ?>/themes/<?= THEME ?? "default" ?>/css/player.css"/>
  <?php foreach($data["csss"] ?? [] as $css){ ?>
    <link rel="stylesheet" href="<?= WEBROOT ?? "" ?>/themes/<?= THEME ?? "default" ?>/<?= $css ?? "" ?>"/>
  <?php } ?>
  <script type="text/javascript">window.WEBROOT = "<?= WEBROOT ?? "" ?>";</script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/jquery-3.6.4.min.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/utils.js"></script>
</head>
<body>
<div id="notifications"></div>
<?php include __DIR__ . "/sidebar.comp.php"; ?>

  <div id="body">
    <div id="darkness"></div>
    <?php include __DIR__ . "/player.comp.php"; ?>

    <div id="content">
<!-- End header -->