<?php

namespace App\Api\Endpoints;

use App\Helpers\Redirect;

abstract class EndpointInterface {

    protected $output;
    protected $endpoint;

    public $outputJson;

    abstract public function __construct($endpoint);

    public function executeEndpoint() {
        $method = str_replace('.', '_', $this->endpoint);
        if(method_exists($this, $method))
            $this->{$method}();
        else
            Redirect::response(404);
        $this->outputJson = json_encode($this->output);
    }

}