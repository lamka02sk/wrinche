<?php

namespace App\Upload;

use App\Errors\UserEvents;

class Image extends Main {
    
    const PRESETS = [
    
        'default' => [
            'quality' => 58,
            'maxWidth' => 2000,
            'maxHeight' => 1500,
            'path' => 'app/Data/Files/Images/',
            'response' => true
        ],
        
        'profile' => [
            'quality' => 58,
            'maxWidth' => 124,
            'maxHeight' => 124,
            'path' => 'app/Data/Files/Users/',
            'response' => false
        ]
    
    ];

    public function __construct(array $metadata, string $preset = 'default') {

        // Save image metadata
        $this->data = $metadata;
        $this->preset = $preset;

        // Check if image format is supported
        $this->checkFormat();

        // Apply upload settings to image
        $this->applySettings();

        // Save image
        $this->saveImage();

        // Return image information
        $this->returnInformation();

    }

    public function checkFormat() {

        // Get file extension
        $this->extension = pathinfo($this->data['name'])['extension'];

        // Check file extension
        if(!in_array($this->extension, self::IMAGE_EXTENSIONS))
            new UserEvents(20);  // Unsupported image format

        // Get file MIME type
        $formatType = mime_content_type($this->data['tmp_name']);

        // Check format type
        if(!in_array($formatType, self::IMAGE_MIME[$this->extension]))
            new UserEvents(20);  // Unsupported image format

        // Last check if file is image
        if($this->extension !== 'svg') {
            if(!getimagesize($this->data['tmp_name']))
                new UserEvents(21);  // Invalid image
        }

    }

    public function applySettings() {

        if($this->extension === 'jpg' || $this->extension === 'jpeg' || $this->extension === 'jif' || $this->extension === 'jpe')
            $this->applySettingsJPEG();
        else if($this->extension === 'png')
            $this->applySettingsPNG();
        else if($this->extension === 'gif')
            $this->applySettingsGIF();
        else if($this->extension === 'bmp')
            $this->applySettingsBMP();
        /*else if($this->extension === 'webp')
            $this->applySettingsWEBP();*/

    }

    public function applySettingsJPEG() {
        
        $preset = self::PRESETS[$this->preset];

        // Resize if needed
        list($width, $height) = getimagesize($this->data['tmp_name']);
        if($width > $preset['maxWidth'] || $height > $preset['maxHeight']) {

            // Find new size
            if($width > $preset['maxWidth']) {
                $ratio = $width / $height;
                $newWidth = $preset['maxWidth'];
                $newHeight = floor($newWidth / $ratio);
            } else {
                $ratio = $width / $height;
                $newHeight = $preset['maxHeight'];
                $newWidth = floor($newHeight * $ratio);
            }

            // Resize
            $source = imagecreatefromjpeg($this->data['tmp_name']);
            $canvas = imagecreatetruecolor($newWidth,$newHeight);
            imagecopyresampled($canvas, $source,0,0,0,0,$newWidth,$newHeight, $width,$height);

            // Save resized image
            imagejpeg($canvas,$this->data['tmp_name'],100);
            imagedestroy($source);
            imagedestroy($canvas);

        }

        // Apply quality settings
        $image = imagecreatefromjpeg($this->data['tmp_name']);
        imageinterlace($image,true);
        imagejpeg($image,$this->data['tmp_name'],$preset['quality']);
        imagedestroy($image);

    }

    public function applySettingsPNG() {
        
        $preset = self::PRESETS[$this->preset];

        // Resize if needed
        list($width, $height) = getimagesize($this->data['tmp_name']);
        if($width > $preset['maxWidth'] || $height > $preset['maxHeight']) {

            // Find new size
            if($width > $preset['maxWidth']) {
                $ratio = $width / $height;
                $newWidth = $preset['maxWidth'];
                $newHeight = floor($newWidth / $ratio);
            } else {
                $ratio = $width / $height;
                $newHeight = $preset['maxHeight'];
                $newWidth = floor($newHeight * $ratio);
            }

            // Resize
            $source = imagecreatefrompng($this->data['tmp_name']);
            $canvas = imagecreatetruecolor($newWidth,$newHeight);
            imagecopyresampled($canvas, $source,0,0,0,0,$newWidth,$newHeight, $width,$height);

            // Save resized image
            imagepng($canvas,$this->data['tmp_name'],4);
            imagedestroy($source);
            imagedestroy($canvas);

        }

        // Apply quality settings
        $image = imagecreatefrompng($this->data['tmp_name']);
        imagepng($image,$this->data['tmp_name'],9);
        imagedestroy($image);

    }

    public function applySettingsGIF() {
        
        $preset = self::PRESETS[$this->preset];

        // Resize if needed
        list($width, $height) = getimagesize($this->data['tmp_name']);
        if($width > $preset['maxWidth'] || $height > $preset['maxHeight']) {

            // Find new size
            if($width > $preset['maxWidth']) {
                $ratio = $width / $height;
                $newWidth = $preset['maxWidth'];
                $newHeight = floor($newWidth / $ratio);
            } else {
                $ratio = $width / $height;
                $newHeight = $preset['maxHeight'];
                $newWidth = floor($newHeight * $ratio);
            }

            // Resize
            $source = imagecreatefromgif($this->data['tmp_name']);
            $canvas = imagecreatetruecolor($newWidth,$newHeight);
            imagecopyresampled($canvas, $source,0,0,0,0,$newWidth,$newHeight, $width,$height);

            // Save resized image
            imagegif($canvas,$this->data['tmp_name']);
            imagedestroy($source);
            imagedestroy($canvas);

        }

    }

    /*public function applySettingsBMP() {

        // BMP is supported only by PHP >= 7.2.0, check version of PHP first
        if(version_compare(PHP_VERSION,'7.2.0', '<'))
            return true;

        // Resize if needed
        list($width, $height) = getimagesize($this->data['tmp_name']);
        if($width > self::MAX_HORIZONTAL_SIZE || $height > self::MAX_VERTICAL_SIZE) {

            // Find new size
            if($width > self::MAX_HORIZONTAL_SIZE) {
                $ratio = $width / $height;
                $newWidth = self::MAX_HORIZONTAL_SIZE;
                $newHeight = floor($newWidth / $ratio);
            } else {
                $ratio = $width / $height;
                $newHeight = self::MAX_VERTICAL_SIZE;
                $newWidth = floor($newHeight * $ratio);
            }

            // Resize
            $source = imagecreatefrombmp($this->data['tmp_name']);
            $canvas = imagecreatetruecolor($newWidth,$newHeight);
            imagecopyresampled($canvas, $source,0,0,0,0,$newWidth,$newHeight, $width,$height);

            // Save resized image
            imagebmp($canvas, $this->data['tmp_name']);
            imagedestroy($source);
            imagedestroy($canvas);

        }

        // Apply quality settings
        $image = imagecreatefrombmp($this->data['tmp_name']);
        imagebmp($image, $this->data['tmp_name']);
        imagedestroy($image);

        return true;

    }*/

    public function saveImage() {
    
        $preset = self::PRESETS[$this->preset];

        // Create new image path and name
        $additionPre = '(';
        $additionPost = ')';
        $additionContent = 1;

        $name = pathinfo($this->data['name'], PATHINFO_FILENAME);
        $destination = $preset['path'] . $name . '.' . $this->extension;

        while(file_exists($destination)) {
            $addition = $additionPre . $additionContent . $additionPost;
            $destination =  $preset['path'] . $name . ' ' . $addition . '.' . $this->extension;
            ++$additionContent;
        }

        // Move and save image
        $this->destination = $destination;
        move_uploaded_file($this->data['tmp_name'],ROOT . '/' . $destination);

    }

    public function returnInformation() {
        
        $preset = self::PRESETS[$this->preset];
        
        if($preset['response'] === false)
            return true;

        // Create result array
        $result = [
            'success' => true,
            'code' => 200,
            'path' => $this->destination,
            'size' => filesize(ROOT . '/' . $this->destination)
        ];

        echo json_encode($result);
        return true;

    }

}