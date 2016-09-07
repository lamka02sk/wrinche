<?php

/* wrinche. Modern, powerful and user friendly CMS. */

namespace App\Controllers;

abstract class MainController {

    public $language;

    /**
     * @all controllers must contain this function
     * @return mixed
     */
    abstract function start();

}