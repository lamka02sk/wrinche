<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Helps to deliver correct and accurate translations
 * Version: 0.1.0
 * Authors: lamka02sk
 */

namespace App\Helpers;

class Locale {

    public function decline(int $count, $locale) {

        $prefix = '';
        if($count === 0)
            $prefix = '0';
        else if($count === 1)
            $prefix = '1';
        else if($count > 1 && $count < 5)
            $prefix = '2-4';
        else if($count > 4)
            $prefix = 'X';

        $locale = $prefix . '_' . $locale;
        return $locale;

    }

}