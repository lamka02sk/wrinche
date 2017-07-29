<?php

namespace App\Auth;

use App\Errors\UserEvents;
use App\Helpers\Crypto;
use App\Helpers\Generator;
use App\Helpers\Validator;
use App\Models\LoginAttemptsModel;
use App\Models\LoginModel;
use App\Models\UserModel;
use App\Requests\CookieRequest;
use App\Requests\Request;

class Login {
    
    public $loginDomain;
    
    private $_loginHash;
    private $_loginKey;
    private $_loginType;
    private $_loginPassword;
    private $_maximumLoginTime = 24;     // Hours
    
    /**
     * Login constructor.
     * @param $domain
     */
    public function __construct($domain) {
        
        $this->loginDomain = $domain;
        
    }
    
    /**
     * @return bool
     * Check if user is logged in
     */
    public function checkLogin() {
        
        // Check if cookie exists
        if((!isset(Request::$cookie['login']) || empty(Request::$cookie['login'])))
            return false;
        
        $loginModel = new LoginModel;
        if(!$loginModel->checkLogin())
            return false;
        
        // User is Logged in
        $userModel = new UserModel;
        $userModel->start();
        $this->updateLogin();
        
        return true;
        
    }
    
    /**
     * Update login information
     */
    public function updateLogin() {
        
        // Get cookie data
        $cookie           = explode('|', Request::$cookie['login']);
        $this->_loginHash = $cookie[0];
        $this->_loginKey  = $cookie[1];
        
        // Update cookie value and expiration time
        $cookieRequest = new CookieRequest;
        $cookieRequest->updateCookie(
            'login',
            $this->_loginHash . '|' . $this->_loginKey,
            time() + 60 * 60 * $this->_maximumLoginTime
        );
        
        // Update login model
        $loginModel = new LoginModel;
        $loginModel->updateLogin();
        $_SESSION['user'] = UserModel::$user;
        
    }
    
    /**
     * Login function, create new login and/or redirect
     */
    public function login() {
        
        // Save login data from forms
        $loginData            = Request::$forms['login'];
        $this->_loginKey      = $loginData['username'];
        $this->_loginPassword = $loginData['password'];
        
        $crypt     = new Crypto;
        $generator = new Generator;
        $this->keyType();
        
        // Check if user exists
        $user = UserModel::$user;
        if(!isset($user['id'])) {
            $userModel = new UserModel;
            $user      = $userModel->getUserBy($this->_loginType, $this->_loginKey);
        }
        
        // Check login attempts limit
        $loginAttempts = new LoginAttemptsModel;
        $loginAttempts->start();
        if(!$loginAttempts->checkAttempts())
            new UserEvents(2);  // Login Attempts
        
        // Check user and password
        if(empty($user))
            new UserEvents(3);  // Invalid Login (username)
        
        if(!$crypt->verifyPassword($this->_loginPassword, $user['password'])) {
            $loginAttempts->addAttempt();
            new UserEvents(3);  // Invalid Login (password)
        }
        
        // Check if user has active account
        if(!(bool)$user['active'])
            new UserEvents(10);  // Inactive account
        
        // Create login identifier
        $_SESSION['user'] = $user;
        $loginHash        = $generator->generateLoginHash();
        $loginKey         = $generator->generateLoginKey();
        
        // Create Login cookie
        $cookieRequest = new CookieRequest;
        $cookieRequest->updateCookie(
            'login',
            $loginHash . '|' . $loginKey,
            time() + 60 * 60 * $this->_maximumLoginTime
        );
        
        // Save login and start user model
        $loginModel = new LoginModel;
        $loginModel->addLogin($loginKey, $loginHash);
        
        $userModel = new UserModel;
        $userModel->start();
        
    }
    
    /**
     * Determine primary key type
     */
    public function keyType() {
        
        $key       = $this->_loginKey;
        $validator = new Validator;
        
        $this->_loginType = 'username';
        if($validator->validateEmail($key))
            $this->_loginType = 'email';
        
    }
    
}