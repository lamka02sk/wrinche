<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * URL Request Module. Manage HTTP request data from user.
 * Version: 0.3.4
 * Authors: lamka02sk
 */

namespace App\Requests;

use App\Helpers\Config;
use App\Helpers\Validator;

class UrlRequest {

    public static function init() {

        $data = $_GET['route'] ?? '';
        $data = strtolower($data);
        $data = explode('/', rtrim(trim($data), '/'));
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

        return $_SESSION['route'];

    }

    public function is(string $pattern) {

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

            return false;

        } else if($this->matchAlias($patternPart)) {
            // Example: {administration} - is translated to the administration route
            // Check route by alias

        } else if($this->matchInterval($patternPart)) {
            // Example: [0,500] - if parameter number is in this interval
            // In interval
            $interval = explode(",", str_replace(["[", "]"], "", $patternPart));
            $min = $interval[0];
            $max = $interval[1];
            $this->inInterval($min, $max, $part);

        } else if($this->matchNum($patternPart)) {
            // Example: [num] - if parameter is number
            // Is numeric
            return $validator->validateInteger($part);

        } else if($this->matchAlpha($patternPart)) {
            // Example: [alpha] - if parameter contains only letters
            // Is alpha
            return $validator->validateAlpha($part);

        } else if($this->matchANum($patternPart)) {
            // Example: [anum] - if parameter contains letters and numbers only
            // Is alphanumeric
            return $validator->validateANum($part);

        } else if($this->matchEmpty($patternPart)) {
            // Example: *** - if parameter contains anything = not empty
            // Is not empty
            return $validator->validateEmpty($part);

        }

        return false;

    }

    public function matchUrl(string $string) {

        if(preg_match('/([-a-zA-Z0-9@:%._+~#=])\w+/', $string))
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

        if($this->matchAlpha($string) && $this->matchNum($string))
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