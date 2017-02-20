<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * User logout authenticator.
 * Version: 0.1.1
 * Authors: lamka02sk
 */

namespace App\Auth;

use App\Models\LoginModel;
use App\Models\UserModel;
use App\Requests\CookieRequest;

class Logout extends Login {

    /**
     * Logout constructor.
     * @param $domain
     */
    public function __construct($domain) {

        // Call parent constructor
        parent::__construct($domain);

        // If user is not logged in
        if(!$this->checkLogin())
            return false;

        // Destroy cookie
        $cookie = new CookieRequest;
        $cookie->deleteCookie('login');

        // Remove user data from $_SESSION
        unset($_SESSION['user']);

        // Set login token status to expired
        $model = new LoginModel;
        $model->deactivateLogin();

        // Unset UserModel:: property
        UserModel::$user = [];

        return true;

    }

}