<?php

use App\Requests\UrlRequest;
use App\Routers\AdminRouter;

$urlRequest = new UrlRequest();

if($urlRequest->isAdmin()) {

    // Show administration
    $router = new AdminRouter;

    // GET Routes
    $router->get('')
           ->get('login')
           ->get('home')
           ->get('dashboard');

    // POST Routes
    $router->post('login');

    // Navigate app
    $route = $router->done();
    $router->navigate($route);

} else {

    // Show website
    echo 'this is my website!';

}
