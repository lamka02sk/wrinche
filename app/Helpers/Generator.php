<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Generator for creating tokens and hashes
 * Version: 0.9.2
 * Authors: lamka02sk
 */

namespace App\Helpers;

class Generator {

    /**
     * @param $length
     * Generate token of selected length
     * @return string
     */
    private function generateToken($length) {

        $token = bin2hex(random_bytes($length));
        return $token;

    }

    /**
     * @return string
     * Generate CSRF authentication token
     */
    public function generateCsrfToken() {

        $length = 64;
        $token = $this->generateToken($length);
        return $token;

    }

    /**
     * @return string
     * Generate URL for administration
     */
    public function generateAdministrationURI() {

        $length = 8;
        $token = $this->generateToken($length);
        return $token;

    }

    /**
     * @return string
     * Generate Login Hash Token
     */
    public function generateLoginHash() {

        return $this->generateCsrfToken();

    }

    /**
     * @return string
     * Generate Login Key Token
     */
    public function generateLoginKey() {

        $length = 128;
        $token = $this->generateToken($length);
        return $token;

    }

    /**
     * @return string
     * Generate token for authenticate password reset
     */
    public function generatePasswordResetToken() {

        $length = 128;
        $token = $this->generateToken($length);
        return $token;

    }

    /**
     * @param $algorithm
     * @param $string
     * Generate any hash supported by PHP
     * @return string
     */
    public function generateHash($algorithm, $string) {

        // Protection for generating hash from empty string
        if(empty($string))
            $string = $this->generateToken(8);

        // Generate hash from given string
        return hash($algorithm, $string);

    }

}