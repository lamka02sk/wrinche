<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Database query commands API module.
 * Version: 0.5
 * Authors: lamka02sk
 */

namespace App\Database;

class QueryCommands {

    public $queryBuilder;

    /*
     * Operators & Types
     * ----------------------
     */
    protected $queryTypes = [
        "select", "insert", "update", "delete", "truncate"
    ];

    public $whereOperators = [
        "=", ">=", "<=", "<", ">", "<>", "like", "not like"
    ];

    public $dateTypes = [
        "date", "month", "day", "year"
    ];

    public $joinTypes = [
        "inner", "left", "right"
    ];

    /*
     * Query parts & Data
     * ----------------------
     * BASIC
     */
    public $table = "";

    /*
     * WHERE
     */
    public $where = [
        "columns" => [],
        "operators" => [],
        "values" => []
    ];

    public $whereBetween = [
        "column" => "",
        "min" => "",
        "max" => "",
        "invert" => false
    ];

    public $whereIn = [
        "column" => "",
        "values" => [],
        "invert" => false
    ];

    public $whereNull = [
        "column" => "",
        "invert" => false
    ];

    public $whereDate = [
        "type" => "",
        "column" => "",
        "value" => ""
    ];

    public $whereColumns = [
        "columns" => [],
        "operators" => [],
        "secondary" => []
    ];

    public $orWhere = [
        "columns" => [],
        "operators" => [],
        "values" => []
    ];

    public $having = [
        "key" => "",
        "operator" => "",
        "value" => ""
    ];

    /*
     * SELECT
     */
    public $values = [];

    public $first = false;

    public $distinct = false;

    public $offset = 0;

    public $limit = 0;

    /*
     * STATS
     */
    public $count = "";

    public $max = "";

    public $min = "";

    public $average = "";

    public $sum = "";

    /*
     * JOIN
     */
    public $innerJoin = [
        "tables" => [],
        "columns" => [],
        "keys" => []
    ];

    public $leftJoin = [
        "tables" => [],
        "columns" => [],
        "keys" => [],
        "outer" => false
    ];

    public $rightJoin = [
        "tables" => [],
        "columns" => [],
        "keys" => [],
        "outer" => false
    ];

    /*
     * ORDER
     */
    public $orderBy = [
        "column" => "",
        "asc" => false
    ];

    public $orderRandom = false;

    /*
     * GROUP
     */
    public $groupBy = [
        "column" => ""
    ];

    /*
     * INSERT
     */
    public $insert = [];

    public $getID = false;

    /*
     * UPDATE
     */
    public $update = [];

    public $increment = [
        "column" => "",
        "value" => 0
    ];

    public $decrement = [
        "column" => "",
        "value" => 0
    ];

    // -----------------------------------------------------------------------------------------------------------------

    public function __construct($instance) {

        $this->queryBuilder = $instance;

    }

    /*
     * Basic Commands
     */
    /**
     * @param $table
     * Set current table
     * @return $this
     */
    public function table(string $table) {

        if(empty($table)) {
            // Create Error > You must choose table
        }

        $this->table = $table;
        return $this;

    }

    /**
     * Execute query with given parameters
     */
    public function exec() {

        // Create and execute query
        $this->queryBuilder->execQuery();

    }

    /**
     * @return $this
     * Reset instance
     */
    public function reset() {

        return $this;

    }

    /**
     * @return $this
     * Set query type to "select"
     */
    public function select() {

        $this->queryBuilder->queryType = "select";
        return $this;

    }

    /**
     * @return $this
     * Set query type to "insert"
     */
    public function insert() {

        $this->queryBuilder->queryType = "insert";
        return $this;

    }

    /**
     * @return $this
     * Set query type to "update"
     */
    public function update() {

        $this->queryBuilder->queryType = "update";
        return $this;

    }

    /**
     * @return $this
     * Set query type to "delete"
     */
    public function delete() {

        $this->queryBuilder->queryType = "delete";
        return $this;

    }


    /**
     * @return $this
     * Set query type to "truncate"
     */
    public function truncate() {

        $this->queryBuilder->queryType = "truncate";
        return $this;

    }

    /**
     * @param string $query
     * @param array $params
     * Set custom query to execute
     * @return $this
     */
    public function raw(string $query, array $params = []) {

        $this->queryBuilder->queryParams = $params;
        $this->queryBuilder->resultQuery = $query;
        return $this;

    }

    /*
     * Where Commands
     */
    /**
     * @param $column
     * @param $value
     * @param $second
     * Sets data for where clause
     * @return $this
     */
    public function where($column, $value, $second = "") {

        $operator = ["="];
        if(!empty($second)) {

            $operator = [$value];
            foreach($operator as $item) {
                if(!in_array($item, $this->whereOperators)) {
                    // Create Error > Undefined Operator Type
                }
            }

            $value = $second;

        }

        if(!is_array($column)) {
            $column = [$column];
        }

        if(!is_array($value)) {
            $value = [$value];
        }

        if(count($column) !== count($value)) {
            // Create Error > Num of column names and values does not match.
        }

        $this->where = [
            "columns" => $column,
            "operators" => $operator,
            "values" => $value
        ];

        return $this;

    }

    /**
     * @param string $column
     * @param string $value
     * @param string $second
     * Add single where clause
     * @return $this
     */
    public function addWhere(string $column, string $value, string $second = "") {

        $operator = "=";
        if(!empty($second)) {

            $operator = $value;
            if(!in_array($operator, $this->whereOperators)) {
                // Create Error > Undefined Operator Type
            }

            $value = $second;

        }

        $this->where["columns"][] = $column;
        $this->where["operators"][] = $operator;
        $this->where["values"][] = $value;

        return $this;

    }

    /**
     * @param      $column
     * @param int  $min
     * @param int  $max
     * @param bool $not
     * Sets data for where in range clause
     * @return $this
     */
    public function whereBetween($column, int $min, int $max, bool $not = false) {

        if(is_array($column)) {
            // Create Error > You can define only single column
        }

        $this->whereBetween = [
            "column" => $column,
            "min" => $min,
            "max" => $max,
            "invert" => $not
        ];

        return $this;

    }


    /**
     * @param string $column
     * @param array  $array
     * @param bool   $not
     * Sets data for where in array of values clause
     * @return $this
     */
    public function whereIn(string $column, array $array, bool $not = false) {

        $this->whereIn = [
            "column" => $column,
            "values" => $array,
            "invert" => $not
        ];

        return $this;

    }

    /**
     * @param string $column
     * @param bool   $not
     * Sets data for where null clause
     * @return $this
     */
    public function whereNull(string $column, bool $not = false) {

        $this->whereNull = [
            "column" => $column,
            "invert" => $not
        ];

        return $this;

    }

    /**
     * @param string $type
     * @param string $column
     * @param string $value
     * Sets data for where date clauses
     * @return $this
     */
    public function whereDate(string $type, string $column, string $value) {

        if(!in_array($type, $this->dateTypes)) {
            // Create Error > Undefined date type
        }

        $this->whereDate = [
            "type" => $type,
            "column" => $column,
            "value" => $value
        ];

        return $this;

    }

    /**
     * @param $columns
     * @param $values
     * @param $second
     * Sets data for column comparision
     * @return $this
     */
    public function whereColumns($columns, $values, $second = "") {

        $operator = ["="];
        if(!empty($second)) {

            $operator = [$values];
            foreach($operator as $item) {
                if(!in_array($item, $this->whereOperators)) {
                    // Create Error > Undefined Operator Type
                }
            }

            $values = $second;

        }

        if(!is_array($columns)) {
            $columns = [$columns];
        }

        if(!is_array($values)) {
            $values = [$values];
        }

        if(count($columns) !== count($values)) {
            // Create Error > Num of column names and values does not match.
        }

        $this->whereColumns = [
            "columns" => $columns,
            "operators" => $operator,
            "values" => $values
        ];

        return $this;

    }

    /**
     * @param string $column
     * @param string $value
     * @param string $second
     * Add single column for comparision
     * @return $this
     */
    public function addWhereColumn(string $column, string $value, string $second = "") {

        $operator = "=";
        if(!empty($second)) {

            $operator = $value;
            if(!in_array($operator, $this->whereOperators)) {
                // Create Error > Undefined Operator Type
            }

            $value = $second;

        }

        $this->whereColumns["columns"][] = $column;
        $this->whereColumns["operators"][] = $operator;
        $this->whereColumns["values"][] = $value;

        return $this;

    }

    /**
     * @param $column
     * @param $value
     * @param $second
     * Sets data for or where clause
     * @return $this
     */
    public function orWhere($column, $value, $second = "") {

        $operator = ["="];
        if(!empty($second)) {

            $operator = [$value];
            foreach($operator as $item) {
                if(!in_array($item, $this->whereOperators)) {
                    // Create Error > Undefined Operator Type
                }
            }

            $value = $second;

        }

        if(!is_array($column)) {
            $column = [$column];
        }

        if(!is_array($value)) {
            $value = [$value];
        }

        if(count($column) !== count($value)) {
            // Create Error > Num of column names and values does not match.
        }

        $this->orWhere = [
            "columns" => $column,
            "operators" => $operator,
            "values" => $value
        ];

        return $this;

    }


    /**
     * @param string $column
     * @param string $value
     * @param string $second
     * Add single column to or where clause
     * @return $this
     */
    public function addOrWhere(string $column, string $value, string $second = "") {

        $operator = "=";
        if(!empty($second)) {

            $operator = $value;
            if(!in_array($operator, $this->whereOperators)) {
                // Create Error > Undefined Operator Type
            }

            $value = $second;

        }

        $this->orWhere["columns"][] = $column;
        $this->orWhere["operators"][] = $operator;
        $this->orWhere["values"][] = $value;

        return $this;

    }

    /**
     * @param string $key
     * @param string $value
     * @param string $second
     * Sets data for having clause
     * @return $this
     */
    public function having(string $key, string $value, string $second = "") {

        $operator = "=";
        if(!empty($second)) {

            $operator = $value;
            if(!in_array($operator, $this->whereOperators)) {
                // Create Error > Undefined Operator Type
            }

            $value = $second;

        }

        $this->having = [
            "key" => $key,
            "operator" => $operator,
            "value" => $value
        ];

        return $this;

    }

    /*
     * Select Commands
     */
    /**
     * @param $columns
     * Sets columns to return
     * @return $this
     */
    public function selectValues($columns = '*') {

        if(!is_array($columns)) {
            $columns = [$columns];
        }

        $this->values = $columns;
        return $this;

    }

    /**
     * @param string $value
     * Add single column to return array
     * @return $this
     */
    public function addSelectValue(string $value) {

        $this->values[] = $value;
        return $this;

    }

    /**
     * @return $this
     * Query returns only first row from database
     */
    public function first() {

        $this->first = true;
        return $this;

    }

    /**
     * @return $this
     * Query returns only distinct values.
     */
    public function distinct() {

        $this->distinct = true;
        return $this;

    }

    /**
     * @param int $value
     * Shifts the number of the first result
     * @return $this
     */
    public function offset(int $value) {

        $this->offset = $value;
        return $this;

    }

    /**
     * @param int $count
     * Limits the number of results
     * @return $this
     */
    public function limit(int $count) {

        $this->limit = $count;
        return $this;

    }

    /*
     * Stats Commands
     */
    /**
     * @param string $column
     * @return $this
     * Count all rows in selected table
     */
    public function count(string $column = "*") {

        $this->count = $column;
        return $this;

    }

    /**
     * @param string $column
     * Return maximum column value from the selected table
     * @return $this
     */
    public function max(string $column) {

        $this->max = $column;
        return $this;

    }

    /**
     * @param string $column
     * Return minimum column value from the selected table
     * @return $this
     */
    public function min(string $column) {

        $this->min = $column;
        return $this;

    }

    /**
     * @param string $column
     * Return average column value from the selected table
     * @return $this
     */
    public function average(string $column) {

        $this->average = $column;
        return $this;

    }

    /**
     * @param string $column
     * Return sum of column values from the selected table
     * @return $this
     */
    public function sum(string $column) {

        $this->sum = $column;
        return $this;

    }

    /*
     * Join Commands
     */
    /**
     * @param      $type
     * @param      $table
     * @param      $column
     * @param      $foreign
     * @param bool $outer
     * Calls function for joins of any type.
     * @return $this
     */
    public function join($type, $table, $column, $foreign, $outer = false) {

        if(!is_array($type)) {
            $type = [$type];
        }

        if(!is_array($table)) {
            $table = [$table];
        }

        if(!is_array($column)) {
            $column = [$column];
        }

        if(!is_array($foreign)) {
            $foreign = [$foreign];
        }

        if(!is_array($outer)) {
            $outer = [$outer];
        }

        if(!(count($type) === count($table) && count($table) === count($column) && count($column) === count($foreign) && count($foreign) === count($outer))) {
            // Create Error > Arrays does not contain equal number of items
        }

        $i = 0;
        foreach($type as $joinType) {

            if(!in_array($joinType, $this->joinTypes)) {
                // Create Error > Undefined Join Type
            }

            $this->{$joinType . "Join"}($table[$i], $column[$i], $foreign[$i], $outer[$i]);
            $i++;

        }

        return $this;


    }

    /**
     * @param      $table
     * @param      $column
     * @param      $foreign
     * @param bool $outer
     * Sets data for inner join clause
     * @return $this
     */
    public function innerJoin($table, $column, $foreign, $outer = false) {

        if(!is_array($table)) {
            $table = [$table];
        }

        if(!is_array($column)) {
            $column = [$column];
        }

        if(!is_array($foreign)) {
            $foreign = [$foreign];
        }

        if(!(count($table) === count($column) && count($column) === count($foreign))) {
            // Create Error > Arrays does not contain equal number of items
        }

        $this->innerJoin = [
            "tables" => $table,
            "columns" => $column,
            "keys" => $foreign
        ];

        return $this;

    }

    /**
     * @param      $table
     * @param      $column
     * @param      $foreign
     * @param bool $outer
     * Sets data for left (outer) join clause
     * @return $this
     */
    public function leftJoin($table, $column, $foreign, $outer = false) {

        if(!is_array($table)) {
            $table = [$table];
        }

        if(!is_array($column)) {
            $column = [$column];
        }

        if(!is_array($foreign)) {
            $foreign = [$foreign];
        }

        if(!is_array($outer)) {
            $outer = [$outer];
        }

        if(!(count($table) === count($column) && count($column) === count($foreign) && count($foreign) === count($outer))) {
            // Create Error > Arrays does not contain equal number of items
        }

        $this->leftJoin = [
            "tables" => $table,
            "columns" => $column,
            "keys" => $foreign,
            "outer" => $outer
        ];

        return $this;

    }

    /**
     * @param      $table
     * @param      $column
     * @param      $foreign
     * @param bool $outer
     * Sets data for right (outer) join clause
     * @return $this
     */
    public function rightJoin($table, $column, $foreign, $outer = false) {

        if(!is_array($table)) {
            $table = [$table];
        }

        if(!is_array($column)) {
            $column = [$column];
        }

        if(!is_array($foreign)) {
            $foreign = [$foreign];
        }

        if(!is_array($outer)) {
            $outer = [$outer];
        }

        if(!(count($table) === count($column) && count($column) === count($foreign) && count($foreign) === count($outer))) {
            // Create Error > Arrays does not contain equal number of items
        }

        $this->rightJoin = [
            "tables" => $table,
            "columns" => $column,
            "keys" => $foreign,
            "outer" => $outer
        ];

        return $this;

    }

    /*
     * Ordering Commands
     */
    /**
     * @param string $column
     * @param bool   $asc
     * Sets data for results ordering
     * @return $this
     */
    public function orderBy(string $column, bool $asc = false) {

        $this->orderBy = [
            "column" => $column,
            "asc" => $asc
        ];

        return $this;

    }

    /**
     * @return $this
     * Sets results order to random
     * HINTS: http://stackoverflow.com/questions/1823306/mysql-alternatives-to-order-by-rand
     */
    public function orderRandom() {

        $this->orderRandom = true;
        return $this;

    }

    /*
     * Grouping Commands
     */
    /**
     * @param $column
     * Sets results grouping by given column
     * @return $this
     */
    public function groupBy(string $column) {

        $this->groupBy = $column;
        return $this;

    }

    /*
     * Insert Commands
     */
    /**
     * @param array $values
     * @param bool  $getID
     * Sets data for insert as new row
     * @return $this
     */
    public function insertRow(array $values, bool $getID = false) {

        $this->insert[] = $values;
        $this->getID = $getID;
        return $this;

    }

    /*
     * Update Commands
     */
    /**
     * @param array $values
     * Sets values for columns to update
     * @return $this
     */
    public function updateRow(array $values) {

        $this->update = $values;
        return $this;

    }

    /**
     * @param     $column
     * @param int $value
     * Increments value in given column
     * @return $this
     */
    public function increment(string $column, int $value = 1) {

        $this->increment = [
            "column" => $column,
            "value" => $value
        ];

        return $this;

    }

    /**
     * @param     $column
     * @param int $value
     * Decrements value in given column
     * @return $this
     */
    public function decrement(string $column, int $value = 1) {

        $this->decrement = [
            "column" => $column,
            "value" => $value
        ];

        return $this;

    }

}