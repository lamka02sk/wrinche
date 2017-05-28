<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * URL Request Module. Manage HTTP request data from user.
 * Version: 0.7.4
 * Authors: lamka02sk
 */

namespace App\Requests;

use App\Helpers\Config;
use App\Helpers\Validator;
use App\Routers\AliasRouter;
use App\Routers\Router;

class UrlRequest {

    public $router;
    public static $category;
    public static $subcategory;

    public static function init() {

        $data = $_GET['route'] ?? '';
        $data = strtolower($data);
        $data = explode('/', rtrim(trim($data), '/'));
        self::$category = $data[0] ?? null;
        self::$subcategory = $data[1] ?? null;
        Request::$url = $data;

    }

    public function changeRoute($route = '', $method = 'GET') {

        $prefix = '';
        if($this->isAdmin())
            $prefix = Request::$url[0] . '/';

        Request::$method = $method;

        $route = $prefix . $route;
        $_GET['route'] = $route;
        $data = explode('/', rtrim(trim($route), '/'));
        Request::$url = $data;

    }

    public function getUrl() {

        return implode('/', Request::$url);

    }

    public function isAdmin() {

        if(Config::$file['system']['paths']['admin'] === Request::$url[0])
            return true;

        return false;

    }

    public function saveRoute() {

        $_SESSION['route'] = Request::$url;
        return true;

    }

    public function removeRoute() {

        unset($_SESSION['route']);
        return true;

    }

    public function retrieveRoute() {

        return implode('/', Request::$url);

    }

    public function is(Router $router, string $pattern) {

        // Save router instance
        $this->router = $router;

        $pattern = explode('/', rtrim(trim($pattern), '/'));
        $current = Request::$url;

        if(sizeof($pattern) !== sizeof($current))
            return false;

        foreach($current as $key => $part) {

            if(!$this->matchAll($part, $pattern, $key))
                return false;

        }

        return true;

    }

    public function matchAll($part, $pattern, $key) {

        $validator = new Validator;

        // Create more functions also for validating urls.
        if(!isset($pattern[$key]))
            $patternPart = '';
        else
            $patternPart = $pattern[$key];

        if($this->matchUrl($patternPart)) {

            // Value given, check if equals
            if($patternPart === $part)
                return true;

        }

        if($this->matchSimpleUrl($patternPart)) {
            // Example: [simple-url] - is simple url
            // Check route url
            $this->router->changeAlias = $part;
            $this->router->aliasName = $patternPart;
            return $validator->validateSimpleUrl($part);

        }  else if($this->matchAlias($patternPart)) {
            // Example: {administration} - is translated to the administration route
            // Check route by alias
            $alias = new AliasRouter;
            return $alias->start($this->router, $patternPart, $part);

        } else if($this->matchInterval($patternPart)) {
            // Example: [0,500] - if parameter number is in this interval
            // In interval
            $interval = explode(",", str_replace(["[", "]"], "", $patternPart));
            $min = $interval[0];
            $max = $interval[1];
            $this->router->changeAlias = $part;
            $this->router->aliasName = $patternPart;
            return $this->inInterval($min, $max, $part);

        } else if($this->matchNum($patternPart)) {
            // Example: [num] - if parameter is number
            // Is numeric
            $this->router->changeAlias = $part;
            $this->router->aliasName = $patternPart;
            return $validator->validateInteger($part);

        } else if($this->matchAlpha($patternPart)) {
            // Example: [alpha] - if parameter contains only letters
            // Is alpha
            $this->router->changeAlias = $part;
            $this->router->aliasName = $patternPart;
            return $validator->validateAlpha($part);

        } else if($this->matchANum($patternPart)) {
            // Example: [anum] - if parameter contains letters and numbers only
            // Is alphanumeric
            $this->router->changeAlias = $part;
            $this->router->aliasName = $patternPart;
            return $validator->validateANum($part);

        } else if($this->matchEmpty($patternPart)) {
            // Example: *** - if parameter contains anything = not empty
            // Is not empty
            $this->router->changeAlias = $part;
            $this->router->aliasName = $patternPart;
            return $validator->validateEmpty($part);

        }

        return false;

    }

    public function matchUrl(string $string) {

        if(preg_match('/([-a-zA-Z0-9@:%._+~#=])\w+/', $string))
            return true;

        return false;

    }

    public function matchSimpleUrl(string $string) {

        if(preg_match('/\[(simple-url)\]/', $string))
            return true;

        return false;

    }

    public function matchAlias(string $string) {

        if(preg_match('/({[a-zA-Z0-9]+})/', $string))
            return true;

        return false;

    }

    public function matchInterval(string $string) {

        if(preg_match('/(\[[0-9],[0-9]+\])/', $string))
            return true;

        return false;

    }

    public function matchNum(string $string) {

        if(preg_match('/(\[[num]+\])/', $string))
            return true;

        return false;

    }

    public function matchAlpha(string $string) {

        if(preg_match('/(\[[alpha]+\])/', $string))
            return true;

        return false;

    }

    public function matchANum(string $string) {

        if(preg_match('/(\[[anum]+\])/', $string))
            return true;

        return false;

    }

    public function matchEmpty(string $string) {

        if($string === "*")
            return true;

        return false;

    }

    public function inInterval(int $min, int $max, string $string) {

        if($string >= $min && $string <= $max)
            return true;

        return false;

    }

}