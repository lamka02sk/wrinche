<?php

namespace App\Controllers;

use App\Helpers\Redirect;
use App\Requests\Request;

class ApiController extends MainController {

    public $endpoint;

    const ENDPOINTS = [
        'system' => [
            'log' => [
                'retrieve' => [
                    'performance' => true,
                    'errors' => true,
                    'events' => true
                ],
                'clear' => [
                    'performance' => true,
                    'errors' => true,
                    'events' => true
                ]
            ],
            'auth' => [
                'refresh' => [
                    'token' => true,
                    'login' => true
                ],
                'check' => [
                    'token' => true,
                    'login' => true
                ],
                'logout' => true,
                'login' => true,
                'register' => true,
                'reset' => [
                    'sessions' => true,
                    'password' => true
                ]
            ],
            'get' => [
                'timezones' => true,
                'languages' => true
            ],
            'info' => [
                'name' => true,
                'description' => true,
                'version' => true,
                'domain' => true,
                'charset' => true,
                'maintenance' => true,
                'debug' => true,
                'timezone' => true,
                'language' => true,
                'installed' => true,
                'php' => true,
                'database' => true,
                'email' => true
            ],
            'check' => [
                'integrity' => [
                    'components' => true
                ]
            ]
        ],
        'categories' => [
            'all' => true
        ]
    ];

    public function start() {}

    public function __construct($endpoint) {

        $this->endpoint = $endpoint;
        $this->handleRequest();
        return true;

    }

    public function handleRequest() {

        $endpoint = explode('.', $this->endpoint);

        $list = self::ENDPOINTS;
        foreach($endpoint as $item) {
            if(isset($list[$item]))
                $list = $list[$item];
            else
                Redirect::response(404);
        }

        if($list === true) {

            $class = 'App\Api\Endpoints\\' . ucfirst($endpoint[0]);
            $params = array_slice($endpoint, 1);
            $params = implode('.', $params);
            $instance = new $class($params);
            header('HTTP/1.1 200 OK');
            header('Content-Type: application/json');
            echo $instance->outputJson;

        } else
            Redirect::response(404);

    }

}