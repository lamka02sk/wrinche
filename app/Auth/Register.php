<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * User registration authenticator.
 * Version: 0.1.0
 * Authors: lamka02sk
 */

namespace App\Auth;

use App\Errors\UserEvents;
use App\Models\UserModel;
use App\Models\UserSettingsModel;
use App\Requests\Request;

class Register extends Login {

    /**
     * Register constructor.
     * @param $domain
     */
    public function __construct($domain) {

        parent::__construct($domain);

    }

    /**
     * @return bool
     * Register new user account
     */
    public function register() {

        // Save form data
        $registerData = Request::$forms['register'];
        $username = $registerData['username'];
        $email = $registerData['email'];
        $password = $registerData['password'];

        // Check if email and username are free
        $userModel = new UserModel;
        if(!$userModel->isUsername($username) || !$userModel->isEmail($email))
            new UserEvents(7);  // User with given email or username already exists

        // Create new user
        $userModel->createUser($username, $email, $password, 0, true);

        // Create user settings
        $settingModel = new UserSettingsModel;
        $settingModel->createSettings(UserModel::$user['id']);

        // Create response
        echo json_encode([
            'success' => true,
            'code' => 200
        ]);

        return true;

    }

}