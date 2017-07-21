<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Validate user inputs to protect system from attackers.
 * Version: 1.1.0
 * Authors: lamka02sk
 */

namespace App\Helpers;

use \DateTime;

class Validator {

    /**
     * @param $string
     * @param $filter
     * @return bool
     * Validate string with any built-in filter.
     */
    private function filterValidate($string, $filter) {
        return (filter_var($string, $filter));
    }

    /**
     * @param $string
     * @param $min integer Minimum $string length.
     * @param $max integer Maximum $string length.
     * @return bool
     * Validate custom string length.
     */
    public function validateStringLength($string, $min, $max) {
        $length = strlen(trim($string));
        return (!($length < $min || $length > $max));
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

        if(!$this->validateStringLength($username, 4, 25))
            return false;

        $regex = '/^([a-zA-Z0-9]+)$/';
        return (preg_match($regex, $username));

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
        return ($this->validateStringLength($password, 8, 45) || !preg_match('/[0-9]/', $password));
    }

    /**
     * @param $string
     * @return bool
     * Check if string is empty.
     */
    public function validateEmpty($string) {

        if(empty($string) || empty(trim($string)))
            return false;

        return true;

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
     * Validate flaot.
     */
    public function validateFloat($float) {

        return $this->filterValidate($float, FILTER_VALIDATE_FLOAT);

    }

    /**
     * @param $integer
     * @return bool
     * Validate integer.
     */
    public function validateInteger($integer) {

        return $this->filterValidate($integer, FILTER_VALIDATE_INT);

    }

    /**
     * @param $ip
     * @return bool
     * Validate IP address.
     */
    public function validateIP($ip) {

        return $this->filterValidate($ip, FILTER_VALIDATE_IP);

    }

    /**
     * @param $mac
     * @return bool
     * Validate MAC address.
     */
    public function validateMAC($mac) {

        return $this->filterValidate($mac, FILTER_VALIDATE_MAC);

    }

    /**
     * @param $regexp
     * @return bool
     * Validate regular expression.
     */
    public function validateRegexp($regexp) {

        return $this->filterValidate($regexp, FILTER_VALIDATE_REGEXP);

    }

    /**
     * @param $url
     * @return bool
     * Validate URL.
     */
    public function validateUrl($url) {

        return $this->filterValidate($url, FILTER_VALIDATE_URL);

    }

    /**
     * @param $url
     * @return bool
     * Validate simple URL.
     */
    public function validateSimpleUrl($url) {

        if(preg_match('/^[a-z]{1}[a-z0-9\-]*[^\-]$/', $url))
            return true;

        return false;

    }

    /**
     * @param string $string
     * Validate alphabetic string, without diacritic.
     * @return bool
     */
    public function validateAlpha(string $string) {

        if(preg_match('/([a-zA-Z])\w+/g', $string))
            return true;

        return false;

    }

    /**
     * @param mixed $string
     * Validate alphanumeric string, without diacritic.
     * @return bool
     */
    public function validateANum($string) {

        if(preg_match('/([a-zA-Z0-9])\w+/', $string))
            return true;

        return false;

    }

    /**
     * @param string $primary
     * @param string $password
     * Validate login data
     * @param string $primaryType
     * @return bool
     */
    public function validateLogin(string $primary, string $password, string $primaryType = 'Username') {

        if(!$this->{'validate' . $primaryType}($primary) || !$this->validatePassword($password))
            return false;

        return true;

    }

    /**
     * @param string $username
     * @param string $email
     * @param string $password
     * @param string $passwordRepeat
     * Validate registration data
     * @return bool
     */
    public function validateRegister(string $username, string $email, string $password, string $passwordRepeat) {

        if(!$this->validateUsername($username) || !$this->validateEmail($email))
            return false;

        if(!$this->validatePassword($password) || !$this->validatePassword($passwordRepeat))
            return false;

        if($password !== $passwordRepeat)
            return false;

        return true;

    }

    /**
     * @param string $tag
     * Validate tag name
     * @return bool
     */
    public function validateTagName(string $tag) {

        if(!preg_match('/^[a-zA-Z]([a-zA-Z0-9_\s,]+)?[a-zA-Z0-9]$/', $tag))
            return false;

        return true;

    }

    /**
     * @param string $hashtag
     * Validate hashtag name
     * @return bool
     */
    public function validateHashtagName(string $hashtag) {

        if(!preg_match('/^[#][a-zA-Z][a-zA-Z0-9_]+[a-zA-Z0-9]$/', $hashtag))
            return false;

        return true;

    }

    public function isPastDate(string $time) {

        if($time === 'false') return true;
        $timestamp = DateTime::createFromFormat('d.m.Y h:i', $time . ' 0:00')->getTimestamp();
        $now = (new DateTime)->getTimestamp();
        return ($now > $timestamp);

    }

    /**
     * @param string $time
     * Validate past time
     * @return bool
     */
    public function isPastTimeStamp(string $time) {

        if($time === 'false') return true;
        $timestamp = DateTime::createFromFormat('d.m.Y h:i:s', $time)->getTimestamp();
        $now = (new DateTime)->getTimestamp();
        return ($now > $timestamp);

    }

    /**
     * @param string $time
     * Validate future time
     * @return bool
     */
    public function isFutureTimeStamp(string $time) {

        if($time === 'false') return true;
        $timestamp = DateTime::createFromFormat('d.m.Y h:i:s', $time)->getTimestamp();
        $now = (new DateTime)->getTimestamp();
        return ($now <= $timestamp);

    }

    /**
     * @param string $link
     * Validate image URI
     * @return bool
     */
    public function isImage(string $link) {

        $size = getimagesize($link);
        return (strtolower(substr($size['mime'], 0, 5)) == 'image' ? true : false);

    }

    /**
     * @param string $path
     * Validate YouTube video URI
     * @return bool
     */
    public function validateYouTubeUrl(string $path) {

        $url = $this->validateUrl($path);
        $youtube = (preg_match_all('/(https?:\/\/.*?youtube\.com)\/watch\?v=(.*)/im', $path));
        return ($url && $youtube);

    }

    /**
     * @param string $path
     * Validate Vimeo video URI
     * @return bool
     */
    public function validateVimeoUrl(string $path) {

        $url = $this->validateUrl($path);
        $vimeo = (preg_match_all('/^((?:https?:)?\/\/)?((?:www|m|player)\.)?((?:vimeo\.com))(?:$|\/|)(\S+)?$/m', $path));
        return ($url && $vimeo);

    }

}