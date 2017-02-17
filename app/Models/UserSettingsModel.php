<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Settings Model. Holds and Manages User Settings.
 * Version: 0.1.1
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Database\QueryBuilder;
use App\Helpers\Config;

class UserSettingsModel extends MainModel {

    public $table = 'user_settings';

    public static $settings = [];

    public function start() {

        $this->prepareUserSettings();

    }

    public function updateUserSettings() {

        // TODO: Update users' settings with user model data

    }

    public function prepareUserSettings() {

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->select()
            ->selectValues()
            ->where('user_id', UserModel::$user['id'])
            ->exec();

        UserSettingsModel::$settings = $builder->output[0];

    }

    public function createSettings($username, $language = 0, $theme = 0) {

        // Users ID
        $user = new UserModel;
        $user->prepareUserByUsername($username);

        // Parse theme
        $themes = Config::$file['system']['support']['themes'];

        $i = 0;
        foreach($themes as $themeName => $nothing) {
            if($theme === $themeName) {
                $theme = $i;
                break;
            }
            $i++;
        }

        // Parse language
        $languages = Config::$file['system']['support']['languages'];

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
            ->table($this->table)
            ->insert()
            ->insertRow([[
                'user_id' => UserModel::$user['id'],
                'language' => $language,
                'theme' => $theme
            ]])
            ->exec();

    }

}