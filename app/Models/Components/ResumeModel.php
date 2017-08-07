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
        
            // TODO ...
        
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
    
}