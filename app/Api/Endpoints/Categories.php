<?php

namespace App\Api\Endpoints;

use App\Models\CategoriesModel;

class Categories extends EndpointInterface {
    
    private $_endpoint;
    
    public function __construct($endpoint) {
        
        $this->_endpoint = $endpoint;
        $this->executeEndpoint();
        
    }
    
    public function all() {
        
        $model        = new CategoriesModel;
        $this->output = $model->getAllCategories();
        
    }
    
}