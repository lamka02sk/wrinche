<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Cross-site request forgery protection module.
 * Version: 1.0
 * Authors: lamka02sk
 */

namespace App\Controllers;

abstract class MainController {

    public $language;

    /**
     * @all controllers must contain this function
     * @return mixed
     */
    abstract function start();

}