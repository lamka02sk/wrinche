<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Validate user inputs to protect system from attackers.
 * Version: 0.9
 * Authors: lamka02sk
 */

namespace App\Helpers;

class Validator {

    /**
     * @param $string
     * @param $filter
     * @return bool
     * Validate string with any built-in filter.
     */
    private function filterValidate($string, $filter) {

        $valid = true;
        if(!filter_var($string, $filter)) {
            $valid = false;
        }

        return $valid;

    }

    /**
     * @param $string
     * @param $min integer Minimum $string length.
     * @param $max integer Maximum $string length.
     * @return bool
     * Validate custom string length.
     */
    public function validateStringLength($string, $min, $max) {

        $valid = true;
        $length = strlen(trim($string));
        if($length < $min || $length > $max) {
            $valid = false;
        }

        return $valid;

    }

    /*
     * Installation forms
     */

    /**
     * @param $username
     * @return bool
     * Validate username.
     */
    public function validateUsername($username) {

        $valid = true;
        if(!$this->validateStringLength($username, 4, 25)) {
            $valid = false;
        }

        $regex = '/^([a-zA-Z0-9]+)$/';
        if(!preg_match($regex, $username)) {
            $valid = false;
        }

        return $valid;

    }

    /**
     * @param $email
     * @return bool
     * Validate email.
     */
    public function validateEmail($email) {

        return $this->filterValidate($email, FILTER_VALIDATE_EMAIL);


    }

    /**
     * @param $password
     * @return bool
     * Validate password.
     */
    public function validatePassword($password) {

        $valid = true;
        if(!$this->validateStringLength($password, 8, 45) || !preg_match('/[0-9]/', $password)) {
            $valid = false;
        }

        return $valid;

    }

    /**
     * @param $string
     * @return bool
     * Check if string is empty.
     */
    public function validateEmpty($string) {

        $valid = true;
        if(empty($string) || empty(trim($string))) {
            $valid = false;
        }

        return $valid;

    }

    /**
     * @param $string
     * @return bool
     * Validate website name length.
     */
    public function validateWebsiteName($string) {

        $min = 1;
        $max = 45;

        return $this->validateStringLength($string, $min, $max);

    }

    /**
     * @param $string
     * @return bool
     * Validate website description length.
     */
    public function validateWebsiteDescription($string) {

        $min = 6;
        $max = 120;

        return $this->validateStringLength($string, $min, $max);

    }

    /*
     * Validate variables and data types
     */

    /**
     * @param $boolean
     * @return bool
     * Validate boolean.
     */
    public function validateBoolean($boolean) {

        return $this->filterValidate($boolean, FILTER_VALIDATE_BOOLEAN);

    }

    /**
     * @param $float
     * @return bool
     * Validate boolean.
     */
    public function validateFloat($float) {

        return $this->filterValidate($float, FILTER_VALIDATE_FLOAT);

    }

    /**
     * @param $integer
     * @return bool
     * Validate boolean.
     */
    public function validateInteger($integer) {

        return $this->filterValidate($integer, FILTER_VALIDATE_INT);

    }

    /**
     * @param $ip
     * @return bool
     * Validate boolean.
     */
    public function validateIP($ip) {

        return $this->filterValidate($ip, FILTER_VALIDATE_IP);

    }

    /**
     * @param $mac
     * @return bool
     * Validate boolean.
     */
    public function validateMAC($mac) {

        return $this->filterValidate($mac, FILTER_VALIDATE_MAC);

    }

    /**
     * @param $regexp
     * @return bool
     * Validate boolean.
     */
    public function validateRegexp($regexp) {

        return $this->filterValidate($regexp, FILTER_VALIDATE_REGEXP);

    }

    /**
     * @param $url
     * @return bool
     * Validate boolean.
     */
    public function validateUrl($url) {

        return $this->filterValidate($url, FILTER_VALIDATE_URL);

    }

}