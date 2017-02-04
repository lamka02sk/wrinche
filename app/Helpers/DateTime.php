<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Computes date and time in MySQL format.
 * Version: 0.1.4
 * Authors: lamka02sk
 */

namespace App\Helpers;

class DateTime {

    public $format = 'Y-m-d H:i:s';

    public function now() {

        return date($this->format);

    }

    public function sub($interval, $datetime = '') {

        if(empty($datetime))
            $datetime = $this->now();

        $time = strtotime('-' . $interval, strtotime($datetime));
        return date($this->format, $time);

    }

    public function add($interval, $datetime = '') {

        if(empty($datetime))
            $datetime = $this->now();

        $time = strtotime('+' . $interval, strtotime($datetime));
        return date($this->format, $time);

    }

}