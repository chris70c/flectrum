<?php

  if (isset($_POST['path'])) {
    //$dir = $_SERVER['DOCUMENT_ROOT'].'/'.$_POST['path'];
    $dir = $_POST['path'];
    $res = false;

    if (!empty($dir)) {
      //$res = @array_diff(scandir($dir, SCANDIR_SORT_NONE), array('..', '.'));
      $res = @array_diff(scandir($dir), array('..', '.'));
    }

    if ($res == false) {
      die('<label>Directory not found.</label>');
    }

    $ar1 = array();
    $ar2 = array();

    foreach($res as $key => $value) {
      $value = trim($value);

      $ext = pathinfo($value, PATHINFO_EXTENSION);
      $ele = '<figure><figcaption class="'.$ext.'">'.$value.'</figcaption></figure>';

      if (is_dir($dir.DIRECTORY_SEPARATOR.$value)) {
        $ar1[] = '<b>'.$ele.'</b>';
      } else {
        $ar2[] = '<span>'.$ele.'</span>';
      }
    }

    $res = array_merge($ar1, $ar2);
    $ret = implode($res, "\n");

    header('content-type:text/html');
    die(utf8_encode($ret));
  }

  if (isset($_GET['file'])) {
    //$file = $_SERVER['DOCUMENT_ROOT'].'/'.$_GET['file'];
    $file = $_GET['file'];

    if (!empty($file) && is_file($file)) {
      header('content-type:application/octet-stream');
      readfile($file);
    }
  }

?>