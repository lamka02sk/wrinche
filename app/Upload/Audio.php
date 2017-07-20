<?php

namespace App\Upload;

use App\Errors\UserEvents;

class Audio extends Main {

    public function __construct(array $metadata) {

        // Save audio metadata
        $this->data = $metadata;

        // Check if audio format is supported
        $this->checkFormat();

        // Save audio
        $this->saveAudio();

        // Return audio information
        $this->returnInformation();

    }

    public function checkFormat() {

        // Get file extension
        $this->extension = pathinfo($this->data['name'])['extension'];

        // Check file extension
        if(!in_array($this->extension, self::AUDIO_EXTENSIONS))
            new UserEvents(40);  // Unsupported audio format

        // Get file MIME type
        $formatType = mime_content_type($this->data['tmp_name']);

        // Check format type
        if(!in_array($formatType, self::AUDIO_MIME[$this->extension]))
            new UserEvents(40);  // Unsupported audio format

    }

    public function saveAudio() {

        // Create new audio path and name
        $additionPre = '(';
        $additionPost = ')';
        $additionContent = 1;

        $name = pathinfo($this->data['name'], PATHINFO_FILENAME);
        $destination = 'app/Data/Files/Sounds/' . $name . '.' . $this->extension;

        while(file_exists($destination)) {
            $addition = $additionPre . $additionContent . $additionPost;
            $destination = 'app/Data/Files/Sounds/' . $name . ' ' . $addition . '.' . $this->extension;
            ++$additionContent;
        }

        // Move and save audio
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