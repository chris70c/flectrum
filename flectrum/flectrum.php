<?php

  date_default_timezone_set('America/New_York');

  function save($buffer) {
  //file_put_contents('flectrum-compiled.js', $buffer);
    return $buffer;
  }

  ob_start('save');

  $visuals = array(
    'Split',
    'Stripe',
    'Inward',
    'Outward'
  );

  $helpers = array('iscolor', 'isimage', 'isnumeric', 'range');

  echo <<<fl
/*
  Flectrum 1.1
  2016/12/15
  Christian Corti
  NEOART Costa Rica
*/\n\n
fl;

  require_once 'core/enums.js';
  echo "\n\n";
  require_once 'core/header.js';
  echo "\n\n";
  require_once 'core/Flectrum.js';
  echo "\n\n";
  require_once 'core/Composer.js';
  echo "\n\n";
  require_once 'core/Basic.js';
  echo "\n\n";

  foreach ($visuals as $file) {
    require_once "visuals/{$file}.js";
    echo "\n\n";
  }

  require_once 'core/private.js';
  echo "\n\n";
  require_once '../common/helpers.php';
  require_once 'core/footer.js';

  header('content-type:text/javascript');
  ob_end_flush();

?>