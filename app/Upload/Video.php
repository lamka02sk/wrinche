<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Video Manager
 * Version: 0.1.2
 * Authors: lamka02sk
 */

namespace App\Upload;

use App\Database\QueryBuilder;
use App\Errors\UserEvents;
use App\Helpers\Config;

class Video {

    public $data;
    public $extension;
    public $destination = '';

    public $supportedExtensions = [
        '3gp',
        'avi',
        'flv',
        'h264',
        'mkv',
        'm4v',
        'mov',
        'mp4',
        'mpeg',
        'ogv',
        'swf',
        'vob',
        'webm',
        'wmv'
    ];

    public $supportedFormats = [
        '3gp' => [
            'video/3gpp',
            'video/3gpp-tt'
        ],
        'avi' => [
            'video/avi',
            'video/msvideo',
            'video/x-msvideo',
            'video/vnd.avi'
        ],
        'flv' => [
            'video/x-flv',
            'video/mp4'
        ],
        'h264' => [
            'video/h264'
        ],
        'mkv' => [
            'video/x-matroska'
        ],
        'm4v' => [
            'video/mp4',
            'video/x-m4v'
        ],
        'mov' => [
            'video/quicktime'
        ],
        'mp4' => [
            'video/mp4'
        ],
        'mpeg' => [
            'video/mpeg'
        ],
        'ogv' => [
            'video/ogg'
        ],
        'swf' => [
            'video/x-flv',
            'video/mp4'
        ],
        'vob' => [
            'video/dvd',
            'video/mpeg',
            'video/x-ms-vob'
        ],
        'webm' => [
            'video/webm'
        ],
        'wmv' => [
            'video/x-ms-wmv'
        ]
    ];

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
        if(!in_array($this->extension, $this->supportedExtensions))
            new UserEvents(30);  // Unsupported video format

        // Get file MIME type
        $formatType = mime_content_type($this->data['tmp_name']);

        // Check format type
        if(!in_array($formatType, $this->supportedFormats[$this->extension]))
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