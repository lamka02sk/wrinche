<?php

namespace App\Auth;

use App\Helpers\Redirect;

class DDoS {
    
    private $_requests;
    
    const LIMIT = 10;   // request per TIME allowed
    const TIME  = 120;  // seconds
    
    /**
     * DDoS constructor.
     */
    public function __construct() {
        
        $this->_requests = $_SESSION['requests'] ?? [];
        $this->_checkUser();
        
    }
    
    /**
     * Check user for DDoS activity
     */
    private function _checkUser() {
        
        $i     = 0;
        $count = 0;
        $max   = sizeof($this->_requests);
        
        // Count requests in time interval, unset old requests
        while($i < $max) {
            
            if((microtime(true) - $this->_requests[$i]) < self::TIME)
                ++$count;
            else
                unset($this->_requests[$i]);
            
            ++$i;
            
        }
        
        // Save requests
        $this->_requests[]    = microtime(true);
        $this->_requests      = array_values($this->_requests);
        $_SESSION['requests'] = $this->_requests;
        
        // Redirect if suspicious activity was found
        if($count > self::LIMIT)
            Redirect::response(429);
        
    }
    
}