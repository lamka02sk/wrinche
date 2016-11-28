<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Database connection module.
 * Version: 0.5
 * Authors: lamka02sk
 */

namespace App\Database;

use PDO;
use PDOException;
use App\Models\ConnectionsModel;

class Connection {

    public $connection;
    private $connections = [];

    private $type = "";
    private $query = "";
    private $binds = [];

    /**
     * @var array Settings for new connection
     */
    private static $settings = array(
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
    );

    /**
     * @param string $connection
     * Acts like a constructor, but it's not.
     */
    public function connect($connection = "default") {

        $model = new ConnectionsModel;
        $this->connections = $model->start()->connections;
        $connection = $this->connections[$connection];
        $host = $connection["host"];
        $database = $connection["database"];
        $user = $connection["user"];
        $pass = $connection["pass"];

        try {

            $this->connection = new PDO("mysql:host=$host;dbname=$database", $user, $pass, self::$settings);

        } catch(PDOException $e) {

            // Create Error

        }

    }

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

    /**
     * Return the last inserted ID
     */
    public function insertGetID() {

        return $this->connection->lastInsertId();

    }

    public function executeRaw($query) {

        $this->connection->query($query);

    }

    /**
     * @param $queryType string Query Type
     * @param $query string SQL Query
     * @param $binds array  Parameter binds
     * Execute any given query. Primarily made for database migrations or some custom queries.
     * @return mixed
     */
    public function executeQuery(string $queryType, string $query, array $binds = []) {

        if(empty($this->connection)) {
            $this->connect();
        }

        $this->type = $queryType;
        $this->query = $query;
        $this->binds = $binds;

        switch($this->type) {
            case "select":
                return $this->executeSelectQuery();
                break;
            case "insert":
            case "update":
            case "delete":
            case "truncate":
                $this->executeOtherQuery();
                break;
        }

        return true;

    }

    /**
     * @return mixed
     * Execute select queries
     */
    private function executeSelectQuery() {

        $instance = $this->connection->prepare($this->query);
        $instance->execute($this->binds);
        $output = $instance->fetchAll(PDO::FETCH_ASSOC);

        return $output;

    }

    /**
     * Execute any query except select
     */
    private function executeOtherQuery() {

        $instance = $this->connection->prepare($this->query);
        $instance->execute($this->binds);

    }

}