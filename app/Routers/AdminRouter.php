<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Administration Router. Handle every request in administration part.
 * Version: 0.1.4
 * Authors: lamka02sk
 */

namespace App\Routers;

use App\Helpers\Config;
use App\Controllers;
use App\Helpers\Redirect;
use App\Requests\UrlRequest;    // Used in navigate() method

class AdminRouter extends Router {

    private $authRoutes = [
        'login', 'register', 'reset-password', 'logout'
    ];

    public function __construct() {

        // Parse Route Parameter
        $this->routePrefix = Config::$file['system']['paths']['admin'] . '/';
        parent::__construct();

    }

    public function parseRoute() {

        // Category: Contains Controller Name and Template Name
        // Subcategory: Contains SubController Name and SubTemplate Name

        $components = explode('/', $this->route);
        $this->category = $components[0] ?? 'home';
        $this->subcategory = $components[1] ?? '';

        if(empty($this->category))
            $this->category = 'home';

    }

    public function navigate($route) {

        $this->route = $route['path'];
        $method = $route['method'];
        $this->parseRoute();
        $controller = new Controllers\Admin\AuthController($this->category, $this->subcategory);
        $checkLogin = $controller->checkLogin();

        // Auth Routes
        if(in_array($this->category, $this->authRoutes)) {

            if($checkLogin && $this->route === 'login')
                Redirect::route('home');

            $urlRequest = new UrlRequest;
            $urlRequest->changeRoute($this->category);
            $controller->{$method}();

            return true;

        }

        if(!$checkLogin)
            Redirect::route('login');

        // Call Category Controller
        $name = 'App\\Controllers\\Admin\\' . ucfirst($this->category) . 'Controller';
        $controller = new $name($this->subcategory);
        $controller->{$method}();

    }

}