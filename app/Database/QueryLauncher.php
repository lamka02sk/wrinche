<?php

namespace App\Database;

class QueryLauncher extends Connection {

    /**
     * @param $builder
     * @param $getID
     * Launch given query and return output
     * @return mixed
     */
    public function launch($builder, $getID) {

        $type = $builder->queryType;
        $query = $builder->resultQuery;
        $binds = $builder->queryBinds;

        return $this->executeQuery($type, $query, $binds, $getID);

    }

}