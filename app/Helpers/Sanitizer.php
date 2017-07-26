<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Sanitize all user input to protect system from attackers.
 * Version: 0.9.5
 * Authors: lamka02sk
 */

namespace App\Helpers;

class Sanitizer {

    /**
     * @param array $array
     * Sanitize each string in given array
     * @return mixed
     */
    public function sanitizeInput(array $array) {

        $result = [];
        foreach($array as $key => $content) {
            if(is_array($content))
                $result[(string)$key] = $this->sanitizeInput($content);
            else
                $result[(string)$key] = (string)$content;
        }

        return $result;

    }

    /**
     * @param $string
     * @return string
     * Sanitize output.
     */
    public function sanitizeOutput($string) {

        return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');

    }

    /**
     * @param $string
     * @return string
     * Remove HTML from string.
     */
    public function stripHTML($string) {

        return strip_tags($string);

    }

    /**
     * @param $string
     * @param $filter
     * @return bool
     * Sanitize string with any built-in filter.
     */
    private function filterSanitize($string, $filter) {

        return filter_var($string, $filter);

    }

    /**
     * @param $email
     * @return bool
     * Sanitize email.
     */
    public function sanitizeEmail($email) {

        return $this->filterSanitize($email, FILTER_SANITIZE_EMAIL);

    }

    /**
     * @param $string
     * @return bool
     * Sanitize string - add slashes.
     */
    public function sanitizeMagicQuotes($string) {

        $this->filterSanitize($string, FILTER_SANITIZE_MAGIC_QUOTES);
        return $string;

    }

    /**
     * @param $float
     * @return bool
     * Sanitize number - float.
     */
    public function sanitizeFloat($float) {

        return $this->filterSanitize($float, FILTER_SANITIZE_NUMBER_FLOAT);

    }

    /**
     * @param $integer
     * @return bool
     * Sanitize number - integer.
     */
    public function sanitizeInteger($integer) {

        return $this->filterSanitize($integer, FILTER_SANITIZE_NUMBER_INT);

    }

    /**
     * @param $url
     * @return bool
     * Sanitize URL.
     */
    public function sanitizeUrl($url) {

        return $this->filterSanitize($url, FILTER_SANITIZE_URL);

    }

}