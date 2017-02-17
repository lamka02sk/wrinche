<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Protects system against DDoS attacks.
 * Version: 1.0.2
 * Authors: lamka02sk
 */

namespace App\Auth;

use App\Helpers\Redirect;

class DDoS {

    /**
     * @var array
     * Past user requests
     */
    private $requests;

    /**
     * Maximum number of request per time
     */
    const MAX = 10; // Requests

    /**
     * Request expires in...
     */
    const TIME = 120; // Seconds

    /**
     * DDoS constructor.
     */
    public function __construct() {

        $this->requests = $_SESSION['requests'] ?? [];
        $this->checkUser();

    }

    /**
     * Check user for DDoS activity
     */
    private function checkUser() {

        $i = 0;
        $count = 0;
        $ms = self::TIME;
        $max = sizeof($this->requests);

        // Count requests in time interval, unset old requests
        while($i < $max) {
            if((microtime(true) - $this->requests[$i]) < $ms) ++$count;
            else unset($this->requests[$i]);
            ++$i;
        }

        // Save requests
        $this->requests[] = microtime(true);
        $this->requests = array_values($this->requests);
        $_SESSION['requests'] = $this->requests;

        // Redirect is suspicious activity found
        if($count > self::MAX) Redirect::response(429);

    }

}