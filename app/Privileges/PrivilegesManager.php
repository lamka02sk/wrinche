<?php

namespace App\Privileges;

use App\Models\UserModel;

class PrivilegesManager {
    
    const PRIVILEGES = [
        ['B', 'PLEB'],
        ['A', 'ADMIN'],
        ['C', 'CONTRIBUTOR'],
        ['D', 'MANAGER']
    ];
    
    public function getPrivileges() {
    
        $privileges = UserModel::$user['admin'];
        return self::PRIVILEGES[$privileges];
    
    }
    
    public function getPrivilegesType() {
        
        return $this->getPrivileges()[0];
        
    }

    public function getPrivilegesName() {
    
        return $this->getPrivileges()[1];
    
    }

}