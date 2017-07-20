<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Handles errors coming from users' actions
 * Version: 0.1
 * Authors: lamka02sk
 */

namespace App\Errors;

use App\Logs\LogEvents;
use App\Requests\Request;

class UserEvents {

    /**
     * @var array
     * List of error/event codes
     */
    public $errCodes = [

        // Errors
        0 => 'Undefined',
        1 => 'Invalid Login',
        2 => 'Login Attempts',
        3 => 'Invalid Login',
        4 => 'Invalid Input',
        5 => 'Empty data',
        6 => 'User does not exist',
        7 => 'User with given email or username already exists',
        8 => 'Hash does not exists',
        9 => 'New password equals to old password',
        10 => 'Inactive account',
        11 => 'Function undefined',
        12 => 'Input with the same values already exists.',
        13 => 'Category does not exist',
        14 => 'Post type does not exists',

        20 => 'Unsupported image format',
        21 => 'Invalid image',

        30 => 'Unsupported video format',

        40 => 'Unsupported audio format',

        50 => 'Unsupported file format'

    ];

    /**
     * @var int
     * Current code
     */
    public $code;

    /**
     * @var string
     * Current code message
     */
    public $message;

    /**
     * @var string
     * Response string (JSON if AJAX or redirect if not)
     */
    public $response;

    /**
     * @var bool
     * Request success: false
     */
    public $success;

    /**
     * @var int
     * Information about logging
     */
    public $log;

    /**
     * @var string
     * Message to write to log file
     */
    public $logMessage;

    /**
     * @var bool
     * Terminate script after event
     */
    public $terminate;

    /**
     * @param int  $errCode
     * @param int  $log         0 - default, 1 - log, -1 - don't log
     * @param bool $terminate   true - default, false
     */
    public function __construct(int $errCode = 0, int $log = 0, bool $terminate = true) {

        $this->code = $errCode;
        $this->log = $log;
        $this->terminate = $terminate;

        $this->createResponse();
        $this->logEvent();

        if($terminate) exit;

    }

    /**
     * Create event response
     */
    public function createResponse() {

        $this->message = $this->errCodes[$this->code];
        $this->success = false;

        $this->createLogMessage();
        $this->createReturn();

    }

    /**
     * Create log message
     */
    public function createLogMessage() {

        $time = date('Y-m-d H:m:s') . " --------------------------------------------------\n";
        $content = 'ERROR: ' . $this->message . "\n";
        $end = "----------------------------------------------------------------------\n";

        $this->logMessage = $time . $content . $end;

    }

    /**
     * Call response
     */
    public function createReturn() {

        $this->response = [
            'success' => $this->success,
            'code' => $this->code
        ];

        $this->sendResponse();

    }

    /**
     * @return bool
     * Send the event response
     */
    public function sendResponse() {

        header("HTTP/1.1 200 OK");
        if(Request::$ajax) {
            echo json_encode($this->response);
            return true;
        }

        echo '200 OK (Error Event)<br>' . $this->message;

    }

    /**
     * Log event in log file
     */
    public function logEvent() {

        new LogEvents($this->logMessage, $this->log);

    }

}