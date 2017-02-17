<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Database query launcher module.
 * Version: 0.2.1
 * Authors: lamka02sk
 */

namespace App\Database;

class QueryLauncher extends Connection {

    /**
     * @param $builder
     * @param $getID
     * Launch given query and return output
     * @return mixed
     */
    public function launch($builder, $getID) {

        // Execute query
        $type = $builder->queryType;
        $query = $builder->resultQuery;
        $binds = $builder->queryBinds;

        return $this->executeQuery($type, $query, $binds, $getID);

    }

}