<?php

  date_default_timezone_set('America/New_York');

  ob_start();

  foreach ($helpers as $file) {
    require_once "helpers/{$file}.js";
    echo "\n\n";
  }

  ob_end_flush();

?>