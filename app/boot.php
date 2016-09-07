<?php

/* wrinche. Modern, powerful and user friendly CMS. */

// Initialize Autoloader
require_once 'autoload.php';

// Use...
use App\Helpers\Config;
use App\Helpers\Prepare;
use App\Controllers\StatsController as Stats;
use App\Controllers\InstallController as Install;

// Load Main Config and Save Instance
$config = new Config('system');

// Create StatsController Instance for user tracking
$stats = new Stats();

// Prepare system, Check Dependencies and Save Instance
$prepare = new Prepare($stats);

// Check installation or Initialize router
if(!$prepare->checkInstall()) {

    // Call installer
    $install = new Install();
    $install->setLanguage($stats->parsedData['client']['language']);
    $install->start();
} else {
    // Call router

}

// Tracking
$stats->start();

// END.