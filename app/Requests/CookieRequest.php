<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Cookie Request Module. Manage HTTP request data from user.
 * Version: 0.1.4
 * Authors: lamka02sk
 */

namespace App\Requests;

use App\Helpers\Config;

class CookieRequest {

    public static function init() {

        $data = $_COOKIE ?? [];
        Request::$cookie = $data;

    }

    public function all() {

        return Request::$cookie;

    }

    public function getCookie(string $name, string $default = "") {

        return Request::$cookie[$name] ?? $default;

    }

    public function setCookie(string $name, string $value = "", int $expire = 60, string $path = "", string $domain = "", bool $secure = false, bool $httpOnly = false) {

        if(isset(Request::$cookie[$name]))
            return false;

        setcookie($name, $value, $expire, $path, $domain, $secure, $httpOnly);
        Request::$cookie[$name] = $value;
        return true;

    }

    public function deleteCookie(string $name) {

        if(!isset(Request::$cookie[$name]))
            return false;

        unset($_COOKIE[$name]);
        unset(Request::$cookie[$name]);

    }

    public function updateCookie(string $name, string $value = "", int $expire = 0, string $path = "", string $domain = "", bool $secure = false, bool $httpOnly = false) {

        $this->deleteCookie($name);
        $this->setCookie($name, $value, $expire, $path, $domain, $secure, $httpOnly);
        return true;

    }

}