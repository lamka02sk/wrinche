<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Boot script, place where all the magic happens.
 * Version: 0.8.8
 * Authors: lamka02sk
 */

error_reporting(E_ALL);
ini_set('display_errors', true);

// Initialize Autoloader
require_once 'autoload.php';

// Use...
use App\Requests\Request;
use App\Helpers\Config;
use App\Helpers\Prepare;
use App\Auth\Csrf;
use App\Auth\DDoS;
use App\Controllers\StatsController;
use App\Controllers\LogsController;
use App\Controllers\InstallController;

// Call anti-flood DDoS protection
//new DDoS;

// Save Requests
Request::init();

// Load Configs
$config = new Config;

// Set encoding
mb_internal_encoding(Config::$file['system']['charset']);

// Create StatsController Instance for user tracking
$stats = new StatsController;
$logs = new LogsController;

// Prepare system, Check Dependencies and Save Instance
$prepare = new Prepare;

// Verify and update CSRF Token if AJAX Request or update if not AJAX
$csrf = new Csrf;

// Check installation or Initialize router
if(!$prepare->checkInstall()) {

    // Call installer
    $install = new InstallController;
    $install->start();

} else {

    // Route Request
    require 'router.php';

}

// Save loaded configs
$config->saveChanges('system');

// Tracking
//$stats->start();
//$logs->start();

// END.