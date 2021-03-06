<?php

namespace App\Views;

use App\Helpers\Config;
use App\Render\Html;

class Main {

    public $page;
    public $theme = 'light';
    public $CONFIG;
    public $ASSETS = [
        'styles' => [],
        'scripts' => []
    ];

    private $template;

    public function setVendorAssets($assets) {

        $vendor = Config::$file['system']['vendor'];
        $path = Config::$file['system']['paths']['vendor'];

        if(!is_array($assets))
            $assets = [$assets];

        foreach($vendor as $type => $resources) {
            foreach($resources as $name => $resource) {

                if(!in_array($name, $assets)) continue;

                if($type === 'scripts')
                    $this->ASSETS['scripts'][] = '<script type="application/javascript" src="' . $path . $resource . '"></script>';
                else
                    $this->ASSETS['styles'][] = '<link rel="stylesheet" type="text/css" href="' . $path . $resource . '">';

            }
        }

    }

    public function setFavicon($type = '') {

        if(empty($type))
            $this->ASSETS['styles'][] = '<link rel="icon" href="assets/system/wrinche-favicon.png">';

    }

    public function setAssets($assets) {

        if(is_array($assets)) {
            foreach($assets as $asset)
                $this->addAsset($asset);
        } else
            $this->addAsset($assets);

    }

    public function setStyles($styles, $path = false) {

        if(is_array($styles)) {
            foreach($styles as $style)
                $this->setStyle($style, $path);
        } else
            $this->setStyle($styles, $path);

    }

    public function setScripts($styles, $path = false) {

        if(is_array($styles)) {
            foreach($styles as $style)
                $this->setScript($style, $path);
        } else
            $this->setScript($styles, $path);

    }

    private function addAsset($asset) {

        $this->setStyle($asset);
        $this->setScript($asset);

    }


    private function setStyle($style, $path = false) {

        if($path === false) {
            
            $path = Config::$file['system']['paths']['styles'];
            
            $this->ASSETS['styles'][] =
                '<link
                    id="theme"
                    rel="stylesheet"
                    type="text/css"
                    href="' . $path . 'themes/' . $this->theme . '/' . $style . '.min.css">';
            
        }
        
        $this->ASSETS['styles'][] =
            '<link
                rel="stylesheet"
                type="text/css"
                href="' . $path . $style . '.min.css">';

    }

    private function setScript($script, $path = false) {

        if($path === false)
            $path = Config::$file['system']['paths']['scripts'];
        
        $this->ASSETS['scripts'][] =
            '<script
                type="application/javascript"
                src="' . $path . $script . '.min.js"></script>';

    }

}