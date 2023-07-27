<?php
require __DIR__ . "/../inc/config.loader.php";

$data = [];

require __DIR__ . "/../themes/".(THEME ?? "default")."/templates/header.comp.php";
?>

  <h2>Keyboard Shortcuts</h2>
  <table id='shortcuts'>
    <tr>
      <th>Shortcut</th>
      <th>Action</th>
    </tr><tr>
      <td>SPACE</td>
      <td>play / pause</td>
    </tr><tr>
      <td>A / D</td>
      <td>previous / next song</td>
    </tr><tr>
      <td>Q / E</td>
      <td>seek back / forward 10 seconds</td>
    </tr><tr>
      <td>+ / -</td>
      <td>increase / decrease volume</td>
    </tr>
  </table>

<?php
require __DIR__ . "/../themes/".(THEME ?? "default")."/templates/footer.comp.php";

