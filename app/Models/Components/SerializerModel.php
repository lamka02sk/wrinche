<?php

namespace App\Models\Components;

use App\Helpers\ComponentsHelper;
use App\Models\ComponentsModel;

class SerializerModel extends ComponentsModel {

    public $input;
    public static $dataPrototypes = [];

    // Data for articles table
    public $articlesData = [];

    // Data for articles_content table
    public $articles_contentData = [];

    /**
     * SerializerModel constructor.
     * @param array $componentsData
     */
    public function __construct(array $componentsData) {

        parent::__construct('');
        $this->input = $componentsData;

        // Start serialization
        $this->serialize();

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
            $this->serializeSimpleComponent($componentName, $componentData, $componentPrototype);

    }

    public function serializeSimpleComponent(string $componentName, array $componentData, array $componentPrototype) {

        foreach($componentPrototype as $property => $propertyPrototype) {

            $properties = explode('&', $property);

            $dataArray = [];
            foreach($properties as $prop) {
                if(!isset($componentData[$prop])) break;
                $dataArray[] = $componentData[$prop];
            }

            echo '-----' . $property . '-----';
            $processed = $this->processData($propertyPrototype, $dataArray);
            var_dump($processed);
            var_dump($propertyPrototype[0]);
            echo '************************************************************<br>';

        }

    }

    public function serializeMultiComponent(string $componentName, array $componentData, array $componentPrototype) {

        

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

}