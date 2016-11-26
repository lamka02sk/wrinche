<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Server Request Module. Manage HTTP request data from user.
 * Version: 0.1.1
 * Authors: lamka02sk
 */

namespace App\Requests;

class ServerRequest {

    public static function init() {

        $data = $_SERVER;

        // Save all $_SERVER data
        Request::$server = [
            'client' => [
                'port' => $data['REMOTE_PORT'] ?? '80',
                'ua' => $data['HTTP_USER_AGENT'] ?? null,
                'headers' => $data['HTTP_ACCEPT'] ?? 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'language' => $data['HTTP_ACCEPT_LANGUAGE'] ?? 'en-US, en;q=0.5',
                'encoding' => $data['HTTP_ACCEPT_ENCODING'] ?? 'gzip, deflate',
                'dnt' => $data['HTTP_DNT'] ?? '0',
                'cookie' => $data['HTTP_COOKIE'] ?? null,
                'connection' => $data['HTTP_CONNECTION'] ?? 'keep-alive',
                'upgrade_insecure' => $data['HTTP_UPGRADE_INSECURE_REQUESTS'] ?? '1',
                'pragma' => $data['HTTP_PRAGMA'] ?? '',
                'cache' => $data['HTTP_CACHE_CONTROL'] ?? 'max-age=0',
                'ip' => $data['REMOTE_ADDR'] ?? null,
                'protocol' => $data['SERVER_PROTOCOL'] ?? 'HTTP/1.1',
                'method' => $data['REQUEST_METHOD'] ?? 'GET',
                'query' => $data['QUERY_STRING'] ?? '',
                'uri' => $data['REQUEST_URI'] ?? '/',
                'time' => $data['REQUEST_TIME_FLOAT'] ?? microtime(true)
            ],
            'server' => [
                'host' => $data['HTTP_HOST'] ?? 'localhost',
                'port' => $data['SERVER_PORT'] ?? '80',
                'path' => $data['PATH'] ?? '',
                'signature' => $data['SERVER_SIGNATURE'] ?? null,
                'software' => $data['SERVER_SOFTWARE'] ?? null,
                'name' => $data['SERVER_NAME'] ?? 'localhost',
                'address' => $data['SERVER_ADDR'] ?? '127.0.0.1',
                'root' => $data['DOCUMENT_ROOT'] ?? '/',
                'request_scheme' => $data['REQUEST_SCHEME'] ?? 'http',
                'prefix' => $data['CONTEXT_PREFIX'] ?? '',
                'admin' => $data['SERVER_ADMIN'] ?? null,
                'script' => $data['SCRIPT_NAME'] ?? 'index.php',
                'gateway' => $data['GATEWAY_INTERFACE'] ?? 'CGI/1.1'
            ]
        ];

    }

    public function all() {

        return Request::$server;

    }

    public function getClient(string $item = "") {

        if(empty($item)) {
            return Request::$server['client'] ?? '';
        }
        return Request::$server['client'][$item] ?? '';

    }

    public function getServer(string $item = "") {

        if(empty($item)) {
            return Request::$server['server'] ?? '';
        }
        return Request::$server['server'][$item] ?? '';

    }

    public function insertClient(string $item, string $value) {

        Request::$server['client'][$item] = $value;
        $_SERVER[$item] = $value;
        return true;

    }

    public function insertServer(string $item, string $value) {

        Request::$server['server'][$item] = $value;
        $_SERVER[$item] = $value;
        return true;

    }

    public function removeClient(string $item = "") {

        if(empty($item)) {
            unset(Request::$server['client']);
            return true;
        }

        unset(Request::$server['client'][$item]);
        unset($_SERVER[$item]);
        return true;

    }

    public function removeServer(string $item = "") {

        if(empty($item)) {
            unset(Request::$server['server']);
            return true;
        }

        unset(Request::$server['server'][$item]);
        unset($_SERVER[$item]);
        return true;

    }

}