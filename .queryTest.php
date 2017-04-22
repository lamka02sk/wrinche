<?php

error_reporting(E_ALL);
ini_set("display_errors", true);

require_once "app/autoload.php";

$builder = new \App\Database\QueryBuilder();
$builder->queryCommands
    ->table('table')
    ->select()
    ->min('column2')
    ->max('column1')
    ->average('column4')
    ->count()
    ->sum('column6')
    ->selectValues()
    ->distinct()
    ->where(['column1', 'column2', 'column3'], ['<', '>=', '='], [5, 12, 'value'])
    ->whereBetween('columnName', 1, 15)
    ->whereIn('column4', [1, 2, 5, 8, 14, 12])
    ->whereNull('column6', true)
    ->join('inner', 'table4', 'table_id', 'id')
    ->rightJoin('table3', 'table_id', 'id')
    ->orWhere('column3', 'value')
    ->leftJoin('table2', 'table_id', 'id', true)
    ->limit(10)
    ->first()
    ->offset(20)
    ->having('SUM(column1)', 'value')
    ->orderBy('column5')
    ->groupBy("column2")
    ->exec();   // OK

echo "<br><br>";

var_dump($builder->queryBinds);

echo "<br><br>";

$builder = new \App\Database\QueryBuilder();

$builder->queryCommands
    ->table('table')
    ->insert()
    ->rightJoin('table3', 'table_id', 'id')
    ->insertRow([
        ['column1' => 'value', 'column2' => 'value'],
        ['column2' => 'value']
    ])
    ->exec();   // OK

echo "<br><br>";

var_dump($builder->queryBinds);

echo "<br><br>";

$builder = new \App\Database\QueryBuilder();

$builder->queryCommands
    ->table('table')
    ->update()
    ->leftJoin('table3', 'table_id', 'id', true)
    ->updateRow(['column2' => 'value', 'column3' => 'value'])
    ->whereBetween('column1', 10, 50, false)
    ->exec();   // OK

echo "<br><br>";

var_dump($builder->queryBinds);

echo "<br><br>";

$builder = new \App\Database\QueryBuilder();

$builder->queryCommands
    ->table('table')
    ->delete()
    ->where('column1', 'value')
    ->exec();

echo "<br><br>";

var_dump($builder->queryBinds);

echo "<br><br>";

$builder = new \App\Database\QueryBuilder();

$builder->queryCommands
    ->table('table')
    ->truncate()
    ->exec();

echo "<br><br>";

var_dump($builder->queryBinds);