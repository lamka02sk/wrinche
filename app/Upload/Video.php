<?php

namespace App\Upload;

use App\Errors\UserEvents;

class Video extends Main {

    public function __construct(array $metadata) {

        // Save video metadata
        $this->data = $metadata;

        // Check if video format is supported
        $this->checkFormat();

        // Save video
        $this->saveVideo();

        // Return video information
        $this->returnInformation();

    }

    public function checkFormat() {

        // Get file extension
        $this->extension = pathinfo($this->data['name'])['extension'];

        // Check file extension
        if(!in_array($this->extension, self::VIDEO_EXTENSIONS))
            new UserEvents(30);  // Unsupported video format

        // Get file MIME type
        $formatType = mime_content_type($this->data['tmp_name']);

        // Check format type
        if(!in_array($formatType, self::VIDEO_MIME[$this->extension]))
            new UserEvents(30);  // Unsupported video format

    }

    public function saveVideo() {

        // Create new video path and name
        $additionPre = '(';
        $additionPost = ')';
        $additionContent = 1;

        $name = pathinfo($this->data['name'], PATHINFO_FILENAME);
        $destination = 'app/Data/Files/Videos/' . $name . '.' . $this->extension;

        while(file_exists($destination)) {
            $addition = $additionPre . $additionContent . $additionPost;
            $destination = 'app/Data/Files/Videos/' . $name . ' ' . $addition . '.' . $this->extension;
            ++$additionContent;
        }

        // Move and save video
        $this->destination = $destination;
        move_uploaded_file($this->data['tmp_name'],ROOT . '/' . $destination);

    }

    public function returnInformation() {

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