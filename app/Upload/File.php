<?php

namespace App\Upload;

use App\Errors\UserEvents;

class File extends Main {

    public function __construct(array $metadata) {

        // Save file metadata
        $this->data = $metadata;

        // Check if file format is supported
        $this->checkFormat();

        // Save file
        $this->saveFile();

        // Return file information
        $this->returnInformation();

    }

    public function checkFormat() {

        // Get file extension
        $this->extension = pathinfo($this->data['name'])['extension'];

        // Check file extension
        if(!in_array($this->extension, self::FILE_EXTENSIONS))
            new UserEvents(50);  // Unsupported file format

        // Get file MIME type
        $formatType = mime_content_type($this->data['tmp_name']);

        // Check format type
        if(!in_array($formatType, self::FILE_MIME[$this->extension]))
            new UserEvents(50);  // Unsupported file format

    }

    public function saveFile() {

        // Create new file path and name
        $additionPre = '(';
        $additionPost = ')';
        $additionContent = 1;

        $name = pathinfo($this->data['name'], PATHINFO_FILENAME);
        $destination = 'app/Data/Files/Files/' . $name . '.' . $this->extension;

        while(file_exists($destination)) {
            $addition = $additionPre . $additionContent . $additionPost;
            $destination = 'app/Data/Files/Files/' . $name . ' ' . $addition . '.' . $this->extension;
            ++$additionContent;
        }

        // Move and save file
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