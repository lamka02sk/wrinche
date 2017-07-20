<?php

namespace App\Upload;

use App\Helpers\Validator;

/**
 * Class FileChecker
 * @package App\Upload
 */
class FileChecker extends Main {

    /**
     * FileChecker constructor.
     * Does NOTHING.
     * @param array $metadata
     */
    public function __construct(array $metadata = []) { return null; }

    /**
     * @return null
     */
    public function checkFormat() { return null; }

    /**
     * @return null
     */
    public function returnInformation() { return null; }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * @param      $path
     * @param bool $outside
     * Check if given path or URI is valid image
     * @return bool
     */
    public function isImage($path, $outside = false) {
        if(!$outside)
            return $this->isLocalImage($path);
        else
            return $this->isExternalImage($path);
    }

    /**
     * @param $path
     * Check if given path is either local or external image
     * @return bool
     */
    public function isAnyImage($path) {
        return ($this->isLocalImage($path) || $this->isExternalImage($path));
    }

    /**
     * @param $path
     * Check if given path is valid image path
     * @return bool
     */
    public function isLocalImage($path) {

        $path = ROOT . '/' . $path;
        return (is_file($path));

    }

    /**
     * @param $path
     * Check if given URI is valid image URI
     * @return bool
     */
    public function isExternalImage($path) {

        $validator = new Validator;
        if(!$validator->validateUrl($path)) return false;

        // Get URL headers
        $headers = get_headers($path, 1);
        $contentType = $headers['Content-Type'] ?? '';

        if(is_array($contentType))
            $contentType = end($contentType);

        $valid = false;
        foreach(self::IMAGE_MIME as $extension) {
            if(in_array($contentType, $extension)) {
                $valid = true;
                break;
            }
        }

        return $valid;

    }

    /**
     * @param      $path
     * @param bool $outside
     * Check if given path or URI is valid video
     * @return bool
     */
    public function isVideo($path, $outside = false) {
        if(!$outside)
            return $this->isLocalVideo($path);
        else
            return $this->isExternalVideo($path);
    }

    /**
     * @param $path
     * Check if given path is either local or external video
     * @return bool
     */
    public function isAnyVideo($path) {
        return ($this->isLocalVideo($path) || $this->isExternalVideo($path));
    }

    /**
     * @param $path
     * Check if given path is valid video path
     * @return bool
     */
    public function isLocalVideo($path) {

        $path = ROOT . '/' . $path;
        return (is_file($path));

    }

    /**
     * @param $path
     * Check if given URI is valid video URI
     * @return bool
     */
    public function isExternalVideo($path) {

        $validator = new Validator;
        $youtube = ($validator->validateYouTubeUrl($path));
        $vimeo = ($validator->validateVimeoUrl($path));

        // Get URL headers
        $headers = get_headers($path, 1);
        $contentType = $headers['Content-Type'] ?? '';

        if(is_array($contentType))
            $contentType = end($contentType);

        $other = false;
        foreach(self::VIDEO_MIME as $extension) {
            if(in_array($contentType, $extension)) {
                $other = true;
                break;
            }
        }

        return ($youtube || $vimeo || $other);

    }

    /**
     * @param      $path
     * @param bool $outside
     * Check if given path or URI is valid audio
     * @return bool
     */
    public function isAudio($path, $outside = false) {
        if(!$outside)
            return $this->isLocalAudio($path);
        else
            return $this->isExternalAudio($path);
    }

    /**
     * @param $path
     * Check if given path is either local or external audio
     * @return bool
     */
    public function isAnyAudio($path) {
        return ($this->isLocalAudio($path) || $this->isExternalAudio($path));
    }

    /**
     * @param $path
     * Check if given path is valid audio path
     * @return bool
     */
    public function isLocalAudio($path) {

        $path = ROOT . '/' . $path;
        return (is_file($path));

    }

    /**
     * @param $path
     * Check if given URI is valid audio URI
     * @return bool
     */
    public function isExternalAudio($path) {

        $validator = new Validator;
        if(!$validator->validateUrl($path)) return false;

        // Get URL headers
        $headers = get_headers($path, 1);
        $contentType = $headers['Content-Type'] ?? '';

        if(is_array($contentType))
            $contentType = end($contentType);

        $valid = false;
        foreach(self::AUDIO_MIME as $extension) {
            if(in_array($contentType, $extension)) {
                $valid = true;
                break;
            }
        }

        return $valid;

    }

    /**
     * @param      $path
     * Check if given path is valid file
     * @return bool
     */
    public function isFile($path) {
        return $this->isLocalFile($path);
    }

    /**
     * @param $path
     * Check if given path is valid file path
     * @return bool
     */
    public function isLocalFile($path) {

        $path = ROOT . '/' . $path;
        return (is_file($path));

    }

    /**
     * @param      $path
     * @param      $outside
     * Check if given path is valid image, video, audio or file
     * @return bool
     */
    public function isMedium($path, $outside = false) {

        return (
            $this->isImage($path, $outside) ||
            $this->isVideo($path, $outside) ||
            $this->isAudio($path, $outside) ||
            $this->isFile($path)
        );

    }

    /**
     * @param $path
     * Check if given path is either local or external medium
     * @return bool
     */
    public function isAnyMedium($path) {
        return ($this->isMedium($path, true) || $this->isMedium($path);
    }

}