<?php

namespace App\Models\Components;

use App\Helpers\ComponentsHelper;
use App\Models\ComponentsModel;

class ResumeModel extends ComponentsModel {
    
    public $dataToResume;

    public function __construct(array $resumeData) {
        
        parent::__construct('');
        
        $this->dataToResume = $resumeData;
        $this->dataToResume['articles_content']['content'] = json_decode($this->dataToResume['articles_content']['content'], true);
        self::$resumedData['_order_'] = json_encode($this->dataToResume['articles_content']['content']['_order_']);
        
        $this->resumeComponents();
    
    }
    
    public function resumeComponents() {
    
        foreach(self::$componentsList as $componentCategory)
            foreach($componentCategory as $componentName)
                $this->resumeComponent($componentName);
    
    }
    
    public function resumeComponent(string $componentName) {
    
        $componentDataPrototype = self::$components[$componentName]['data'] ?? [];
        
        if(empty($componentDataPrototype))
            return true;
        
        if(isset($componentDataPrototype['group'])) {
        
            if(!isset($this->dataToResume['articles_content']['content'][$componentName]))
                return true;
            
            $resumedData = json_encode(
                $this->extractInlineComponentData($componentDataPrototype, $componentName)
            );
            
            self::$resumedData[$componentName] = $resumedData;
        
        } else {
            
            $resumedData = json_encode($this->extractComponentData($componentDataPrototype));
            self::$resumedData[$componentName] = $resumedData;
            
        }
        
        return true;
        
    }
    
    public function extractComponentData(array $componentDataPrototype) {
        
        $resultData = [];
    
        foreach($componentDataPrototype as $propertyName => $propertyData) {
        
            $propertyLocation = $propertyData[0] ?? false;
            
            if($propertyLocation === false)
                continue;
            
            $propertyLocation = explode('.', $propertyLocation);
            $propertyLocationTable = $propertyLocation[0];
            $propertyLocationColumn = $propertyLocation[1] ?? false;
            
            if($propertyLocationColumn === false) {
                $resultData[$propertyName] = $this->dataToResume[$propertyLocationTable];
                continue;
            }
            
            $resultData[$propertyName] = $this->dataToResume[$propertyLocationTable][$propertyLocationColumn];
            
            $propertyProcess = $propertyData[1] ?? false;
            
            if($propertyProcess === false)
                continue;
            
            $propertyProcess = explode('|', $propertyProcess);
            $propertyProcess = (!isset($propertyProcess[1]) || $propertyProcess[1] === 'false') ? $propertyProcess[0] : $propertyProcess[1];
            $propertyProcess = explode('&', $propertyProcess);
            
            foreach($propertyProcess as $process) {
            
                $process = explode('.', $process);
                $processController = $process[0];
                
                if(empty($processController))
                    break;
                
                $processMethod = $process[1] ?? false;
                
                if($processMethod === false || empty($processMethod))
                    break;
                
                if($processController === 'componentsHelper') {
                
                    $processor = new ComponentsHelper;
                    $resultData[$propertyName] = $processor->{$processMethod}($resultData[$propertyName]);
                
                }
            
            }
            
            $propertyArray = explode('&', $propertyName);
            $propertyArrayCount = count($propertyArray);
            if($propertyArrayCount < 2)
                continue;
    
            $processedData = $resultData[$propertyName];
            $propertyDataCount = count($processedData);
            
            // 01 === 10 fix
            if($propertyArrayCount > $propertyDataCount) {
            
                $difference = $propertyArrayCount - $propertyDataCount;
                
                for($i = 0; $i < $difference; ++$i)
                    $processedData[] = 0;
                
                $processedData = array_reverse($processedData);
            
            }
    
            unset($resultData[$propertyName]);
            
            foreach($propertyArray as $key => $property) {
            
                if(!isset($processedData[$key]))
                    break;
                
                $resultData[$property] = $processedData[$key];
            
            }
        
        }
        
        return $resultData;
    
    }
    
    public function extractInlineComponentData(array $componentDataPrototype, string $componentName) {
    
        $componentData = $this->dataToResume['articles_content']['content'][$componentName];
        
        foreach($componentData as $instanceID => $instanceData) {
        
            $instanceData = $this->unGroupData($componentDataPrototype['group'], $instanceData);
            
            foreach($instanceData as $propertyName => $propertyValue) {
                
                if(!isset($componentDataPrototype[$propertyName]))
                    continue;
                
                $instanceData[$propertyName] = $this->processInlineData(
                    $componentDataPrototype[$propertyName],$propertyValue
                );
            
            }
            
            $componentData[$instanceID] = $instanceData;
            
        }
        
        return $componentData;
    
    }
    
    public function unGroupData($group, $data) {
    
        return array_combine($group, $data);
    
    }
    
    public function processInlineData($propertyPrototype, $propertyValue) {
        
        $processor = new ComponentsHelper;
    
        // Extract process data
        $propertyPrototype = explode('|', $propertyPrototype);
        $processData = $propertyPrototype[1] ?? '';
        
        if(empty($processData))
            $processData = $propertyPrototype[0];
        
        $processData = explode('&', $processData);
        
        foreach($processData as $processInstruction) {
        
            if(empty($processInstruction) || $processInstruction === false)
                continue;
            
            $processInstruction = explode('.', $processInstruction);
            
            if(!isset($processInstruction[1]) || empty($processInstruction[0]) || empty($processInstruction[1]))
                continue;
            
            if($processInstruction[0] === 'componentsHelper')
                $propertyValue = $processor->{$processInstruction[1]}($propertyValue);
        
        }
        
        return $propertyValue;
    
    }
    
}