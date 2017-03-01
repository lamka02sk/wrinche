<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Main Router. Handle every request except installation.
 * Version: 0.2.0
 * Authors: lamka02sk
 */

namespace App\Routers;

use App\Helpers\Redirect;
use App\Requests\Request;
use App\Requests\UrlRequest;

class Router {

    public $changeAlias = '';
    public $aliasName = '';

    public $category;
    public $subcategory;

    public $request;
    public $urlRequest;

    public $url = [];
    public $routes = [];

    public $route = [
        'method' => '',
        'path' => ''
    ];

    public $routePrefix;

    public function __construct() {

        $this->url = Request::$url;
        $this->request = new Request;
        $this->urlRequest = new UrlRequest;

    }

    public function get($route) {

        $this->routes[] = [
            'method' => 'get',
            'route'  => $route
        ];

        return $this;

    }

    public function post($route) {

        $this->routes[] = [
            'method' => 'post',
            'route'  => $route
        ];

        return $this;

    }

    public function put($route) {

        $this->routes[] = [
            'method' => 'put',
            'route'  => $route
        ];

        return $this;

    }

    public function delete($route) {

        $this->routes[] = [
            'method' => 'delete',
            'route'  => $route
        ];

        return $this;

    }

    public function validateRoute($key, $method) {

        $route = $this->routePrefix . $this->routes[$key]['route'];
        if($this->request->isMethod($method) && $this->urlRequest->is($this, $route)) {

            if(!empty($this->changeAlias)) {

                $path = str_replace($this->aliasName, $this->changeAlias, $this->routes[$key]['route']);
                $this->route = [
                    'method' => $this->routes[$key]['method'],
                    'path' => $path
                ];

                return true;

            }

            $this->route = [
                'method' => $this->routes[$key]['method'],
                'path' => $this->routes[$key]['route']
            ];

            return true;

        }

        return false;

    }

    public function validateRoutes() {

        // Current route replaced with postponed one
        if(isset($_SESSION['route'])) {

            $this->route = [
                'method' => 'get',
                'path' => $_SESSION['route']
            ];

            return true;

        }

        unset($_SESSION['route']);

        foreach($this->routes as $key => $route) {
            if($this->validateRoute($key, $route['method']))
                return true;
        }

        return false;

    }

    public function done() {

        // Select valid route or 404 page
        if(!$this->validateRoutes())
            Redirect::response(404);

        return $this->route;

    }

}