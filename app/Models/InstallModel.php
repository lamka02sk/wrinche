<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Installation model. Manages all user input.
 * Version: 0.4
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Helpers\Checker;
use App\Helpers\Config;
use App\Helpers\Generator;
use App\Helpers\Validator;
use App\Database\Connection;
use App\Requests\Request; // Used in migrations

class InstallModel extends MainModel {

    /**
     * @var array Stores user input from $_POST
     */
    public $installationData;

    /**
     * @var string Stores output for clients JS
     */
    public $output;

    /**
     * Initialize Installation Model and Installation Flow
     */
    public function start() {

        // Check installation data sent through $_POST array
        if(!isset(Request::$forms['installer'])) {

            // TODO: Create error

        }

        // Save installer data
        $this->installationData = Request::$forms['installer'];

        // Start validator
        $this->validateInput();

        // Start installation process
        $this->installSystem();

        // Return data for output
        return json_encode($this->output);

    }

    /**
     * Validates anything from user
     */
    public function validateInput() {

        $results = [];

        // Validate enviroment settings
        $checker = new Checker;
        $results[] = $checker->systemLanguage($this->installationData[1][0]['value']);
        $results[] = $checker->systemTimezone($this->installationData[1][1]['value']);
        $results[] = $checker->systemTheme($this->installationData[1][2]['value']);

        // Validate username
        $validator = new Validator;
        $results[] = $validator->validateUsername($this->installationData[2][0]['value']);

        // Validate e-mail
        $results[] = $validator->validateEmail($this->installationData[2][1]['value']);

        // Validate password
        $results[] = $validator->validatePassword($this->installationData[2][2]['value']);
        $results[] = ($this->installationData[2][2]['value'] === $this->installationData[2][3]['value']) ? true : false;

        // Validate DB connection
        $results[] = $checker->customConnection(
            $this->installationData[3][0]['value'],
            $this->installationData[3][1]['value'],
            $this->installationData[3][2]['value'],
            $this->installationData[3][3]['value']
        );

        // Validate website name
        $results[] = $validator->validateWebsiteName($this->installationData[4][0]['value']);

        // Validate website description
        $results[] = $validator->validateWebsiteDescription($this->installationData[4][1]['value']);

        // Validate website category
        $results[] = $checker->systemWebsiteCategory($this->installationData[4][2]['value']);

        // Validate EULA agree
        $results[] = (isset($this->installationData[4][3])) ? true : false;

        // FINAL CHECK!
        foreach($results as $result) {

            if(!$result) {

                // TODO: Create Error

            }

        }

    }

    /**
     * Install the system
     */
    public function installSystem() {

        // Save MySQL DB connection
        $connection = new ConnectionsModel;
        $connection->start()
            ->setConnection(
                $this->installationData[3][0]['value'],
                $this->installationData[3][1]['value'],
                $this->installationData[3][2]['value'],
                $this->installationData[3][3]['value']
            )
            ->addConnection()
            ->saveConnections();

        // Migrate Database tables
        require_once ROOT . '/app/Database/Migrations/Install.php';

        // Create admin user
        $user = new UserModel;
        $user->createUser(
            $this->installationData[2][0]['value'],
            $this->installationData[2][1]['value'],
            $this->installationData[2][2]['value'],
            1, // First user is admin unconditionally
            true // Data are valid
        );

        // Save user settings
        $settings = new UserSettingsModel;
        $settings->createSettings(
            $this->installationData[2][0]['value'],
            $this->installationData[1][0]['value'],
            $this->installationData[1][2]['value']
        );

        // Create administration URL and save
        $generator = new Generator;
        $link = $generator->generateAdministrationURI();
        Config::$file['system']['paths']['admin'] = $link;

        // Save website info
        $telemetry = 0;
        if(isset($this->installationData[4][4])) {
            $telemetry = 1;
        }

        $website = new WebsiteModel;
        $website->createWebsite(
            $this->installationData[4][0]['value'],
            $this->installationData[4][1]['value'],
            $this->installationData[4][2]['value'],
            $telemetry
        );

        // Change system status to installed and set timezone
        require ROOT . '/app/Config/timezones.php';
        $timezone = $timezones[$this->installationData[1][1]['value']];
        Config::$file['system']['locale']['timezone'] = $timezone;

        Config::$file['system']['installed'] = true;

        // Return data for installer
        $return = [
            'success' => true,
            'admin' => $link
        ];

        $this->output = $return;

    }

}