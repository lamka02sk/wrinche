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

    private $requests;
    const MAX = 10; // Requests
    const TIME = 120; // Seconds

    public function __construct() {

        $this->requests = $_SESSION['requests'] ?? [];
        $this->checkUser();

    }

    private function checkUser() {

        $i = 0;
        $count = 0;
        $ms = self::TIME;
        $max = sizeof($this->requests);

        while($i < $max) {
            if((microtime(true) - $this->requests[$i]) < $ms) ++$count;
            else unset($this->requests[$i]);
            ++$i;
        }

        $this->requests[] = microtime(true);
        $this->requests = array_values($this->requests);
        $_SESSION['requests'] = $this->requests;

        if($count > self::MAX) Redirect::response(429);

    }

}