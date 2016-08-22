<?php

/* wrinche. Modern, powerful and user friendly CMS. */

// Initialize Autoloader
require_once 'autoload.php';

// Use...
use App\Helpers\Config;
use App\Helpers\Prepare;
use App\Controllers\Install;

// Load Config Values
Config::load();

// Language and Timezone
Prepare::lang();

// Check requirements
Prepare::req();

// Setup env
Prepare::env();

// Check installation
if(!Prepare::install()) {
    new Install();
    exit;
}

// Initialize Router