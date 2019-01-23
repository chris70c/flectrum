<?php

  date_default_timezone_set('America/New_York');

  $colors = array(
    '[color1]'  => '#fff',
    '[color2]'  => '#f7f7f8',
    '[color3]'  => '#f0f0f1',
    '[color4]'  => '#ddddde',
    '[color5]'  => '#99999a',
    '[color6]'  => '#707071',
    '[color7]'  => '#234',
    '[color8]'  => '#000',
    '[color9]'  => '#edf5fe',
    '[color10]' => '#bedcfa',
    '[color11]' => '#9bc8f5',
    '[color12]' => '#2a5b96',
    '[color13]' => '#ffcc00',
    '[color14]' => '#967710',
    '[color15]' => '#ffcc00',
    '[color16]' => '#967710',
    '[color17]' => '#0a4280',
    '[color18]' => '#c00000',
    '[image1]'  => 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMSIgaGVpZ2h0PSI2Ij48ZyBmaWxsPSIjNzA3MDcxIiBzdHJva2U9IjAiPjxwb2x5Z29uIHBvaW50cz0iMCAwLDExIDAsNS41LDYiLz48L2c+PC9zdmc+',
    '[image2]'  => 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMSIgaGVpZ2h0PSI2Ij48ZyBmaWxsPSIjZGRkZGRlIiBzdHJva2U9IjAiPjxwb2x5Z29uIHBvaW50cz0iMCAwLDExIDAsNS41LDYiLz48L2c+PC9zdmc+'
  );

  function save($buffer) {
    global $colors;

    $search = array_keys($colors);
    $replace = array_values($colors);

    $buffer = str_replace($search, $replace, $buffer);

  //file_put_contents('css-compiled.css', $buffer);

    return $buffer;
  }

  function printout($required) {
    ob_start('save');

    foreach ($required as $file) {
      require_once $file;
      echo "\n";
    }

    header('content-type:text/css');
    ob_end_flush();
  }

?>