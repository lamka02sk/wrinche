<?php

// Define ROOT
define('ROOT', __DIR__);

// Initialize Autoloader
require_once ROOT . '/app/autoload.php';

// Start session
session_start();

// Use...
use App\Auth\Csrf;
use App\Helpers;
use App\Database;

// Verify CSRF Token
$csrf = new Csrf();

// Sanitizer
$sanitizer = new Helpers\Sanitizer();

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
$dbhost = $sanitizer->sanitizeMagicQuotes($_POST['dbhost']);
$dbname = $sanitizer->sanitizeMagicQuotes($_POST['dbname']);
$dbuser = $sanitizer->sanitizeMagicQuotes($_POST['dbuser']);
$dbpass = $sanitizer->sanitizeMagicQuotes($_POST['dbpass']);

// Check connection
$connection = new Database\Connection;
$connection = $connection->checkConnection($dbhost, $dbname, $dbuser, $dbpass);

// Return result
if($connection === null) {
    echo 'false';
} else {
    echo 'true';
}

exit;