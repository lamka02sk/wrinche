<?php

namespace App\Api\Endpoints;

use App\Logs\LogManager;
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