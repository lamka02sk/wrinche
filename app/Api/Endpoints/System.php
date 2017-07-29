<?php

namespace App\Api\Endpoints;

use App\Logs\LogManager;
use ReflectionClass;

class System extends EndpointInterface {
    
    private $_endpoint;
    
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
    
}