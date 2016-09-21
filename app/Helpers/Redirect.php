<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Redirect user to error, information or external website.
 * Version: 0.0.3
 * Authors: lamka02sk
 */

namespace App\Helpers;

class Redirect {

    /**
     * Show Error 500: Internal Server Error
     */
    public static function error500() {

        // Redirect to error page
        header('HTTP/1.1 500 Internal Server Error');
        require ROOT . '/app/Layouts/Errors/500.php';

        exit;

    }

}