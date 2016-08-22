<?php

/* wrinche. Modern, powerful and user friendly CMS. */

namespace App\Controllers;

use App\Views\Installation;

class Install {

    public function __construct() {

        if(!isset($_POST['install'])) {
            new Installation();
        } else {

        }

    }

}