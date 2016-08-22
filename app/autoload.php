<?php

/* wrinche. Modern, powerful and user friendly CMS. */

function autoload($path) {
    $path = str_replace('\\', '/', $path);
    $path = str_replace('App/', '', $path);
    require_once $path . '.php';
}

spl_autoload_register('autoload');