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

    public $errCodes = [

        // Errors
        0 => 'Undefined',
        1 => 'Invalid Login',
        2 => 'Login Attempts',
        3 => 'Invalid Login',
        4 => 'Invalid Input',
        5 => 'Empty data'

    ];

    public $code;
    public $message;
    public $response;
    public $success;
    public $log;
    public $logMessage;
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

    public function createResponse() {

        $this->message = $this->errCodes[$this->code];
        $this->success = false;

        $this->createLogMessage();
        $this->createReturn();

    }

    public function createLogMessage() {

        $time = date('Y-m-d H:m:s') . " --------------------------------------------------\n";
        $content = 'ERROR: ' . $this->message . "\n";
        $end = "----------------------------------------------------------------------\n";

        $this->logMessage = $time . $content . $end;

    }

    public function createReturn() {

        $this->response = [
            'success' => $this->success,
            'code' => $this->code
        ];

        $this->sendResponse();

    }

    public function sendResponse() {

        header("HTTP/1.1 520 Unknown Error");

        if(Request::$ajax) {
            echo json_encode($this->response);
            return true;
        }

        echo '520 Unknown Error (Error Event)<br>' . $this->message;

    }

    public function logEvent() {

        new LogEvents($this->logMessage, $this->log);

    }

}