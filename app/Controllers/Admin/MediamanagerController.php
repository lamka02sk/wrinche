<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller for media.
 * Version: 0.2.2
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Controllers\AdminController;
use App\Errors\UserEvents;
use App\Models\LocaleModel;
use App\Requests\Request;
use App\Upload\Audio;
use App\Upload\File;
use App\Upload\Image;
use App\Upload\Video;
use App\Views\Admin as DashboardView;

class MediamanagerController extends AdminController {

    /**
     * DashboardController constructor.
     * Prepare Controller for Dashboard render
     * @param $subcategory
     */
    public function __construct($subcategory) {

        // Save subcategory
        $this->subcategory = $subcategory;

        // Execute the parent "constructor"
        $this->start();

        // Detect get or post
        if(Request::$method === 'POST')
            $this->post();
        else
            $this->get();

    }

    public function get() {

        // Return template view
        $this->createView('MediaManager');

    }

    public function post() {

        $this->{$this->subcategory}();

    }

    public function upload() {

        // Detect file type
        foreach(Request::$files as $file) {

            if($file['error'] !== 0)
                new UserEvents(0); // Unknown Error while Uploading

            $type = explode('/', $file['type'])[0];
            if($type === 'image') {
                new Image($file);
            } else if($type === 'video') {
                new Video($file);
            } else if($type === 'audio') {
                new Audio($file);
            } else {
                new File($file);
            }

        }

    }

    public function filelist() {

        $files = scandir(ROOT . '/app/Data/Files');
        unset($files[0], $files[1]);
        $files = array_values($files);

        echo '<br><br><br>';

        foreach($files as $dirname) {

            echo '<b>' . $dirname . '</b><br>';

            $filelist = preg_grep('/^([^.])/', scandir(ROOT . '/app/Data/Files/' . $dirname));
            unset($filelist[0], $filelist[1]);
            $filelist = array_values($filelist);

            if(empty($filelist))
                echo '** empty **' . '<br>';

            foreach($filelist as $file) {
                echo '<li class="item-file" data-type="' . strtolower($dirname) . '" data-path="' . $file . '">' . $file . ' <input type="button" class="item-select" value="Select"></li><br>';
            }

            echo '<br>';

        }

    }

}