<?php

use App\Database\Connection;
use App\Helpers\Config;

$migrationsList = Config::$file['system']['installation_migrations'];

// Prepare database connection
$connection = new Connection;
$connection->connect();

// Load all migration queries
$migrationQueries = [];
foreach($migrationsList as $key => $migration)
    $migrationQueries[$key] = file_get_contents(ROOT . '/app/Database/Migrations/' . $migration . '.sql');

// Execute migrations queries
foreach($migrationQueries as $query)
    $connection->executeRaw($query);