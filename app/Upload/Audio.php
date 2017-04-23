<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Audio Manager
 * Version: 0.2.1
 * Authors: lamka02sk
 */

namespace App\Upload;

use App\Database\QueryBuilder;
use App\Errors\UserEvents;
use App\Helpers\Config;

class Audio {

    public $data;
    public $extension;
    public $destination = '';

    public $supportedExtensions = [
        'aac',
        'aiff',
        'flac',
        'm4a',
        'm4b',
        'midi',
        'mp3',
        'ogg',
        'wav',
        'webm',
        'wma'
    ];

    public $supportedFormats = [
        'aac' => [
            'audio/aac',
            'audio/aacp',
            'audio/3gpp',
            'audio/3gpp2',
            'audio/mp4',
            'audio/mp4a-latm',
            'audio/mpeg4-generic'
        ],
        'aiff' => [
            'audio/aiff',
            'audio/x-aiff'
        ],
        'flac' => [
            'audio/x-flac'
        ],
        'm4a' => [
            'audio/mp4'
        ],
        'm4b' => [
            'audio/x-m4b'
        ],
        'midi' => [
            'audio/midi',
            'audio/x-midi'
        ],
        'mp3' => [
            'audio/mpeg',
            'audio/mp3',
            'audio/MPA',
            'audio/mpa',
            'audio/mpa-robust'
        ],
        'ogg' => [
            'audio/ogg'
        ],
        'wav' => [
            'audio/vnd.wave',
            'audio/wav',
            'audio/wave',
            'audio/x-wav'
        ],
        'webm' => [
            'audio/webm'
        ],
        'wma' => [
            'audio/x-ms-wma'
        ]
    ];

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
        if(!in_array($this->extension, $this->supportedExtensions))
            new UserEvents(40);  // Unsupported audio format

        // Get file MIME type
        $formatType = mime_content_type($this->data['tmp_name']);

        // Check format type
        if(!in_array($formatType, $this->supportedFormats[$this->extension]))
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