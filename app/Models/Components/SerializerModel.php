<?php

namespace App\Models\Components;

use App\Helpers\ComponentsHelper;
use App\Models\ComponentsModel;

class SerializerModel extends ComponentsModel {

    public $input;
    public static $dataPrototypes = [];

    // Serialized data
    public $result = [];

    /**
     * SerializerModel constructor.
     * @param array $componentsData
     * @param array $componentsOrder
     */
    public function __construct(array $componentsData, array $componentsOrder) {

        parent::__construct('');
        $this->input = $componentsData;

        // Start serialization
        $this->serialize();

        // Create JSON from content components
        $this->result['articles_content']['content']['_order_'] = $componentsOrder;
        $this->result['articles_content']['content'] = json_encode($this->result['articles_content']['content'] ?? null);

    }

    /**
     * Initialize components serialization process
     */
    public function serialize() {

        $this->extractData();
        $this->loopComponents();

    }

    /**
     * Extract components' data prototypes from component templates
     */
    public function extractData() {
        foreach(parent::$components as $componentName => $componentTemplate)
            self::$dataPrototypes[$componentName] = $componentTemplate['data'] ?? [];
    }

    /**
     * Loop through all components in input
     */
    public function loopComponents() {
        foreach($this->input as $componentName => $componentData)
            $this->serializeComponent($componentName, $componentData);
    }

    /**
     * @param string $componentName
     * @param array  $componentData
     * Detect serialization type for current component
     */
    public function serializeComponent(string $componentName, array $componentData) {

        $componentPrototype = self::$dataPrototypes[$componentName];

        // If component is multi-instance one or simple component
        if(isset($componentPrototype['group']))
            $this->serializeMultiComponent($componentName, $componentData, $componentPrototype);
        else
            $this->serializeSimpleComponent($componentData, $componentPrototype);

    }

    public function serializeSimpleComponent(array $componentData, array $componentPrototype) {

        foreach($componentPrototype as $property => $propertyPrototype) {

            $properties = explode('&', $property);

            $dataArray = [];
            foreach($properties as $prop) {
                if(!isset($componentData[$prop])) break;
                $dataArray[] = $componentData[$prop];
            }

            $processed = $this->processData($propertyPrototype, $dataArray);
            $this->saveData($processed, $propertyPrototype[0]);

        }

    }

    public function serializeMultiComponent(string $componentName, array $componentData, array $componentPrototype) {

        if(!isset($this->result['articles_content']['content']))
            $this->result['articles_content']['content'] = [];

        $componentGroup = [];
        foreach($componentData as $instanceID => $instanceData) {

            $instanceGroup = [];
            foreach($componentPrototype['group'] as $property) {

                $propertyValue = $instanceData[$property] ?? false;

                if(($componentPrototype[$property] ?? false) !== false) {

                    // Extract action
                    $inputAction = explode('|', $componentPrototype[$property])[0];
                    $inputAction = explode('.', $inputAction);
                    $actionName = $inputAction[0];
                    $actionMethod = $inputAction[1] ?? false;

                    // Process action
                    if($actionMethod !== false) {

                        if($actionName === 'componentsHelper') {
                            $helper = new ComponentsHelper;
                            $propertyValue = $helper->{$actionMethod}($propertyValue);
                        }

                    }

                } else if($property === 'disabled')
                    $propertyValue = (int)$propertyValue;

                $instanceGroup[] = $propertyValue;

            }

            $componentGroup[$instanceID] = $instanceGroup;

        }

        $this->result['articles_content']['content'][$componentName] = $componentGroup;

    }

    public function processData(array $propertyPrototype, array $dataArray) {

        $count = count($dataArray);

        // Extract processing data
        $instructions = $propertyPrototype[1] ?? false;

        // Data are being saved in raw format
        if($instructions === false)
            return $this->returnByCount($dataArray, $count);

        // Extract input processing data
        $inputInstructions = explode('|', $instructions)[0];

        if(empty($inputInstructions) || $inputInstructions === false)
            return $this->returnByCount($dataArray, $count);

        // Extract processing controller and method
        $inputInstructions = explode('&', $inputInstructions);
        $dataArray = $this->processAllMethods($inputInstructions, $dataArray, $count);

        return $this->returnByCount($dataArray, $count);

    }

    public function returnByCount($data, $count) {

        if($count === 1)
            return $data[0];
        else
            return $data;

    }

    public function processAllMethods($methods, $data, $count) {

        foreach($methods as $method) {

            $method = explode('.', $method);
            $controller = $method[0];
            $method = $method[1] ?? false;

            if($controller === false || $method === false)
                return $this->returnByCount($data, $count);

            $data = $this->processSingleMethod($controller, $method, $data, $count);

        }

        return $data;

    }

    public function processSingleMethod($controller, $method, $data, $count) {

        // Process data
        switch($controller) {
            case 'componentsHelper':

                $processor = new ComponentsHelper;
                if($count === 1)
                    $data[0] = $processor->{$method}($data[0]);
                else
                    $data = $processor->{$method}($data);

                break;
            default:
                return $this->returnByCount($data, $count);
                break;
        }

        return $data;

    }

    public function saveData($data, string $instructions) {

        $instructions = explode('.', $instructions);
        $table = $instructions[0];
        $column = $instructions[1] ?? false;

        if($column === false) {
            $this->result[$table] = $data;
            return true;
        }

        $this->result[$table][$column] = $data;
        return true;

    }

}