<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Html Renderer. Renders HTML from given template array.
 * Version: 0.1.4
 * Authors: lamka02sk
 */

namespace App\Render;

class Html extends Main {

    public function __construct(array $template, $data) {

        // Execute parent constructor
        parent::__construct();

        // Save template
        $this->template = $template;
        $this->data = $data;

        // Render HTML
        $this->render();

    }

    public function render() {

        foreach($this->template as $element)
            $this->renderElement($element);

    }

    public function renderElement(array $element) {

        $elementName = $element['element'];
        $hasLabel = (isset($element['label']));
        $hasAttributes = (isset($element['attributes']) && !empty($element['attributes']));
        $hasChildren = (isset($element['children']) && !empty($element['children']));
        $hasChildrenTemplate =  (isset($element['children_template']) && !empty($element['children_template']));
        $hasContent = (isset($element['text']));

        // Create tagname
        $tagName = $elementName;
        $pair = false;
        if(substr($tagName, -1) === '>') {
            $tagName = substr($tagName, 0, -1);
            $pair = true;
        }

        if($tagName === 'template')
            $tagName = 'component-template';

        // Render tagname
        $render = '<' . $tagName;

        // Render attributes
        if($hasAttributes) {
            $attributes = $element['attributes'];
            $render .= ' ' . $this->renderAttributes($attributes);
        }

        // Render for attribute
        if($hasLabel)
            $render .= ' id="' . $element['label'] . '"';

        // End first tag half
        $render .= '>';

        // Check if tag is pair
        if($pair) {
            $this->output .= $render;
            return true;
        }

        // Check if tag has content
        if($hasContent)
            $render .= $element['text'];

        // Check if tag has children
        if($hasChildren) {
            $this->output .= $render;
            $render = '';
            foreach($element['children'] as $child)
                $this->renderElement($child);
        }

        // Check if children template is present
        if($hasChildrenTemplate) {
            $this->output .= $render;
            $render = '';
            $this->renderChildrenTemplate($element['children_template']);
        }

        // Close tag
        $render .= '</' . $tagName . '>';

        // Apply data
        foreach($this->data as $key => $value) {
            if($key === 'children_template') continue;
            $replace = '%' . $key . '%';
            $REPLACE = strtoupper($replace);
            $VALUE = str_replace('_', '-', strtoupper($value));
            $render = str_replace($replace, $value, $render);
            $render = str_replace($REPLACE, $VALUE, $render);
        }

        // Save
        $this->output .= $render;
        return true;

    }

    public function renderAttributes(array $attributes) {

        $result = '';
        foreach($attributes as $name => $value)
            $result .= $name . '="' . $value . '" ';

        return trim($result);

    }

    public function renderChildrenTemplate(array $template) {

        if(!isset($this->data['children_template'])) return false;
        foreach($this->data['children_template'] as $instance)
            $this->renderChildrenTemplateInstance($instance, $template);

        return true;

    }

    public function renderChildrenTemplateInstance(array $instance, array $template) {

        $html = '';
        foreach($template as $element)
            $html .= $this->renderChildrenTemplateInstanceElement($element);

        // Replace aliases
        foreach($instance as $key => $value) {
            $alias = '%' . $key . '%';
            $html = str_replace($alias, $value, $html);
        }

        $this->output .= $html;

    }

    public function renderChildrenTemplateInstanceElement(array $element) {

        $elementName = $element['element'];
        $hasAttributes = (isset($element['attributes']) && !empty($element['attributes']));
        $hasChildren = (isset($element['children']) && !empty($element['children']));
        $hasContent = (isset($element['text']));

        // Create tagname
        $tagName = $elementName;
        $pair = false;
        if(substr($tagName, -1) === '>') {
            $tagName = substr($tagName, 0, -1);
            $pair = true;
        }

        // Render tagname
        $render = '<' . $tagName;

        // Render attributes
        if($hasAttributes) {
            $attributes = $element['attributes'];
            $render .= ' ' . $this->renderAttributes($attributes);
        }

        // End first tag half
        $render .= '>';

        // Check if tag is pair
        if($pair) return $render;

        // Check if tag has content
        if($hasContent)
            $render .= $element['text'];

        // Check if tag has children
        if($hasChildren) {
            $this->output .= $render;
            $render = '';
            foreach($element['children'] as $child)
                $this->renderChildrenTemplateInstanceElement($child);
        }

        // Close tag and return
        $render .= '</' . $tagName . '>';
        return $render;

    }

}