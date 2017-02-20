<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller for administration login.
 * Version: 0.1.4
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Auth\Login;
use App\Auth\Logout;
use App\Auth\Register;
use App\Auth\ResetPassword;
use App\Errors\UserEvents;
use App\Helpers\Config;
use App\Helpers\Generator;
use App\Helpers\Mail;
use App\Helpers\Redirect;
use App\Controllers\AdminController;
use App\Helpers\Validator;
use App\Models\TokensModel;
use App\Requests\Request;
use App\Views\Login as LoginView;
use App\Models\UserModel;

class AuthController extends AdminController {

    /**
     * AuthController constructor.
     * @param $category
     * @param $subcategory
     */
    public function __construct($category, $subcategory) {

        $method = '';
        $methods = explode('-', $category);
        foreach($methods as $item)
            $method .= ucfirst($item);

        $this->category = $method;
        $this->subcategory = $subcategory;

    }

    /**
     * Call get method
     */
    public function get() {

        $this->{'get' . ucfirst($this->category)}();

    }

    /**
     * Call post method
     */
    public function post() {

        $this->{'post' . ucfirst($this->category)}();

    }

    /** Check login */
    public function checkLogin() {

        $authLogin = new Login('admin');
        return $authLogin->checkLogin();

    }

    /**
     * Redirect on login
     */
    public function loginRedirect() {

        // Redirect if user is logged in, page is login
        if($this->checkLogin() && Request::$url[1] === 'login') {

            if(Request::$ajax)
                Redirect::response(200, true);
            else
                Redirect::route('');

        }

    }

    /**
     * Get method login - check current login
     */
    public function getLogin() {

        // Redirect if logged in or show Login screen
        $this->loginRedirect();
        new LoginView;

    }

    /**
     * Post method login - create new login
     */
    public function postLogin() {

        $validator = new Validator;
        $loginData = Request::$forms['login'] ?? [];

        // Check if login data exists
        if(!isset($loginData['username']) || !isset($loginData['password']) ||
            empty(trim($loginData['username'])) || empty(trim($loginData['password'])))
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

    /**
     * Get method register - show register route
     */
    public function getRegister() {

        // Load e-mail config
        new Config('e-mail');

        // Check if registration is allowed
        if(!Config::$file['admin']['register'])
            Redirect::route('');

        new LoginView('Register');

    }

    /**
     * Post method register - register new user account
     */
    public function postRegister() {

        // Check if registration is allowed
        if(!Config::$file['admin']['register'])
            Redirect::route('');

        $validator = new Validator;
        $registerData = Request::$forms['register'] ?? [];

        // Check if register data exists
        if(!isset($registerData['username']) || empty(trim($registerData['username'])) ||
            !isset($registerData['email']) || empty(trim($registerData['email'])) ||
            !isset($registerData['password']) || empty(trim($registerData['password'])) ||
            !isset($registerData['password_repeat']) || empty(trim($registerData['password_repeat'])))
            new UserEvents(5);  // Empty Data

        // Save form data
        $username = $registerData['username'];
        $email = $registerData['email'];
        $password = $registerData['password'];
        $passwordRepeat = $registerData['password_repeat'];

        // Validate input
        if(!$validator->validateRegister($username, $email, $password, $passwordRepeat))
            new UserEvents(4);

        // Register user
        $register = new Register('admin');
        $register->register();

    }

    public function getLostPassword() {

        $this->loginRedirect();
        new LoginView('LostPassword');
    }

    public function postLostPassword() {

        $validator = new Validator;
        $lostPasswordData = Request::$forms['lost-password'] ?? [];

        if(!isset($lostPasswordData['email']) || empty(trim($lostPasswordData['email'])))
            new UserEvents(5);  // Empty Data

        $email = $lostPasswordData['email'];
        if(!$validator->validateEmail($email))
            new UserEvents(4);  // Invalid Input

        // Get user by email
        $user = new UserModel;
        $user = $user->getUserBy('email', $email);
        $userID = $user['id'];

        // Create reset hash
        $generator = new Generator;
        $hash = $generator->generatePasswordResetToken();

        // Add hash to table
        $tokens = new TokensModel;
        $tokens->addToken($hash, 0, $userID);

        // Mail token to user
        $mailer = new Mail;
        // ... Send mail with token

        // Create response
        echo json_encode([
            'success' => true,
            'code' => 200
        ]);

        return true;

    }

    public function getResetPassword() {

        $this->loginRedirect();
        new LoginView('ResetPassword');

    }

    public function postResetPassword() {

        $validator = new Validator;
        $resetData = Request::$forms['reset-password'] ?? [];

        if(!isset($resetData['hash']) || empty(trim($resetData['hash'])) ||
            !isset($resetData['password']) || empty(trim($resetData['password'])) ||
            !isset($resetData['password_repeat']) || empty(trim($resetData['password_repeat'])))
            new UserEvents(5);  // Empty Data

        // Save data
        $password = $resetData['password'];
        $passwordRepeat = $resetData['password_repeat'];

        if(!$validator->validatePassword($password) || $password !== $passwordRepeat)
            new UserEvents(4);

        // Reset Password
        $reset = new ResetPassword('admin');
        $reset->resetPassword();

    }

    public function getLogout() {

        // Proceed logout
        new Logout('admin');

        // Redirect to login page (in browser redirect)
        Redirect::redirect('login');

    }

}