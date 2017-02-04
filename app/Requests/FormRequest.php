<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Form Request Module. Manage HTTP request data from user.
 * Version: 0.1.2
 * Authors: lamka02sk
 */

namespace App\Requests;

use App\Helpers\Sanitizer;

class FormRequest {

    public static function init() {

        $sanitizer = new Sanitizer;
        $data = $_POST ?? [];
        $data = $sanitizer->sanitizeInput($data);
        Request::$forms = $data;

    }

    public function all() {

        return Request::$forms;

    }

    public function getInput(string $name, string $default = "") {

        $array = Request::$forms;
        $keys = explode(".", $name);
        foreach($keys as $key)
            $array = $array[$key] ?? $default;

        return $array;

    }

    public function getInputs(array $inputs, string $default = "") {

        $array = [];
        foreach($inputs as $input)
            $array[] = $this->getInput($input, $default);

        return $array;

    }

    public function saveAll() {

        $_SESSION['forms'][] = Request::$forms;
        return true;

    }

    public function saveInput(string $name, string $default = "") {

        $array = $this->getInput($name, $default);
        $_SESSION['forms'][] = $array;
        return true;

    }

    public function saveInputs(array $inputs, string $default = "") {

        $array = [];
        foreach($inputs as $input)
            $array[] = $this->saveInput($input, $default);

        return true;

    }

    public function retrieveInput(string $name, string $default = "") {

        $result = $_SESSION['forms'];
        $keys = explode(".", $name);
        foreach($keys as $key)
            $result = $result[$key] ?? $default;

        return $result;

    }

}