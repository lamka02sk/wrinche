<?php

namespace App\Database;

use App\Errors\UserEvents;
use App\Helpers\Config;
use PDO;
use PDOException;
use App\Models\ConnectionsModel;

class Connection {

    public $connection;

    private $_allConnections = [];
    private $_databaseHost;
    private $_queryType      = "";
    private $_queryString    = "";
    private $_queryBinds     = [];

    private static $_connectionSettings = array(
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
        PDO::ATTR_ERRMODE => 1
    );

    /**
     * @return string
     * Determine host type
     */
    private function determineHost() {

        if(strpos($this->_databaseHost, '.sock') !== false)
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
        $parsed = parse_url($this->_databaseHost);
        if(isset($parsed['path']))
            return $host . $parsed['path'];
        else if(isset($parsed['host']) && isset($parsed['port']))
            return $host . $parsed['host'] . ';port=' . $parsed['port'];
        else
            return $this->_databaseHost;

    }

    /**
     * @return string
     * Create socket type host string
     */
    private function createSocket() {

        return 'unix_socket=' . $this->_databaseHost;

    }

    /**
     * @param string $connection
     * Acts like a constructor, but it's not.
     */
    public function connect($connection = "default") {

        // Create connection information
        $model                 = new ConnectionsModel;
        $this->_allConnections = $model->start()->connections;
        $connection            = $this->_allConnections[$connection];
        $this->_databaseHost   = $connection["host"];
        $host                  = $this->determineHost();
        $database              = $connection["database"];
        $user                  = $connection["user"];
        $pass                  = $connection["pass"];

        try {
            
            $this->connection = new PDO(
                "mysql:$host;dbname=$database",
                $user,
                $pass,
                self::$_connectionSettings);
            
        } catch(PDOException $e) {
            new UserEvents(-1);  // Could not connect to the database
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

        $this->_databaseHost = $host;
        $host                = $this->determineHost();

        // Try to connect to the DB
        try {

            $connection = new PDO(
                "mysql:$host;dbname=$database",
                $username,
                $password);
            $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            new Config;

            // Check database version
            $version = substr($connection->query('select version()')->fetchColumn(), 0, 6);
            if(
                !version_compare(
                    $version,
                    Config::$file['system']['requirements']['mysql-version'],
                    '<')
                &&
                !version_compare(
                    $version,
                    Config::$file['system']['requirements']['mariadb-version'],
                    '<')
            )
                return null;

            return $connection;

        } catch(PDOException $e) {
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
        
        if(empty($this->connection))
            $this->connect();

        $this->_queryType   = $queryType;
        $this->_queryString = $query;
        $this->_queryBinds  = $binds;

        switch($this->_queryType) {
            
            case "select":
                return $this->executeSelectQuery();
                break;
                
            case "insert":
            case "update":
            case "delete":
            case "truncate":
                return $this->executeOtherQuery($getID);
                break;
                
        }

        return true;

    }

    /**
     * @return mixed
     * Execute select queries
     */
    private function executeSelectQuery() {

        $instance = $this->connection->prepare($this->_queryString);
        $instance->execute($this->_queryBinds);
        $output = $instance->fetchAll(PDO::FETCH_ASSOC);

        return $output;

    }

    /**
     * @param $getID bool
     * Execute any query except select
     * @return array
     */
    private function executeOtherQuery(bool $getID = false) {

        $instance = $this->connection->prepare($this->_queryString);
        $instance->execute($this->_queryBinds);
        $output = [];

        if($getID)
            $output = $this->connection->lastInsertId();

        return $output;

    }

}