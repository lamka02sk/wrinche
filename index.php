<?php

/* wrinche. Modern, powerful and user friendly CMS. */

// Start time
define('APP_START', $_SERVER['REQUEST_TIME']);

// Start session
session_start();

// Boot wrinche system
require_once 'app/boot.php';