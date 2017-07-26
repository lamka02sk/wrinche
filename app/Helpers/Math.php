<?php

namespace App\Helpers;

class Math {

    /**
     * @param string $binary
     * Convert binary string to number
     * @return number
     */
    public function toDecimal(string $binary) {
        return (int)bindec($binary);
    }

    /**
     * @param int $number
     * Convert decimal number to binary string
     * @return string
     */
    public function toBinary(int $number) {
        return (string)decbin($number);
    }

}