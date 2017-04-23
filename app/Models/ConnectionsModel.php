<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Connection model. Manages database connections.
 * Version: 0.1.5
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Helpers\Config;

class ConnectionsModel extends MainModel {

    private $host,
            $database,
            $user,
            $pass;

    public $connections = [];

    public function start() {

        // Load current connections file
        $this->loadConnections();

        return $this;

    }

    private function loadConnections() {

        new Config('database');
        $this->connections = Config::$file['database'];

    }

    public function setConnection($host, $database, $user, $pass) {

        $this->host = $host;
        $this->database = $database;
        $this->user = $user;
        $this->pass = $pass;

        return $this;

    }

    public function getConnection() {

        return [
            $this->host, $this->database, $this->user, $this->pass
        ];

    }

    public function addConnection() {

        // If isset Default Connection, create another one
        if(isset($this->connections["default"]) && !empty($this->connections["default"])) {

            $this->connections[] = [
                "host" => $this->host,
                "database" => $this->database,
                "user" => $this->user,
                "pass" => $this->pass
            ];

        } else {

            $this->connections["default"] = [
                "host" => $this->host,
                "database" => $this->database,
                "user" => $this->user,
                "pass" => $this->pass
            ];

        }

        return $this;

    }

    public function saveConnections() {

        $json = json_encode($this->connections);
        file_put_contents(ROOT . '/app/Config/database.json', $json, LOCK_EX);

        return $this;

    }

}