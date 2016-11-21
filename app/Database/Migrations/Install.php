<?php

// Get list of installation migrations
$migrations = $_SESSION['CONFIG']['system']['installation_migrations'];

// Prepare database connection
$connection = new \App\Database\Connection();
$connection->connect();

// Load all migration queries
$migrationQueries = [];
foreach($migrations as $key => $migration) {
    $migrationQueries[$key] = file_get_contents(ROOT . '/app/Database/Migrations/' . $migration . '.sql');
}

// Execute migrations queries
foreach($migrationQueries as $query) {

    $connection->executeRaw($query);

}