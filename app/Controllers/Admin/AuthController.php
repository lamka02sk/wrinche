<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller for administration login.
 * Version: 0.1.2
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Auth\Login;
use App\Errors\UserEvents;
use App\Helpers\Config;
use App\Helpers\Redirect;
use App\Controllers\AdminController;
use App\Helpers\Validator;
use App\Requests\Request;
use App\Requests\UrlRequest;
use App\Views\Login as LoginView;
use App\Models\UserModel;

class AuthController extends AdminController {

    public function __construct($category, $subcategory) {

        $this->category = $category;
        $this->subcategory = $subcategory;

    }

    public function get() {

        $this->{'get' . ucfirst($this->category)}();

    }

    public function post() {

        $this->{'post' . ucfirst($this->category)}();

    }

    public function checkLogin() {

        $authLogin = new Login('admin');
        return $authLogin->checkLogin();

    }

    public function loginRedirect() {

        // Redirect if user is logged in, page is login
        if($this->checkLogin() && Request::$url[1] === 'login')
            Redirect::route('');

    }

    public function getLogin() {

        // Redirect if logged in or show Login screen
        $this->loginRedirect();
        new LoginView;

    }

    public function postLogin() {

        $validator = new Validator();
        $loginData = Request::$forms['login'];

        // Check if login data exists
        if(!isset($loginData['username']) || !isset($loginData['password']) ||
            empty($loginData['username']) || empty($loginData['password']))
            new UserEvents(5); // Empty data

        $primary = $loginData['username'];
        $password = $loginData['password'];

        // Primary Type
        $primaryType = 'Username';
        if($validator->validateEmail($primary))
            $primaryType = 'Email';

        // Create user model
        $userModel = new UserModel;
        $userModel->{'prepareUserBy' . $primaryType}($primary);

        // Validate login data
        $loginValid = $validator->validateLogin($primary, $password, $primaryType);

        if(!$loginValid)
            new UserEvents(4); // Invalid Input

        // Try to login
        $login = new Login('admin');
        $login->login();

        // Redirect if logged in
        $this->loginRedirect();

    }

}