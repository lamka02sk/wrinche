<?php

namespace App\Api\Endpoints;

use App\Auth\Login;
use App\Auth\Logout;
use App\Controllers\Admin\AuthController;
use App\Helpers\Redirect;
use App\Logs\LogManager;
use App\Models\LoginModel;
use App\Models\UserModel;
use App\Requests\Request;
use ReflectionClass;

class System extends EndpointInterface {
    
    protected $_endpoint;
    
    public function __construct($endpoint) {
        
        $this->_endpoint = $endpoint;
        $this->executeEndpoint();
        
    }
    
    private function log_retrieve($file) {
        
        $log             = new LogManager;
        $this->output[0] = $log->retrieve($file);
        
    }
    
    public function log_retrieve_performance() {
        
        $this->log_retrieve('performance');
        
    }
    
    public function log_retrieve_errors() {
        
        $this->log_retrieve('errors');
        
    }
    
    public function log_retrieve_events() {
        
        $this->log_retrieve('events');
        
    }
    
    public function auth_refresh_token() {
        
        $class = new ReflectionClass("App\Auth\Csrf");
        $csrf  = $class->newInstanceWithoutConstructor();
        
        $csrf->updateToken();
        $this->output = $_SESSION['auth']['csrf_token'];
        
    }
    
    public function auth_logout() {
    
        if(strtolower(Request::$method) !== 'post')
            return new Logout('admin');
    
        $model = new LoginModel;
        $data = Request::$forms['api'] ?? [];
        
        foreach($data as $sessionID)
            $model->deactivateLogin($sessionID);
        
        $this->output = true;
        return true;
    
    }
    
    public function auth_refresh_login() {
    
        if(strtolower(Request::$method) !== 'post')
            return $this->output = false;
        
        $login = new Login('admin');
        $login->checkLogin();
    
        $model = new LoginModel;
        $data = Request::$forms['api'] ?? [];
        
        foreach($data as $sessionID) {
            
            $session = $model->getSessionByID($sessionID);
            
            if(empty($session))
                continue;
            
            if($session['user_id'] !== UserModel::$user['id'])
                continue;
            
            if($sessionID === LoginModel::$login['id'])
                continue;
            
            $model->updateLogin($sessionID, $session['inc']);
        
        }
        
        $this->output = true;
        return true;
    
    }
    
    public function check_integrity_components() {
    
        $componentsList = json_decode(file_get_contents(ROOT . '/app/Components/components.json'), true);
        $componentScripts = [];
        
        foreach($componentsList as $category => $categoryComponents) {
            
            foreach($categoryComponents as $categoryComponent) {
                
                $componentFile = ROOT . '/app/Components/Scripts/' . $categoryComponent . '.min.js';
                $componentScripts[$categoryComponent] = hash_file('sha256', $componentFile);
                
            }
            
        }
        
        $this->output = $componentScripts;
    
    }
    
}