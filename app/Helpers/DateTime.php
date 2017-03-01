<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Computes date and time in MySQL format.
 * Version: 0.1.4
 * Authors: lamka02sk
 */

namespace App\Helpers;

class DateTime {

    /**
     * @var string
     * Default datetime format
     */
    public $format = 'Y-m-d H:i:s';

    /**
     * @param string $format
     * Change the result datetime format
     * @return bool
     */
    public function setFormat(string $format) {

        $this->format = $format;
        return true;

    }

    /**
     * @return false|string
     * Return current datetime
     */
    public function now() {

        return date($this->format);

    }

    /**
     * @param        $interval
     * @param string $datetime
     * Subtract interval from current datetime
     * @return false|string
     */
    public function sub($interval, $datetime = '') {

        if(empty($datetime))
            $datetime = $this->now();

        $time = strtotime('-' . $interval, strtotime($datetime));
        return date($this->format, $time);

    }

    /**
     * @param        $interval
     * @param string $datetime
     * Add interval to current time
     * @return false|string
     */
    public function add($interval, $datetime = '') {

        if(empty($datetime))
            $datetime = $this->now();

        $time = strtotime('+' . $interval, strtotime($datetime));
        return date($this->format, $time);

    }

}