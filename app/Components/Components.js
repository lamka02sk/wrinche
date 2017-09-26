import Global from "../../scripts/Modules/Global";
import Utils from "../../scripts/Modules/Utils";

export default class {

    /*
     * COMPONENT INITIALIZATION
     */

    /**
     * Start the component system and prepare components for use
     */
    constructor(components) {

        this.components   = [];
        this.modules      = {};

        this.components = components;
        this.initializeComponents();
        this.resumeComponents();

    }

    /**
     * Initialize single component with all events
     */
    initializeComponent(component) {

        // Select component
        let componentData = require('./Scripts/' + component);

        if(componentData.start)
            componentData.start();

        if(componentData.resume)
            componentData.resume();

        this.modules[component] = componentData;

        if(!componentData.events)
            return false;

        let eventsData = componentData.events;
        Utils.registerEvents(eventsData);

    }

    /**
     * Initialize all components needed
     */
    initializeComponents() {

        this.components.forEach(component => this.initializeComponent(component));

    }

    /*
     * DATA MANIPULATION
     */

    /**
     * Validate data of all components
     */
    validate() {

        for(let component = 0; component < this.components.length; ++component)
            if(!this.modules[this.components[component]].validate())
                return false;

        return true;

    }

    /**
     * Serialize data from all components
     */
    serialize() {

        let result = {};

        this.components.forEach(component => {
            result[component] = this.modules[component].serialize();
        });

        return result;

    }

    /*
     * COMPONENT INSTANCES
     */

    /**
     * Create component element from template
     * @param componentName
     * @return {*}
     */
    createFromTemplate(componentName) {

        let templateElement = document.querySelector('#component_' + componentName + '_template');

        if(!templateElement)
            return false;

        return templateElement.children[0].cloneNode(true);

    }

    /**
     * Create new component instance
     */
    createComponent(componentName) {

        let inlineElement = document.querySelector('div.content-builder-content');

        if(typeof inlineElement === 'undefined')
            return false;

        if(!(componentName in this.modules))
            return false;

        if(!("create" in this.modules[componentName]))
            return false;

        let template = this.createFromTemplate(componentName);

        if(!template)
            return false;

        let identifier = +new Date();
        template.setAttribute('data-id', identifier);

        this.modules[componentName].create(identifier, template);
        this.registerEvents(componentName, identifier, template);
        inlineElement.appendChild(template);

        if('onCreate' in this.modules[componentName])
            this.modules[componentName].onCreate(identifier);

    }

    /**
     * Register default events for new component instance
     */
    registerEvents(name, identifier, parentElement, data) {

        let headerElement  = parentElement.querySelector('div.component-element-header');
        let contentElement = parentElement.querySelector('div.component-element-content');
        let titleElement   = headerElement.children[1];
        let titleDefault   = titleElement.innerText;

        if(data && data.title !== '')
            titleElement.innerText = data.title.trim();

        // Delegate default events
        Utils.registerEvents([

            {
                event  : 'click',
                element: headerElement,
                content: event => {

                    if(!event.target)
                        return false;

                    let element = event.target;

                    // Select component title and focus
                    if(element.matches('.component-inline-label')) {
                        element.focus();
                        document.execCommand('selectAll', false, null);
                    }

                    // Collapse / Show component content
                    else if(element.matches('.component-inline-collapse'))
                        contentElement.classList.toggle('hide');

                    // Disable / Enable component
                    else if(element.matches('.component-inline-disable')) {
                        parentElement.classList.toggle('disabled');
                        element.classList.toggle('icon-off');
                        this.modules[name].data[identifier].disabled ^= true;
                    }

                    // Remove component instance
                    else if(element.matches('.component-inline-remove')) {

                        let componentName = headerElement.querySelector('.component-inline-label').innerText.trim();
                        let actionText    = Global.translate.locale.response['ACTION_CONFIRM_REMOVE_COMPONENT'].replace('%component%', componentName);

                        Utils.confirmAction(actionText, () => {
                            parentElement.parentNode.removeChild(parentElement);
                            delete this.modules[name].data[identifier];
                        });

                    }

                }
            },

            {
                // Show placeholder when empty title
                event  : 'blur',
                element: titleElement,
                content: function() {
                    if(titleElement.innerText.trim() === '')
                        titleElement.innerText = titleDefault;
                }
            },

            {
                // Submit title on enter
                event  : 'keypress',
                element: titleElement,
                content: function(event) {

                    if(!event.keyCode || event.keyCode !== 13)
                        return false;

                    titleElement.blur();
                    window.getSelection().removeAllRanges();
                    event.preventDefault();

                }
            },

            {
                // Serialize component title
                event  : 'keyup change',
                element: titleElement,
                content: event => {
                    this.modules[name].data[identifier].title = event.target.innerText.trim();
                }
            }

        ]);

        if(data && data.disabled !== 0)
            Utils.triggerEvent(headerElement.querySelector('.component-inline-disable'), 'click');

    }
    
    /*
     * RESUME MULTI INSTANCE COMPONENTS
     */

    /**
     * Resume multi instance components into content element
     */
    resumeComponents() {

        // Get components order
        let contentElement = document.querySelector('[data-order]');
        
        if(!contentElement)
            return true;

        const json = contentElement.getAttribute('data-order');

        if(!json || json === '')
            return false;

        const order = JSON.parse(contentElement.getAttribute('data-order'));

        if(!order || order === '')
            return true;

        // Save resume data
        let componentsResumeData = {};
        this.components.forEach(function(componentName) {

            let template = this.createFromTemplate(componentName);

            if(!template)
                return false;

            const resumeData = template.getAttribute('data-resume');

            if(!resumeData)
                return false;

            componentsResumeData[componentName] = {
                template: template,
                resume: JSON.parse(resumeData)
            }

        });

        // Resume each component
        if(typeof order !== 'object')
            return true;

        order.forEach(function(componentID) {

            this.components.some(function(componentName) {

                if(
                    !componentsResumeData[componentName] ||
                    !componentsResumeData[componentName].template ||
                    !componentsResumeData[componentName].resume ||
                    !componentsResumeData[componentName].resume[componentID]
                )
                    return false;

                let current = this.modules[componentName];
                const data = componentsResumeData[componentName];
                let template = data.template.cloneNode(true);
                const resumeData = data.resume[componentID];

                template.setAttribute('data-id', componentID);

                if(!current.resumeInline)
                    return false;

                current.resumeInline(componentID, template, resumeData);
                this.registerEvents(componentName, componentID, template, resumeData);
                contentElement.appendChild(template);

                if(current.onCreate)
                    current.onCreate(componentID);

                return true;

            });

        });

    }

};