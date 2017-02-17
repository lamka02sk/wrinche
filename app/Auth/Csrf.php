<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Cross-site request forgery protection authenticator.
 * Version: 1.0.1
 * Authors: lamka02sk
 */

namespace App\Auth;

use App\Helpers\Generator;
use App\Helpers\Redirect;

class Csrf {

    // Expiration time of the new token
    private $csrf_maxTime = (1 * 60 * 60); // Valid for: 1 hour

    /**
     * Csrf constructor.
     */
    public function __construct() {

        // Check if request is AJAX
        if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {

            // Save users token and verify
            $token = $_POST['csrf_token'];
            $this->verifyToken($token);

        } else
            $this->updateToken();

    }

    /**
     * Updates token expiration time
     */
    public function updateToken() {

        // Check if CSRF token already exists
        if(!isset($_SESSION['auth']['csrf_token'])) {

            // Generate new token
            $token = new Generator;
            $token = $token->generateCsrfToken();
            $_SESSION['auth']['csrf_token'] = $token;

        }

        // Update token expiration time
        $time = time();
        $expTime = $time + $this->csrf_maxTime;
        $_SESSION['auth']['csrf_exp'] = $expTime;

    }

    /**
     * @param $token
     * Verify existing token and expiration time
     * @return mixed
     */
    public function verifyToken($token) {

        // Check if token exist
        if(!isset($_SESSION['auth']['csrf_token']))
            Redirect::response(500);

        // Verify Time and Token
        if($token === $_SESSION['auth']['csrf_token']) {

            // Get current time and expiration time of current token
            $time = time();
            $expTime = $_SESSION['auth']['csrf_exp'];

            if($time < $expTime) {

                // Update token expiration time
                $this->updateToken();
                return true;

            } else {

                // Delete CSRF Token for safety reasons
                unset($_SESSION['auth']['csrf_token']);
                unset($_SESSION['auth']['csrf_exp']);

                // Redirect to error page
                Redirect::response(500);

            }

        } else
            Redirect::response(500);

    }

}