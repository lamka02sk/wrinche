<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Redirect user to error, information or external website.
 * Version: 1.1.2
 * Authors: lamka02sk
 */

namespace App\Helpers;

use App\Layouts\Errors\Error;
use App\Requests\Request;
use App\Requests\UrlRequest;

class Redirect {

    /**
     * @var array
     * List of available HTTP/1.1 code + some custom codes.
     */
    private static $codes = [
        100 => 'Continue',
        101 => 'Switching Protocols',
        102 => 'Processing',
        200 => 'OK',
        201 => 'Created',
        202 => 'Accepted',
        203 => 'Non-Authoritative Information',
        204 => 'No Content',
        205 => 'Reset Content',
        206 => 'Partial Content',
        207 => 'Multi-Status',
        208 => 'Already Reported',
        226 => 'IM Used',
        300 => 'Multiple Choices',
        301 => 'Moved Permanently',
        302 => 'Found',
        303 => 'See Other',
        304 => 'Not Modified',
        305 => 'Use Proxy',
        306 => 'Switch Proxy',
        307 => 'Temporary Redirect',
        308 => 'Permanent Redirect',
        400 => 'Bad Request',
        401 => 'Unauthorized',
        402 => 'Payment Required',
        403 => 'Forbidden',
        404 => 'Not Found',
        405 => 'Method Not Allowed',
        406 => 'Not Acceptable',
        407 => 'Proxy Authentication Required',
        408 => 'Request Time-out',
        409 => 'Conflict',
        410 => 'Gone',
        411 => 'Length Required',
        412 => 'Precondition Failed',
        413 => 'Payload Too Large',
        414 => 'URI Too Long',
        415 => 'Unsupported Media Type',
        416 => 'Range Not Satisfiable',
        417 => 'Expectation Failed',
        418 => 'I\'m a teapot',
        421 => 'Misdirect Request',
        422 => 'Unprocessable Entity',
        423 => 'Locked',
        424 => 'Failed Dependency',
        426 => 'Upgrade Required',
        428 => 'Precondition Required',
        429 => 'Too Many Requests',
        431 => 'Request Header Fields Too Large',
        440 => 'Login Time-out',
        451 => 'Unavailable For Legal Reasons',
        498 => 'Invalid Token',
        499 => 'Token Required',
        500 => 'Internal Server Error',
        501 => 'Not Implemented',
        502 => 'Bad Gateway',
        503 => 'Service Unavailable',
        504 => 'Gateway Time-out',
        505 => 'HTTP Version Not Supported',
        506 => 'Variant Also Negotiates',
        507 => 'Insufficient Storage',
        508 => 'Loop Detected',
        509 => 'Bandwidth Limit Exceeded',
        510 => 'Not Extended',
        511 => 'Network Authentication Required',
        520 => 'Unknown Error'
    ];

    /**
     * @param string $route
     * Redirect to custom route
     * @param string $method
     * @return bool
     */
    public static function route($route = '', $method = 'GET') {

        // Change URL request
        $urlRequest = new UrlRequest;
        $urlRequest->changeRoute($route, $method);

        require ROOT . '/app/router.php';
        exit;

    }

    /**
     * @param int  $code
     * @param bool $success
     * Send headers with response code
     */
    public static function response(int $code, bool $success = false) {

        if(Request::$ajax) {

            echo json_encode([
                'success' => $success,
                'code' => $code
            ]);
            exit;

        }

        if(!in_array($code, array_keys(self::$codes)))
            $code = 404;

        header('HTTP/1.1 ' . $code . ' ' . self::$codes[$code]);
        new Error($code);
        exit;

    }

    public static function redirect(string $route) {

        // Change URL request
        $urlRequest = new UrlRequest;
        $urlRequest->changeRoute($route, 'GET');

        // Get route
        $route = $urlRequest->retrieveRoute();

        // Redirect headers
        header('HTTP/1.1 200 OK');
        header('Location: ?route=' . $route);

        return true;

    }

}