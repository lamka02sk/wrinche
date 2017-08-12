function ComponentsModule() {

    this.modulesCache = {};
    this.components   = [];
    this.modules      = {};

    /*
     * EVENT HANDLING
     */

    /**
     * Initialize event on defined elements
     * @param eventData
     */
    this.initializeEvent = function(eventData) {

        let eventList = eventData.event.trim().split(' ');

        // Multiple elements bound to event
        if(eventData.element[0] !== undefined)

            for(let element = 0; element < eventData.element.length; ++element)
                for(let event = 0; event < eventList.length; ++event)
                    eventData.element[element].addEventListener(eventList[event], eventData.content);

        // Single element bound to event
        else

            for(let i = 0; i < eventList.length; ++i)
                eventData.element.addEventListener(eventList[i], eventData.content);

    };

    /**
     * Initialize multiple events on defined elements
     * @type {function(this:ComponentsModule)}
     */
    this.initializeEvents = function(events) {

        for(let eventData = 0; eventData < events.length; ++eventData)
            componentsModule.initializeEvent(events[eventData]);

    };

    /*
     * COMPONENT INITIALIZATION
     */

    /**
     * Downloads and saves components to make them reusable
     * @param component
     */
    this.loadComponent = function(component) {

        componentsModule.modules[component] = {};

        let cache = componentsModule.modulesCache;
        if(!(component in cache))
            cache[component] = getFile('app/Components/Scripts/' + component + '.min.js');

        eval(cache[component]);

    };

    /**
     * Initialize single component with all events
     * @type {function(this:ComponentsModule)}
     */
    this.initializeComponent = function(component) {

        componentsModule.loadComponent(component);
        let componentData = componentsModule.modules[component];

        if(componentData.start)
            componentData.start();

        if(componentData.resume)
            componentData.resume();

        if(!componentData.events)
            return false;

        let eventsData = componentData.events;
        componentsModule.initializeEvents(eventsData);

    };

    /**
     * Initialize all components needed
     * @type {function(this:ComponentsModule)}
     */
    this.initializeComponents = function() {

        let componentsList = componentsModule.components;
        if(localStorage) {
            componentsModule.modulesCache = JSON.parse(localStorage.getItem('wrinche.componentsCache')) || {};
            componentsModule.checkComponentsIntegrity();
        }

        for(let component = 0; component < componentsList.length; ++component)
            componentsModule.initializeComponent(componentsList[component]);

        if(localStorage)
            localStorage.setItem('wrinche.componentsCache', JSON.stringify(componentsModule.modulesCache));

    };

    /**
     * Check integrity of the local components, remove invalid ones
     */
    this.checkComponentsIntegrity = function() {

        // Retrieve list of component hashes
        let componentHashes = getJson(URI + 'api/system.check.integrity.components&csrf_token=' + csrf_token).data;

        // Check all components in cache
        let generator, hash;
        for(let componentName in componentsModule.modulesCache) {

            generator = new jsSHA('SHA-256', 'TEXT');
            generator.update(componentsModule.modulesCache[componentName]);
            hash = generator.getHash('HEX');

            if(hash !== componentHashes[componentName])
                delete componentsModule.modulesCache[componentName];

        }

    };

    /**
     * Start the component system and prepare components for use
     * @type {function(this:ComponentsModule)}
     */
    this.start = function(components) {

        componentsModule.components = components;
        componentsModule.initializeComponents();
        componentsModule.resumeComponents();

    };

    /*
     * DATA MANIPULATION
     */

    /**
     * Validate data of all components
     * @type {function(this:ComponentsModule)}
     */
    this.validate = function() {

        for(let component = 0; component < componentsModule.components.length; ++component)
            if(!this.modules[componentsModule.components[component]].validate())
                return false;

        return true;

    };

    /**
     * Serialize data from all components
     * @type {function(this:ComponentsModule)}
     */
    this.serialize = function() {

        let result = {};
        for(let component = 0; component < componentsModule.components.length; ++component) {

            let componentName     = componentsModule.components[component];
            result[componentName] = componentsModule.modules[componentName].serialize();

        }

        return result;

    };

    /*
     * COMPONENT INSTANCES
     */

    /**
     * Create component element from template
     * @param componentName
     * @return {*}
     */
    this.createFromTemplate = function(componentName) {

        let templateElement = document.querySelector('#component_' + componentName + '_template');

        if(!templateElement)
            return false;

        return templateElement.children[0].cloneNode(true);

    };

    /**
     * Create new component instance
     * @type {function(this:ComponentsModule)}
     */
    this.createComponent = function(componentName) {

        let inlineElement = document.querySelector('div.content-builder-content');

        if(typeof inlineElement === 'undefined')
            return false;

        if(!(componentName in componentsModule.modules))
            return false;

        if(!("create" in componentsModule.modules[componentName]))
            return false;

        let template = componentsModule.createFromTemplate(componentName);

        if(!template)
            return false;

        let identifier = +new Date();
        template.setAttribute('data-id', identifier);

        componentsModule.modules[componentName].create(identifier, template);
        componentsModule.registerEvents(componentName, identifier, template);
        inlineElement.appendChild(template);

        if('onCreate' in componentsModule.modules[componentName])
            componentsModule.modules[componentName].onCreate(identifier);

    };

    /**
     * Register default events for new component instance
     * @type {function(this:ComponentsModule)}
     */
    this.registerEvents = function(name, identifier, parentElement, data) {

        let headerElement  = parentElement.querySelector('div.component-element-header');
        let contentElement = parentElement.querySelector('div.component-element-content');
        let titleElement   = headerElement.children[1];
        let titleDefault   = titleElement.innerText;

        if(data && data.title !== '')
            titleElement.innerText = data.title.trim();

        // Delegate default events
        componentsModule.initializeEvents([

            {
                event  : 'click',
                element: headerElement,
                content: function(event) {

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
                        componentsModule.modules[name].data[identifier].disabled ^= true;
                    }

                    // Remove component instance
                    else if(element.matches('.component-inline-remove')) {

                        let componentName = headerElement.querySelector('.component-inline-label').innerText.trim();
                        let actionText    = translate.locale.response['ACTION_CONFIRM_REMOVE_COMPONENT'].replace('%component%', componentName);

                        confirmAction(actionText, function() {
                            parentElement.parentNode.removeChild(parentElement);
                            delete componentsModule.modules[name].data[identifier];
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
                content: function(event) {
                    componentsModule.modules[name].data[identifier].title = event.target.innerText.trim();
                }
            }

        ]);

        if(data && data.disabled !== 0)
            triggerEvent(headerElement.querySelector('.component-inline-disable'), 'click');

    };
    
    /*
     * RESUME MULTI INSTANCE COMPONENTS
     */

    /**
     * Resume multi instance components into content element
     */
    this.resumeComponents = function() {

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
        componentsModule.components.forEach(function(componentName) {

            let template = componentsModule.createFromTemplate(componentName);

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

            componentsModule.components.some(function(componentName) {

                if(
                    !componentsResumeData[componentName] ||
                    !componentsResumeData[componentName].template ||
                    !componentsResumeData[componentName].resume ||
                    !componentsResumeData[componentName].resume[componentID]
                )
                    return false;

                let current = componentsModule.modules[componentName];
                const data = componentsResumeData[componentName];
                let template = data.template.cloneNode(true);
                const resumeData = data.resume[componentID];

                template.setAttribute('data-id', componentID);

                if(!current.resumeInline)
                    return false;

                current.resumeInline(componentID, template, resumeData);
                componentsModule.registerEvents(componentName, componentID, template, resumeData);
                contentElement.appendChild(template);

                if(current.onCreate)
                    current.onCreate(componentID);

                return true;

            });

        });

    };

}

let componentsModule = new ComponentsModule();