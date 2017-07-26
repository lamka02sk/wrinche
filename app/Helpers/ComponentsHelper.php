<?php

namespace App\Helpers;

class ComponentsHelper {

    /**
     * @param $input
     * Convert input variable type to integer
     * @return int|array
     */
    public function parseInt($input) {

        if(is_array($input)) {
            $result = [];
            foreach($input as $key => $item)
                $result[$key] = $this->parseInt($item);
            return $result;
        }

        if($input === 'false')
            return 0;
        else if($input === 'true')
            return 1;

        return (int)$input;

    }

    /**
     * @param $password
     * Generate hash for accessibility password
     * @return string
     */
    public function createPassword($password) {

        if($password === 'false')
            $password = '';

        $crypto = new Crypto;
        return $crypto->encryptWeakPassword($password);

    }

    /**
     * @param $booleans
     * Merge boolean values into string and evaluate as decimal number
     * @return number
     */
    public function mergeBooleans($booleans) {

        $booleans = $this->parseInt($booleans);
        $booleanString = '';

        foreach($booleans as $boolean)
            $booleanString .= $boolean;

        $math = new Math;
        return $math->toDecimal($booleanString);

    }

    /**
     * @param $number
     * Covert decimal number to binary string and split into boolean values
     * @return array
     */
    public function splitBooleans($number) {

        $math = new Math;
        $booleans = $math->toBinary((int)$number);
        return str_split($booleans);

    }

    /**
     * @param array $array
     * Create JSON from array
     * @return string
     */
    public function createJSON(array $array) {
        return json_encode($array);
    }

    /**
     * @param string $json
     * Create array from JSON
     * @return mixed
     */
    public function decodeJSON(string $json) {
        return json_decode($json, true);
    }

    /**
     * @param string $date
     * Create timestamp from given date string
     * TODO: Add support for user-selected datetime format
     * @return false|int
     */
    public function createTimestamp(string $date) {

        $timestamp = strtotime($date);
        if($timestamp === false) return null;

        return date('Y-m-d H:i:s', $timestamp);

    }

    /**
     * @param $timestamp
     * Create formatted datetime from timestamp
     * TODO: Add support for user-selected datetime format
     * @return false|string
     */
    public function createDatetime($timestamp) {

        if((string)$timestamp === 'null')
            return null;

        return date('d.m.Y H:i:s', strtotime($timestamp));

    }

    /**
     * @param $timestamp
     * Create formatted date from timestamp
     * TODO: Add support for user-selected date format
     * @return false|string
     */
    public function createDate($timestamp) {

        if((string)$timestamp === 'null')
            return null;

        return date('d.m.Y', strtotime($timestamp));

    }

}