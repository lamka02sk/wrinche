<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * All cryptographic function here.
 * Version: 0.1.2
 * Authors: lamka02sk
 */

namespace App\Helpers;

class Crypto {

    /**
     * @param $password
     * Encrypt password for DB storing
     * @return string
     */
    public function encryptPassword($password) {

        // Generate hash from given password
        $cost = 10;
        $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => $cost]);

        // Return created hash
        return $hash;

    }

    /**
     * @param $password
     * @param $hash
     * Verify password to authenticate user
     * @return bool
     */
    public function verifyPassword($password, $hash) {

        // Check if password hashes are equivalent
        if(!password_verify($password, $hash))
            return false;

        return true;

    }

}