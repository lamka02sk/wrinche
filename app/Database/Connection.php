<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Database connection module.
 * Version: 0.5.1
 * Authors: lamka02sk
 */

namespace App\Database;

use PDO;
use PDOException;
use App\Models\ConnectionsModel;

class Connection {

    /**
     * @var mixed
     * Current DB connection
     */
    public $connection;

    /**
     * @var array
     * List of present connections
     */
    private $connections = [];

    /**
     * @var string
     * DB host name
     */
    private $host;

    /**
     * @var string
     * Query type
     */
    private $type = "";

    /**
     * @var string
     * Query string
     */
    private $query = "";

    /**
     * @var array
     * Value binds array
     */
    private $binds = [];

    /**
     * @var array Settings for new connection
     */
    private static $settings = array(
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
        PDO::ATTR_ERRMODE => 1
    );

    /**
     * @return string
     * Determine host type
     */
    private function determineHost() {

        if(strpos($this->host, '.sock') !== false)
            return $this->createSocket();
        else
            return $this->createHost();

    }

    /**
     * @return string
     * Create host string
     */
    private function createHost() {

        $host = 'host=';
        $parsed = parse_url($this->host);
        if(isset($parsed['path']))
            return $host . $parsed['path'];
        else if(isset($parsed['host']) && isset($parsed['port']))
            return $host . $parsed['host'] . ';port=' . $parsed['port'];
        else
            return $this->host;

    }

    /**
     * @return string
     * Create socket type host string
     */
    private function createSocket() {

        return 'unix_socket=' . $this->host;

    }

    /**
     * @param string $connection
     * Acts like a constructor, but it's not.
     */
    public function connect($connection = "default") {

        // Create connection information
        $model = new ConnectionsModel;
        $this->connections = $model->start()->connections;
        $connection = $this->connections[$connection];
        $this->host = $connection["host"];
        $host = $this->determineHost();
        $database = $connection["database"];
        $user = $connection["user"];
        $pass = $connection["pass"];

        try {
            $this->connection = new PDO("mysql:$host;dbname=$database", $user, $pass, self::$settings);
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
    public function checkConnection($host, $database, $username, $password) {

        $this->host = $host;
        $host = $this->determineHost();

        // Try to connect to the DB with given parameters
        try {

            // Create PDO connection instance
            $connection = new PDO("mysql:$host;dbname=$database", $username, $password);
            $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Return connection if successfully connected
            return $connection;

        } catch(PDOException $e) {

            // Return null if connection failed
            return null;

        }

    }

    /**
     * @param $query
     * Execute RAW query
     */
    public function executeRaw($query) {

        $this->connection->query($query);

    }

    /**
     * @param $queryType string Query Type
     * @param $query string SQL Query
     * @param $binds array  Parameter binds
     * @param $getID bool
     * Execute any given query. Primarily made for database migrations or some custom queries.
     * @return mixed
     */
    public function executeQuery(string $queryType, string $query, array $binds = [], bool $getID = false) {

        // Detect query type, save data and execute
        if(empty($this->connection))
            $this->connect();

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
                $this->executeOtherQuery($getID);
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
     * @param $getID bool
     * Execute any query except select
     * @return array
     */
    private function executeOtherQuery(bool $getID = false) {

        $instance = $this->connection->prepare($this->query);
        $instance->execute($this->binds);
        $output = [];
        if($getID)
            $output = $instance->lastInsertId();

        return $output;

    }

}