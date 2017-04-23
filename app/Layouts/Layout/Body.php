<?php

require_once ROOT . '/app/Layouts/' . $layout . '/' . $page . '.php';

if(!App\Requests\Request::$ajax)
    require_once ROOT . '/app/Layouts/Layout/Scripts.php';