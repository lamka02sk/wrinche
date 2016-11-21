<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Boot script, place where all the magic happens.
 * Version: 0.8
 * Authors: lamka02sk
 */

// Initialize Autoloader
require_once 'autoload.php';

// Use...
use App\Helpers\Config;
use App\Helpers\Prepare;
use App\Auth\Csrf;
use App\Controllers\StatsController as Stats;
use App\Controllers\LogsController as Logs;
use App\Controllers\InstallController as Install;

// Load Main Config and Save Instance
$config = new Config('system');

// Create StatsController Instance for user tracking
$stats = new Stats();
$logs = new Logs();

// Prepare system, Check Dependencies and Save Instance
$prepare = new Prepare($stats);

// Verify and update CSRF Token if AJAX Request or update if not AJAX
$csrf = new Csrf();

// Check installation or Initialize router
if(!$prepare->checkInstall()) {

    // Call installer
    $install = new Install();
    $install->setLanguage($stats->parsedData['client']['language']);
    $install->start();

} else {

    // SHOW WEBSITE OR ADMIN
    // Call router
    echo 'Welcome.';

}

// Save loaded configs
$config->saveChanges('system');

// Tracking
//$stats->start();
//$logs->start();

// END.