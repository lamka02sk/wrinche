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
     * @param     $password
     * Encrypt password for DB storing
     * @param int $cost
     * @return string
     */
    public function encryptPassword($password, int $cost = 12) {

        // Generate hash from given password
        $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => $cost]);

        // Return created hash
        return $hash;

    }

    /**
     * @param $password
     * Low cost password encrypting function
     * @return string
     */
    public function encryptWeakPassword($password) {
        return $this->encryptPassword($password, 4);
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