<?php

use App\Requests\UrlRequest;
use App\Routers\AdminRouter;

$urlRequest = new UrlRequest();

if($urlRequest->isAdmin()) {

    // Show administration
    $router = new AdminRouter;

    // GET Routes
    $router->get('')

           // Authentication
           ->get('login')
           ->get('register')
           ->get('lost-password')
           ->get('reset-password/[anum]')
           ->get('logout')

           // Menu
           ->get('dashboard')
           ->get('articles')
           ->get('sections')
           ->get('comments')
           ->get('mistakes')
           ->get('multimedia')

           ->get('sorting')
           ->get('sorting/categories')
           ->get('sorting/tags')

           ->get('calendar')
           ->get('components')
           ->get('analytics')
           ->get('websites')
           ->get('settings')        // Redirected to 'settings/appearance'

           // Settings
           ->get('settings/appearance')
           ->get('settings/account')
           ->get('settings/writing')
           ->get('settings/privacy')
           ->get('settings/notifications')
           ->get('settings/multimedia')
           ->get('settings/system')
           ->get('settings/keyboard')
           ->get('settings/users')
           ->get('settings/website')        // Redirected to 'website'

           // Write
           ->get('write/{layout}')

           // Media Manager
           ->get('mediamanager')

           // New
           ->get('new/category')
           ->get('new/tag')

           // Edit category / tag
           ->get('category/[simple-url]')
           ->get('tag/[simple-url]')

    ;

    // POST Routes
    $router->post('login')
           ->post('lost-password')
           ->post('reset-password')
           ->post('register')

           // Save article
           ->post('write')

           // Settings
           ->post('settings')
           ->post('settings/appearance')
           ->post('settings/account')
           ->post('settings/writing')
           ->post('settings/privacy')
           ->post('settings/notifications')
           ->post('settings/multimedia')
           ->post('settings/system')
           ->post('settings/keyboard')
           ->post('settings/users')
           ->post('settings/website')

           // Media manager
           ->post('mediamanager')
           ->post('mediamanager/filelist')
           ->post('mediamanager/upload')

           ->post('sorting')

           // New
           ->post('new/category')
           ->post('new/tag')

           // Edit category / tag
           ->post('category')
           ->get('tag')

    ;

    // Navigate app
    $route = $router->done();
    $router->navigate($route);

} else {

    // Show website
    echo 'this is my website!';

}