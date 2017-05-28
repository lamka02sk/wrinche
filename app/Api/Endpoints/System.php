<?php

namespace App\Api\Endpoints;

use App\Logs\LogManager;

class System extends EndpointInterface {

    public function __construct($endpoint) {
        $this->endpoint = $endpoint;
        $this->executeEndpoint();
    }

    private function log_retrieve($file) {
        $log = new LogManager;
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

}