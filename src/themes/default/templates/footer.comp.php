<!-- Begin footer -->
    </div> <!-- End div#content -->
  </div> <!-- End div#body -->
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/main.js"></script>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/js/player.js"></script>

<?php foreach($data["jss"] ?? [] as $js){ ?>
  <script type="text/javascript" src="<?= WEBROOT ?? "" ?>/<?= $js ?? "" ?>"></script>
<?php } ?>
</body>
</html>
<!-- End footer -->