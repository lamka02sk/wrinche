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
           ->get('register')
           ->get('lost-password')
           ->get('reset-password/[anum]')
           ->get('home')
           ->get('dashboard');

    // POST Routes
    $router->post('login')
           ->post('lost-password')
           ->post('reset-password')
           ->post('register');

    // Navigate app
    $route = $router->done();
    $router->navigate($route);

} else {

    // Show website
    echo 'this is my website!';

}