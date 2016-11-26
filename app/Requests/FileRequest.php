<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * File Request Module. Manage HTTP request data from user.
 * Version: 0.1
 * Authors: lamka02sk
 */

namespace App\Requests;

class FileRequest {

    public static function init() {

        $data = $_FILES ?? [];
        Request::$files = $data;

    }

    public function all() {

        return Request::$files;

    }

    public function getFile(string $name, $ord = 'ALL') {

        $file = Request::$files[$name] ?? [];
        $result = [];
        foreach($file as $property => $values) {
            if($ord === 'ALL') {
                foreach($values as $key => $value) {
                    $result[$property][$key] = $value ?? "";
                }
            } else {
                $result[$property] = $values[$ord] ?? "";
            }
        }

        return $result;

    }

    public function getFiles(array $names, array $ord = ['ALL']) {

        $result = [];
        foreach($names as $key => $name) {
            $result[] = $this->getFile($name, $ord[$key]);
        }

        return $result;

    }

    public function modifyFile(string $name, array $values, int $ord = 0) {

        foreach($values as $key => $value) {
            Request::$files[$name][$key][$ord] = $value;
            $_FILES[$name][$key][$ord] = $value;
        }

        return true;

    }

    public function insertFile(string $name, array $values) {

        foreach($values as $key => $value) {
            Request::$files[$name][$key][] = $value;
            $_FILES[$name][$key][] = $value;
        }

        return true;

    }

    public function removeFile(string $name, int $ord = 0) {

        $file = Request::$files[$name];
        foreach($file as $property => $value) {
            unset(Request::$files[$name][$property][$ord]);
            unset($_FILES[$name][$property][$ord]);
        }

        if(empty($file[$name]['name'])) {
            unset(Request::$files[$name]);
            unset($_FILES[$name]);
        }

        return true;

    }

}