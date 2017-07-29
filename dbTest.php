<?php

use App\Auth\Csrf;
use App\Database;
use App\Helpers;

define('ROOT', __DIR__);
session_start();
require_once ROOT . '/app/autoload.php';

$csrf      = new Csrf;
$sanitizer = new Helpers\Sanitizer;

// Check $_POST data
if(!isset($_POST['dbhost']) || empty(trim($_POST['dbhost']))) {
    echo 'false';
    exit;
}

if(!isset($_POST['dbname']) || empty(trim($_POST['dbname']))) {
    echo 'false';
    exit;
}

if(!isset($_POST['dbuser']) || empty(trim($_POST['dbuser']))) {
    echo 'false';
    exit;
}

if(!isset($_POST['dbpass']) || empty(trim($_POST['dbpass']))) {
    echo 'false';
    exit;
}

// Everything OK ... validate and sanitize data
$databaseHost     = $sanitizer->sanitizeMagicQuotes($_POST['dbhost']);
$databaseName     = $sanitizer->sanitizeMagicQuotes($_POST['dbname']);
$databaseUser     = $sanitizer->sanitizeMagicQuotes($_POST['dbuser']);
$databasePassword = $sanitizer->sanitizeMagicQuotes($_POST['dbpass']);

// Check connection
$connection = new Database\Connection;
$connection = $connection->checkConnection($databaseHost, $databaseName, $databaseUser, $databasePassword);

// Return result
if($connection === null)
    echo 'false';
else
    echo 'true';