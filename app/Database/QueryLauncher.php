<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Database query launcher module.
 * Version: 0.2
 * Authors: lamka02sk
 */

namespace App\Database;

class QueryLauncher extends Connection {

    public function launch($builder) {

        // Execute query
        $type = $builder->queryType;
        $query = $builder->resultQuery;
        $binds = $builder->queryBinds;

        return $this->executeQuery($type, $query, $binds);

    }

}