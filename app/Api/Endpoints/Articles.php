<?php

namespace App\Api\Endpoints;

use App\Models\Articles\ContentModel;
use App\Models\ArticlesModel;
use App\Requests\Request;

class Articles extends EndpointInterface {
    
    protected $_endpoint;
    
    public function __construct($endpoint) {
        
        $this->_endpoint = $endpoint;
        $this->executeEndpoint();
        
    }
    
    public function exists_url() {
        
        if(strtolower(Request::$method) !== 'post')
            return $this->output = false;
        
        $data = Request::$forms['api'] ?? false;
        if($data === false)
            return $this->output = false;
        
        $url = $data['url'] ?? false;
        $ignore = $data['ignore'] ?? false;
        
        if($url === false || $ignore === false)
            return $this->output = false;
        
        $model = new ContentModel(new ArticlesModel);
        $this->output['result'] = $model->isArticleUrl($url, $ignore);
        return true;
    
    }
    
}