<?php

namespace App\Models\Components;

use App\Database\QueryBuilder;
use App\Helpers\Checker;
use App\Helpers\Validator;
use App\Models\ComponentsModel;
use App\Models\TemplateModel;
use App\Upload\FileChecker;

class ValidatorModel extends ComponentsModel {

    public $data;
    public $validData;
    public $valid;
    public $layoutName;
    public $layoutComponents;
    public $layoutContentComponents;

    const GLOBAL_OPTIONS = ['title', 'disabled'];
    const PROPERTY_OPTIONS = ['type', 'range', 'length', 'validate', 'check', 'checker', 'each'];

    public static $prototypes = [];
    public static $layout = [];

    public function __construct(string $layout) {

        parent::__construct('');
        $this->layoutName = $layout;

        // Load component prototypes
        if(empty(self::$prototypes)) {
            foreach(self::$components as $component)
                self::$prototypes[$component['name']] = $component['prototype'] ?? [];
        }

    }

    public function saveData(array $data) {

        $this->data = $data;
        $this->valid = true;

    }

    public function validateData() {

        // Save template layout components list
        $layout = TemplateModel::$template['layouts'][$this->layoutName];
        $this->layoutComponents = $layout['components'];
        $this->layoutContentComponents = $layout['_content_'];

        foreach($this->data as $componentName => $componentData) {
            if(!in_array($componentName, $this->layoutComponents) && !in_array($componentName, $this->layoutContentComponents))
                continue;
            echo $componentName . '---------------------------';
            if(!$this->validateComponent($componentName, $componentData)) {
                $this->valid = false;
                return false;
            }
        }

        return true;

    }

    private function validateComponent(string $component, $data) {

        if(in_array($component, $this->layoutComponents)) {
            if(!$this->validateSingleInstanceComponent(self::$prototypes[$component], $data))
                return false;
        } else {
            if(!$this->validateMultiInstanceComponent($component, $data))
                return false;
        }

        return true;

    }

    private function validateSingleInstanceComponent(array $prototype, $data) {

        // For each property
        foreach($data as $propertyName => $propertyData) {
            if(!isset($prototype[$propertyName]) && !isset(self::$globalPrototype[$propertyName])) return false;
            if(!$this->validateProperty(
                $prototype[$propertyName] ?? self::$globalPrototype[$propertyName],
                $propertyData)
            ) return false;
        }

        return true;

    }

    private function validateMultiInstanceComponent(string $component, $data) {

        $prototype = self::$prototypes[$component];
        foreach($data as $instanceID => $instanceData)
            if(!$this->validateSingleInstanceComponent($prototype, $instanceData)) return false;

        return true;

    }

    /*
     * Validation of component properties
     */
    private function validateProperty(array $prototype, $propertyData) {

        foreach($prototype as $option => $value) {

            // Validate children, use recursion
            if($option === 'children') {

                foreach($value as $name => $subprototype) {

                    if(!isset($propertyData[$name])) {
                        if($subprototype['optional']) continue;
                        return false;
                    }

                    if(!$this->validateProperty($subprototype, $propertyData[$name]))
                        return false;

                }

                continue;

            }

            if(!in_array($option, self::PROPERTY_OPTIONS) && !in_array($option, self::GLOBAL_OPTIONS))
                continue;

            if(!$this->{'property' . ucfirst($option)}($propertyData, $value))
                return false;

        }

        return true;

    }

    /*
     * Validation micro functions
     */
    private function propertyType($data, $correct) {

        $correctTypes = explode('|', $correct);
        $valid = [];

        foreach($correctTypes as $correctType) {

            if($correctType === 'boolean') {
                if($data !== 'true' && $data !== 'false')
                    $valid[] = false;
                else
                    $valid[] = true;
            } else {
                $type = gettype($data);
                if($type !== $correctType)
                    $valid[] = false;
                else
                    $valid[] = true;
            }

        }

        $valid = (in_array(true, $valid));
        return $valid;

    }

    private function propertyLength($data, $correct) {

        $correct = explode(',', $correct);
        $min = (int)$correct[0];
        $max = $correct[1] ?? false;
        $type = gettype($data);

        if($type === 'array')
            $length = count($data);
        else
            $length = strlen($data);

        if($max === false)
            return ($length === $min);
        else
            return ($length >= $min && $length <= (int)$max);

    }

    private function propertyRange($data, $correct) {

        $correct = explode(',', $correct);
        $low = $correct[0];
        $high = $correct[1];

        if($high === '*')
            return ((int)$data >= $low);
        else if($low === '*')
            return ((int)$data < $high);
        else if($high !== '*' && $low !== '*')
            return ((int)$data >= $low && (int)$data < $high);

        return true;

    }

    private function propertyValidate($data, $parameters) {

        if($parameters['source'] === 'validator') {
            if($data === '') return true;
            $validator = new Validator;
            return $validator->{$parameters['method']}($data);
        } else {
            return false;
        }

    }

    private function propertyCheck($data, $parameters) {

        if($parameters['source'] === 'database') {
            $builder = new QueryBuilder;
            $builder->queryCommands
                ->table($parameters['table'])
                ->select()
                ->count()
                ->where($parameters['column'], $data)
                ->exec();
            if($parameters['method'] === 'unique')
                return ((int)$builder->output[0]['count'] === 0);
            return ((int)$builder->output[0]['count'] !== 0);
        } else {
            return false;
        }

    }

    private function propertyChecker($data, $parameters) {

        $source = $parameters['source'];

        if($source === 'fileChecker') {
            $checker = new FileChecker;
            return $checker->{$parameters['method']}($data);
        } else if($source === 'systemChecker') {
            $checker = new Checker;
            return $checker->{$parameters['method']}($data);
        } else return false;

    }

    private function propertyEach($data, $parameters) {

        foreach($data as $content) {
            foreach($parameters as $method => $parameter)
                if(!$this->{'property' . ucfirst($method)}($content, $parameter)) return false;
        }

        return true;

    }

}