<?php

namespace App\Api\Endpoints;

use App\Helpers\Redirect;

abstract class EndpointInterface {
    
    protected $output;
    protected $_endpoint;
    
    public $outputJson;
    
    abstract public function __construct($endpoint);
    
    public function executeEndpoint() {
        
        $method = str_replace('.', '_', $this->_endpoint);
        
        if(method_exists($this, $method))
            $this->{$method}();
        else
            Redirect::response(404);
        
        $output = [
            'success' => ($this->output === false) ? false : true,
            'code'    => 200,
            'data'    => $this->output
        ];
        
        $this->outputJson = json_encode($output);
    }
    
}