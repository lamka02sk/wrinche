<?php

/* wrinche. Modern, powerful and user friendly CMS. */

namespace App\Controllers;

class StatsController extends MainController {

    public $rawData;
    public $parsedData = [
        'client' => [
            'port' => '',
            'ua' => '',
            'headers' => '',
            'language' => '',
            'encoding' => '',
            'dnt' => '',
            'cookie' => '',
            'connection' => '',
            'upgrade_insecure' => '',
            'pragma' => '',
            'cache' => '',
            'ip' => '',
            'protocol' => '',
            'method' => '',
            'query' => '',
            'uri' => '',
            'time' => ''
        ],
        'server' => [
            'host' => '',
            'port' => '',
            'path' => '',
            'signature' => '',
            'software' => '',
            'name' => '',
            'address' => '',
            'root' => '',
            'request_scheme' => '',
            'prefix' => '',
            'admin' => '',
            'script' => '',
            'gateway' => ''
        ]
    ];

    /**
     * StatsController constructor.
     * Save and parse raw $_SERVER data.
     */
    public function __construct() {

        $this->rawData = $_SERVER;
        $this->parseRaw();

    }

    /**
     * Parse raw $_SERVER data from variable.
     */
    public function parseRaw() {

        $this->parsedData = [
            'client' => [
                'port' => $this->rawData['REMOTE_PORT'] ?? '80',
                'ua' => $this->rawData['HTTP_USER_AGENT'] ?? null,
                'headers' => $this->rawData['HTTP_ACCEPT'] ?? 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'language' => $this->rawData['HTTP_ACCEPT_LANGUAGE'] ?? 'en-US, en;q=0.5',
                'encoding' => $this->rawData['HTTP_ACCEPT_ENCODING'] ?? 'gzip, deflate',
                'dnt' => $this->rawData['HTTP_DNT'] ?? '0',
                'cookie' => $this->rawData['HTTP_COOKIE'] ?? null,
                'connection' => $this->rawData['HTTP_CONNECTION'] ?? 'keep-alive',
                'upgrade_insecure' => $this->rawData['HTTP_UPGRADE_INSECURE_REQUESTS'] ?? '1',
                'pragma' => $this->rawData['HTTP_PRAGMA'] ?? '',
                'cache' => $this->rawData['HTTP_CACHE_CONTROL'] ?? 'max-age=0',
                'ip' => $this->rawData['REMOTE_ADDR'] ?? null,
                'protocol' => $this->rawData['SERVER_PROTOCOL'] ?? 'HTTP/1.1',
                'method' => $this->rawData['REQUEST_METHOD'] ?? 'GET',
                'query' => $this->rawData['QUERY_STRING'] ?? '',
                'uri' => $this->rawData['REQUEST_URI'] ?? '/',
                'time' => $this->rawData['REQUEST_TIME_FLOAT'] ?? microtime(true)
            ],
            'server' => [
                'host' => $this->rawData['HTTP_HOST'] ?? 'localhost',
                'port' => $this->rawData['SERVER_PORT'] ?? '80',
                'path' => $this->rawData['PATH'] ?? '',
                'signature' => $this->rawData['SERVER_SIGNATURE'] ?? null,
                'software' => $this->rawData['SERVER_SOFTWARE'] ?? null,
                'name' => $this->rawData['SERVER_NAME'] ?? 'localhost',
                'address' => $this->rawData['SERVER_ADDR'] ?? '127.0.0.1',
                'root' => $this->rawData['DOCUMENT_ROOT'] ?? '/',
                'request_scheme' => $this->rawData['REQUEST_SCHEME'] ?? 'http',
                'prefix' => $this->rawData['CONTEXT_PREFIX'] ?? '',
                'admin' => $this->rawData['SERVER_ADMIN'] ?? null,
                'script' => $this->rawData['SCRIPT_NAME'] ?? 'index.php',
                'gateway' => $this->rawData['GATEWAY_INTERFACE'] ?? 'CGI/1.1'
            ]
        ];

    }

    /**
     * Execute actual tracking and save tracking data.
     */
    public function start() {

        // Track all stats and save data

        // Temporary
        /*echo '<br>';
        echo "Execution time: " . round((- $this->rawData['REQUEST_TIME_FLOAT'] + microtime(true)) * 1000, 4) . ' ms';

        echo '<br>';
        echo 'Memory in use: ' . round(((memory_get_usage() / 1024) / 1024), 4) .'MB';*/

    }

}