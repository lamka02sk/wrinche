<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Settings Model. Holds and Manages User Settings.
 * Version: 0.1
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Database\QueryBuilder;

class UserSettingsModel extends MainModel {

    public $settings = [];

    public function start() {

        // Load user's settings if logged in

    }

    public function createSettings($username, $language, $theme) {

        // Users ID
        $user = new UserModel;
        $user->prepareUserByUsername($username);
        $userID = $user->user['id'];

        // Parse theme
        $themes = $_SESSION['CONFIG']['system']['support']['themes'];

        $i = 0;
        foreach($themes as $themeName => $nothing) {
            if($theme === $themeName) {
                $theme = $i;
                break;
            }
            $i++;
        }

        // Parse language
        $languages = $_SESSION['CONFIG']['system']['support']['languages'];

        $i = 0;
        foreach($languages as $langName => $nothing) {
            if($language === $langName) {
                $language = $i;
                break;
            }
            $i++;
        }

        // Save the settings
        $query = new QueryBuilder;
        $query->queryCommands
            ->table('user_settings')
            ->insert()
            ->insertRow([[
                'user_id' => $userID,
                'language' => $language,
                'theme' => $theme
            ]])
            ->exec();

    }

}