<?php

use App\Requests\UrlRequest;

$urlRequest = new UrlRequest();

if($urlRequest->isAdmin()) {

    // Show administration

} else {

    // Show website

}