<?php

namespace App\Controllers\Admin;

use App\Controllers\AdminController;
use App\Errors\UserEvents;
use App\Helpers\Browser;
use App\Helpers\Checker;
use App\Helpers\Config;
use App\Helpers\Generator;
use App\Helpers\Validator;
use App\Models\UserModel;
use App\Upload\Main as FileUploader;
use App\Upload\Image;
use DateTime;
use App\Helpers\Redirect;
use App\Helpers\Sanitizer;
use App\Models\ComponentsModel;
use App\Models\LoginModel;
use App\Models\UserSettingsModel;
use App\Requests\FormRequest;
use App\Requests\Request;
use App\Views\Admin as WriteView;

class SettingsController extends AdminController {

    // List of allowed settings
    const SETTINGS = [
        'appearance' => [
            'theme', 'language', 'first_day', 'date_format', 'time_format', 'number_format', 'timezone'
        ],
        'account' => [
            'username', 'email', 'nickname', 'first_name', 'last_name', 'website', 'public_name', 'bio', 'sessions', 'picture'
        ]
    ];

    // Settings Model
    public $model;

    // Checker instance
    public $checker;

    // Current input name
    public $currentInput;

    /**
     * SettingsController constructor.
     * Prepare write route for render
     * @param $subcategory
     */
    public function __construct($subcategory) {

        // Save subcategory
        $this->subcategory = $subcategory;

        // Execute the parent "constructor"
        $this->start();

        // Redirect if no subcategory
        if(empty($subcategory))
            Redirect::route('settings/appearance', Request::$method);

        // Detect get or post
        if(Request::$method === 'POST')
            $this->post();
        else
            $this->get();

    }

    public function get() {

        // Show Site
        $this->createView('Settings');

    }

    public function post() {

        $this->model = new UserSettingsModel;
        $userModel = new UserModel;
        $this->checker = new Checker;

        // Validate, sanitize and serialize input
        $this->saveInput();

        // Update settings
        $this->model->updateUserSettings();
        $userModel->updateUser();
        
        $result = [
            "success" => true,
            "code" => 200
        ];
        
        echo json_encode(array_merge($result, $this->results));

    }

    public function saveInput() {

        // Save forms data
        $forms = Request::$forms;
        unset($forms['csrf_token']);
        
        if(empty($forms) && !empty(Request::$files))
            $forms = Request::$files;

        foreach($forms as $name => $value) {
            
            if(!in_array($name, self::SETTINGS[$this->subcategory]))
                continue;
            
            $this->currentInput = $name;
            
            if(method_exists($this, 'input' . ucfirst($name)))
                $this->{'input' . ucfirst($name)}($value);
            else
                new UserEvents(11);  // Function undefined
            
        }

    }

    public function inputTheme(string $value) {

        if(!$this->checker->systemTheme($value))
            new UserEvents(4);  // Invalid Input

        $themeNumber = 0;
        foreach(Config::$file['system']['support']['themes'] as $key => $theme) {
            if($key === $value) break;
            ++$themeNumber;
        }

        UserSettingsModel::$settings['theme'] = $themeNumber;
        return true;

    }

    public function inputLanguage(string $value) {

        if(!$this->checker->systemLanguage($value))
            new UserEvents(4);  // Invalid Input

        $languageNumber = 0;
        foreach(Config::$file['system']['support']['languages'] as $key => $language) {
            if($key === $value) break;
            ++$languageNumber;
        }

        UserSettingsModel::$settings['language'] = $languageNumber;
        return true;

    }

    public function inputTimezone(int $value) {

        if(!$this->checker->systemTimezone($value))
            new UserEvents(4);  // Invalid Input

        UserSettingsModel::$settings['timezone'] = $value;
        return true;

    }

    public function inputFirst_day(int $value) {

        if($value < 0 || $value > 6)
            new UserEvents(4);  // Invalid Input

        UserSettingsModel::$settings['first_day'] = $value;
        return true;

    }

    public function inputDate_format(int $value) {
        $this->inputNumeric($value);
    }

    public function inputTime_format(int $value) {
        $this->inputNumeric($value);
    }

    public function inputNumber_format(int $value) {
        $this->inputNumeric($value);
    }
    
    public function inputPublic_name(int $value) {
        UserSettingsModel::$settings[$this->currentInput] = $value;
    }
    
    public function inputPicture($data) {
    
        $generator = new Generator;
        $hash = '_' . $generator->generateToken(8) . '.';
        $name = UserModel::$user['username'] . $hash . pathinfo($data['name'])['extension'];
        $path = 'app/Data/Files/Users/' . $name;
        
        $data['name'] = $name;
        new Image($data, 'profile');
        FileUploader::deleteFile(UserModel::$user['picture']);
        UserModel::$user['picture'] = $path;
        
        $this->results = [
            'picture' => $path
        ];
    
    }
    
    public function inputEmail($value) {
    
        if($value === UserModel::$user['email'])
            return true;
        
        $validator = new Validator;
        if(!$validator->validateEmail($value))
            new UserEvents(4);  // Invalid input
        
        $model = new UserModel;
        if(!$model->isEmail($value))
            new UserEvents(7);  // User with given e-mail already exists
        
        UserModel::$user['email'] = $value;
    
    }
    
    public function inputUsername($value) {
    
        if($value === UserModel::$user['username'])
            return true;
    
        $validator = new Validator;
        if(!$validator->validateUsername($value))
            new UserEvents(4);  // Invalid input
    
        $model = new UserModel;
        if(!$model->isUsername($value))
            new UserEvents(7);  // User with given username already exists
    
        UserModel::$user['username'] = $value;
        
    }
    
    public function inputNickname($value) {
    
        if($value === UserSettingsModel::$settings['nickname'])
            return true;
    
        $validator = new Validator;
        if(!$validator->validateNickname($value))
            new UserEvents(4);  // Invalid input
    
        $model = new UserSettingsModel;
        if(!$model->isNickname($value))
            new UserEvents(7);  // User with given username already exists
        
        UserSettingsModel::$settings['nickname'] = $value;
    
    }
    
    public function inputFirst_name($value) {
        UserSettingsModel::$settings['first_name'] = $value;
    }
    
    public function inputLast_name($value) {
        UserSettingsModel::$settings['last_name'] = $value;
    }
    
    public function inputWebsite($value) {
        UserSettingsModel::$settings['website'] = $value;
    }
    
    public function inputBio($value) {
        UserSettingsModel::$settings['bio'] = $value;
    }

    public function inputNumeric(int $value) {

        $number = 0;
        foreach(Config::$file['system']['support'][$this->currentInput . 's'] as $key => $content) {
            if($key == $value) break;
            ++$number;
        }

        UserSettingsModel::$settings[$this->currentInput] = $number;
        return true;

    }

    public function returnSessions() {

        $model = new LoginModel;
        $data = $model->returnSessions();
        $browser = new Browser;
        $timeFormat = Config::$file['system']['support']['date_formats'][UserSettingsModel::$settings['date_format']] . ' ' . Config::$file['system']['support']['time_formats'][UserSettingsModel::$settings['time_format']];

        // Process data
        $resultData = [];
        foreach($data as $session) {
            $browserInfo = $browser->getBrowser($session['ua']);
            $time = strtotime($session['updated']);
            $resultData[] = [
                'id' => $session['id'],
                'userID' =>  $session['user_id'],
                'IP' => $session['ip'],
                'browser' => $browserInfo['browser'] . ' ' . $browserInfo['version'],
                'OS' => $browserInfo['platform'],
                'lastUpdate' => date($timeFormat, $time),
                'views' => $session['inc']
            ];
        }

        return $resultData;

    }

}