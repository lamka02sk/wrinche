<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Database connection module.
 * Version: 0.2
 * Authors: lamka02sk
 */

namespace App\Database;

use PDO;
use PDOException;

class Connection {

    /**
     * @param $host
     * @param $database
     * @param $username
     * @param $password
     * Test DB connection with given parameters
     * @return null|PDO
     */
    public static function checkConnection($host, $database, $username, $password) {

        // Try to connect to the DB with given parameters
        try {

            // Create PDO connection instance
            $connection = new PDO("mysql:host=$host;dbname=$database", $username, $password);
            $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Return connection if successfully connected
            return $connection;

        } catch(PDOException $e) {

            // Return null if connection failed
            return null;

        }

    }

}