<?php

namespace App\Auth;

use App\Errors\UserEvents;
use App\Helpers\Crypto;
use App\Models\OldPasswords;
use App\Models\TokensModel;
use App\Models\UserModel;
use App\Requests\Request;

class ResetPassword extends Login {
    
    public $newPassword;
    
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
    public function resetPassword() {
        
        // Save form data
        $registerData      = Request::$forms['reset-password'];
        $hash              = $registerData['hash'];
        $this->newPassword = $registerData['password'];
        
        // Check if hash exists
        $model = new TokensModel;
        if(!$model->checkToken($hash))
            new UserEvents(8);  // Hash does not exists
        
        // Get hash details from the DB
        $details = $model->getTokenByToken($hash);
        $userID  = $details['user_id'];
        
        // Create user instance from userID
        $user = new UserModel;
        $user->prepareUserByID($userID);
        
        $this->checkPasswords();
        $this->changePassword();
        
        // Delete current hash from DB to avoid further usage
        $model->deleteToken($hash);
        
        // Create response
        echo json_encode([
            'success' => true
        ]);
        
        return true;
        
    }
    
    /**
     * @return bool
     * Check the new password any usage before and now
     */
    public function checkPasswords() {
        
        $currentPassword = UserModel::$user['password'];
        
        // Verify password
        $crypto = new Crypto;
        if($crypto->verifyPassword($this->newPassword, $currentPassword))
            new UserEvents(9);  // New password equals to old password
        
        $this->checkOldPasswords();
        
        return true;
        
    }
    
    /**
     * @return bool
     * Check the new password for the past usage
     */
    public function checkOldPasswords() {
        
        // Get old passwords list
        $model     = new OldPasswords;
        $passwords = $model->getOldPasswords();
        
        // Check each old password for match
        $crypto = new Crypto;
        foreach($passwords as $password) {
            
            $password = $password['password'];
            if($crypto->verifyPassword($this->newPassword, $password))
                new UserEvents(9);  // New password equals to old password
            
        }
        
        return true;
        
    }
    
    /**
     * @return bool
     * Change the old password to the new one
     */
    public function changePassword() {
        
        // Create new password hash
        $crypto   = new Crypto;
        $password = $crypto->encryptPassword($this->newPassword);
        
        // Save the current password hash and save to the DB
        $model = new OldPasswords;
        $model->addOldPassword();
        
        // Save the new password to the DB
        UserModel::$user['password'] = $password;
        $model                       = new UserModel;
        $model->updateUser();
        
        return true;
        
    }
    
}