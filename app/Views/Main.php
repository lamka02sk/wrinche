<?php

/* wrinche. Modern, powerful and user friendly CMS. */

namespace App\Views;

class Main {

    public $page;
    public $ASSETS = [
        'styles' => [],
        'scripts' => []
    ];

    public function __construct() {

        //

    }

    public function setVendorAssets($assets) {

        $vendor = $_SESSION['CONFIG']['system']['vendor'];
        $path = $_SESSION['CONFIG']['system']['paths']['vendor'];

        if(!is_array($assets)) {
            $assets = [$assets];
        }

        foreach($vendor as $type => $resources) {
            foreach($resources as $name => $resource) {

                if(!in_array($name, $assets)) {
                    continue;
                }

                if($type === 'scripts') {
                    $this->ASSETS['scripts'][] = '<script type="application/javascript" src="' . $path . $resource . '"></script>';
                } else {
                    $this->ASSETS['styles'][] = '<link rel="stylesheet" type="text/css" href="' . $path . $resource . '">';
                }

            }
        }

    }

    public function setFavicon($type = '') {

        if(empty($type)) {
            $this->ASSETS['styles'][] = '<link rel="icon" href="assets/system/wrinche-favicon.png">';
        }

    }

    public function setAssets($assets) {

        if(is_array($assets)) {
            foreach($assets as $asset) {
                $this->addAsset($asset);
            }
        } else {
            $this->addAsset($assets);
        }

    }

    public function setStyles($styles) {

        if(is_array($styles)) {
            foreach($styles as $style) {
                $this->setStyle($style);
            }
        } else {
            $this->setStyle($styles);
        }

    }

    private function addAsset($asset) {

        $this->setStyle($asset);
        $this->setScript($asset);

    }

    private function setStyle($style) {

        $path = $_SESSION['CONFIG']['system']['paths']['styles'];
        $this->ASSETS['styles'][] = '<link rel="stylesheet" type="text/css" href="' . $path . $style . '.min.css">';
        $this->ASSETS['styles'][] = '<link id="theme" rel="stylesheet" type="text/css" href="' . $path . 'themes/light/' . $style . '.min.css">';

    }

    private function setScript($script) {

        $path = $_SESSION['CONFIG']['system']['paths']['scripts'];
        $this->ASSETS['scripts'][] = '<script type="application/javascript" src="' . $path . $script . '.min.js"></script>';

    }

}