<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Database query builder module.
 * Version: 0.3
 * Authors: lamka02sk
 */

namespace App\Database;

class QueryBuilder extends Connection {

    protected $queryTypes = [
        "select", "insert", "update", "delete", "truncate"
    ];

    public $queryCommands;

    public $queryType = "";

    public $resultQuery = "";

    public $queryBinds = [];

    public $firstWhere = true;

    public $output = "";

    public $insertID = "";

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * QueryBuilder constructor.
     * Creates QueryCommands Instance
     */
    public function __construct() {

        // Create query
        $this->queryCommands = new QueryCommands($this);

        return $this;

    }

    /**
     * Prepares query for execution
     */
    public function execQuery() {

        if(empty($this->queryType) || !in_array($this->queryType, $this->queryTypes)) {

            // Create Error > Every query must have its queryType.

        }

        // Parse user input to the SQL Query
        $this->createQuery();

        // echo $this->resultQuery;

        // Execute
        $launcher = new QueryLauncher;
        $this->output = $launcher->launch($this);

        // Get insert ID
        if($this->queryCommands->getID) {
            $this->insertID = $this->insertGetID();
        }

    }

    /**
     * Creates SQL Query from user input
     */
    public function createQuery() {

        // Determine Query Type and create SQL Query
        switch($this->queryType) {
            case "select":
                // Create select query
                $this->createSelectQuery();
                break;
            case "insert":
                // Create insert query
                $this->createInsertQuery();
                break;
            case "update":
                // Create update query
                $this->createUpdateQuery();
                break;
            case "delete":
                // Create delete query
                $this->createDeleteQuery();
                break;
            case "truncate":
                // Create truncate query
                $this->createTruncateQuery();
                break;
            default:
                // Create Error > Undefined query type
                break;
        }

    }

    public function createSelectQuery() {

        /*
         * ---------- SELECT QUERY PROTOTYPE ----------
         * SELECT DISTINCT columns \w aggregates     OK
         * FROM table                                OK
         * JOINS table ON column1 = column2          OK
         * WHERE column = :param AND / OR / HAVING   OK
         * ORDER BY column                           OK
         * GROUP BY column                           OK
         * LIMITS / FIRST, OFFSETS                   OK
         */

        /*
         * Create Query
         */
        $query = "SELECT ";

        if($this->queryCommands->distinct) {
            $query .= "DISTINCT ";
        }

        $columns = implode(", ", $this->queryCommands->values);

        $separator = ", ";
        if(empty($columns)) {
            $separator = "";
        }

        if(!empty($this->queryCommands->count)) {
            $columns .= $separator . "COUNT(" . $this->queryCommands->count . ")";
            $separator = ", ";
        }

        if(!empty($this->queryCommands->max)) {
            $columns .= $separator . "MAX(" . $this->queryCommands->max . ")";
            $separator = ", ";
        }

        if(!empty($this->queryCommands->min)) {
            $columns .= $separator . "MIN(" . $this->queryCommands->min . ")";
            $separator = ", ";
        }

        if(!empty($this->queryCommands->average)) {
            $columns .= $separator . "AVG(" . $this->queryCommands->average . ")";
            $separator = ", ";
        }

        if(!empty($this->queryCommands->sum)) {
            $columns .= $separator . "SUM(" . $this->queryCommands->sum . ")";
        }

        $query .= $columns . " ";

        $table = "FROM " . $this->queryCommands->table;

        $query .= $table . " ";
        $query .= $this->createJoins();

        $whereQuery = $this->createWhere();
        if($whereQuery !== "WHERE ") {
            $query .= $whereQuery;
        }

        $orderBy = $this->queryCommands->orderBy;
        $orderRandom = $this->queryCommands->orderRandom;
        $orderQuery = "";

        if(!empty($orderBy["column"]) && !$orderRandom) {

            $asc = "DESC ";
            if($orderBy['asc']) {
                $asc = "ASC ";
            }

            $orderQuery .= "ORDER BY " . $orderBy["column"] . " " . $asc;

        } else if($orderRandom && empty($orderBy["column"])) {

            // Random order
            $orderQuery .= "ORDER BY RAND() ";

        }

        $query .= $orderQuery;

        $groupBy = $this->queryCommands->groupBy;
        $groupQuery = "";

        if(!empty($groupBy["column"])) {

            $groupQuery = "GROUP BY :group ";
            $this->queryBinds[":group"] = $groupBy["column"];

        }

        $query .= $groupQuery;

        $limit = $this->queryCommands->limit;
        $first = $this->queryCommands->first;
        if($first) {
            $limit = 1;
        }

        if($limit > 0) {
            $query .= "LIMIT(" . $limit . ") ";
        }

        $offset = $this->queryCommands->offset;
        if($offset > 0) {
            $query .= "OFFSET(" . $offset . ") ";
        }

        // SELECT QUERY PREPARED
        $this->resultQuery = trim($query);

    }

    public function createInsertQuery() {

        /*
         * ---------- INSERT QUERY PROTOTYPE ----------
         * INSERT INTO table (columns, ...)          OK
         * JOINS table ON column1 = column2          OK
         * VALUES (values, ...)                      OK
         */

        $query = "INSERT INTO ";

        $table = $this->queryCommands->table;
        $query .= $table . " ";

        $insert = $this->queryCommands->insert;
        $columns = [];
        $values = [];
        foreach($insert[0] as $row) {
            foreach($row as $column => $val) {
                $columns[] = $column;
                $values[] = $val;
            }
        }

        $columns = "(" . implode(", ", $columns) . ") ";
        $i = 0;
        $binds = [];
        foreach($values as $value) {
            $binds[] = ":insert" . $i;
            $this->queryBinds[":insert" . $i] = $value;
            $i++;
        }
        $values = "(" . implode(", ", $binds) . ") ";

        $query .= $columns;

        $joins = $this->createJoins();
        $query .= $joins;

        $query .= "VALUES " . $values;
        $this->resultQuery = trim($query);

    }

    public function createUpdateQuery() {

        /*
         * ---------- UPDATE QUERY PROTOTYPE ----------
         * UPDATE table
         * JOINS table ON column1 = column2
         * SET column1 = value, ...
         * WHERE column1 = value AND / OR
         */

        $query = "UPDATE ";

        $table = $this->queryCommands->table;
        $query .= $table . " ";

        $joins = $this->createJoins();
        $query .= $joins;

        $query .= "SET ";

        $sets = "";
        $update = $this->queryCommands->update;
        $i = 0;
        foreach($update as $column => $value) {
            $sets .= $column . " = :update" . $i . ", ";
            $this->queryBinds[":update" . $i] = $value;
            $i++;
        }

        $sets = rtrim($sets, ", ") . " ";
        $query .= $sets;

        $where = $this->createWhere();
        $query .= $where;

        $this->resultQuery = $query;

    }

    public function createDeleteQuery() {

        /*
        * ---------- DELETE QUERY PROTOTYPE ----------
        * DELETE FROM table
        * WHERE column1 = value AND / OR
        */

        $query = "DELETE FROM ";

        $table = $this->queryCommands->table;
        $query .= $table . " ";

        $where = $this->createWhere();
        $query .= $where;

        $query = trim($query);
        $this->resultQuery = $query;

    }

    public function createTruncateQuery() {

        /*
        * ---------- TRUNCATE QUERY PROTOTYPE ----------
        * TRUNCATE table
        */

        $query = "TRUNCATE " . $this->queryCommands->table;
        $this->resultQuery = $query;

    }

    public function createJoins() {

        $innerJoin = $this->queryCommands->innerJoin;
        $leftJoin = $this->queryCommands->leftJoin;
        $rightJoin = $this->queryCommands->rightJoin;

        $joins = "";

        if(!empty($innerJoin["tables"])) {

            foreach($innerJoin["tables"] as $key => $table) {
                $joins .= "INNER JOIN " . $table . " ON " . $innerJoin["columns"][$key] . " = " . $innerJoin["keys"][$key] . " ";
            }

        }

        if(!empty($leftJoin["tables"])) {

            foreach($leftJoin["tables"] as $key => $table) {

                $outer = "";
                if($leftJoin["outer"][0]) {
                    $outer = "OUTER ";
                }

                $joins .= "LEFT " . $outer . "JOIN " . $table . " ON " . $leftJoin["columns"][$key] . " = " . $leftJoin["keys"][$key] . " ";

            }

        }

        if(!empty($rightJoin["tables"])) {

            foreach($rightJoin["tables"] as $key => $table) {

                $outer = "";
                if($rightJoin["outer"][0]) {
                    $outer = "OUTER ";
                }

                $joins .= "RIGHT " . $outer . "JOIN " . $table . " ON " . $rightJoin["columns"][$key] . " = " . $rightJoin["keys"][$key] . " ";

            }

        }

        return $joins;

    }

    public function createWhere() {

        $whereQuery = "WHERE ";

        $where = $this->queryCommands->where;                   // OK
        $whereBetween = $this->queryCommands->whereBetween;     // OK
        $whereIn = $this->queryCommands->whereIn;               // OK
        $whereNull = $this->queryCommands->whereNull;           // OK
        $whereDate = $this->queryCommands->whereDate;           // OK
        $whereColumns = $this->queryCommands->whereColumns;     // OK
        $orWhere = $this->queryCommands->orWhere;               // OK
        $having = $this->queryCommands->having;                 // OK

        $and = false;
        if(!empty($where["columns"])) {

            foreach($where["columns"] as $key => $column) {

                $separator = "";
                if($and) {
                    $separator = "AND ";
                }

                $whereQuery .= $separator . "(" . $column . " " . $where["operators"][0][$key] . " :where" . $key . ") ";
                $this->queryBinds[":where" . $key] = $where["values"][$key];
                $and = true;

            }

        }

        if(!empty($whereBetween["column"])) {

            $separator = "";
            if($and) {
                $separator = "AND ";
            }

            if(!$whereBetween["invert"]) {

                $whereQuery .= $separator . "(" . $whereBetween["column"] . " BETWEEN :whereBetweenMin AND :whereBetweenMax) ";
                $this->queryBinds[":whereBetweenMin"] = $whereBetween["min"];
                $this->queryBinds[":whereBetweenMax"] = $whereBetween["max"];

            } else {

                $whereQuery .= $separator . "(" . $whereBetween["column"] . " < :whereBetweenMin OR " . $whereBetween["column"] . " > :whereBetweenMax) ";
                $this->queryBinds[":whereBetweenMin"] = $whereBetween["min"];
                $this->queryBinds[":whereBetweenMax"] = $whereBetween["max"];

            }

            $and = true;

        }

        if(!empty($whereIn["column"])) {

            $separator = "";
            if($and) {
                $separator = "AND ";
            }

            $invert = "";
            if($whereIn["invert"]) {
                $invert = " NOT";
            }

            $values = "('" . implode("', '", $whereIn["values"]) . "') ";
            $whereQuery .= $separator . $whereIn["column"] . $invert . " IN " . $values;
            $and = true;

        }

        if(!empty($whereNull["column"])) {

            $separator = "";
            if($and) {
                $separator = "AND ";
            }

            $invert = "";
            if($whereNull["invert"]) {
                $invert = "NOT ";
            }

            $whereQuery .= $separator . "(" . $whereNull["column"] . " IS " . $invert . "NULL) ";
            $and = true;

        }

        if(!empty($whereDate["type"])) {

            $separator = "";
            if($and) {
                $separator = "AND ";
            }

            $whereQuery .= $separator . strtoupper($whereDate["type"]) . "(" . $whereDate["column"] . ") = :whereDate ";

            $this->queryBinds[":whereDate"] = $whereDate["value"];
            $and = true;

        }

        if(!empty($whereColumns["columns"])) {

            foreach($whereColumns["columns"] as $key => $column) {

                $separator = "";
                if($and) {
                    $separator = "AND ";
                }

                $whereQuery .= $separator . "(" . $column . " " . $whereColumns["operators"][$key] . " :whereColumns" . $key . ") ";
                $this->queryBinds[":whereColumns" . $key] = $orWhere["values"][$key];
                $and = true;

            }

        }

        if(!empty($orWhere["columns"])) {

            $separator = "OR ";
            $and = true;

            foreach($orWhere["columns"] as $key => $column) {

                if(empty($separator)) {
                    $separator = "AND ";
                }

                $whereQuery .= $separator . "(" . $column . " " . $orWhere["operators"][$key] . " :orWhere" . $key . ") ";
                $this->queryBinds[":orWhere" . $key] = $orWhere["values"][$key];

                $separator = "AND ";

            }

        }

        if(!empty($having["key"])) {

            $whereQuery .= "HAVING " . $having["key"] . " " . $having["operator"] . " :having ";
            $this->queryBinds[":having"] = $having["value"];

        }

        return $whereQuery;

    }

}