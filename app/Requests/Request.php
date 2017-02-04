<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Request Module. Manage HTTP request data from user.
 * Version: 0.1.1
 * Authors: lamka02sk
 */

namespace App\Requests;

class Request {

    public static $forms = [];
    public static $url = [];
    public static $method = [];
    public static $server = [];
    public static $cookie = [];
    public static $files = [];
    public static $ajax = false;

    public static function init() {

        ServerRequest::init();
        UrlRequest::init();
        CookieRequest::init();
        self::$method = self::$server['client']['method'];

        switch(self::$method) {
            case 'POST':
            case 'DELETE':
            case 'PUT':
                FormRequest::init();
                FileRequest::init();
                break;
        }

        if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
            self::$ajax = true;

    }

    public function getMethod() {

        return self::$method;

    }

    public function isMethod(string $method) {

        if(strtoupper($method) === self::$method)
            return true;

        return false;

    }

}