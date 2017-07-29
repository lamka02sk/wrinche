function ComponentsModule() {

    // Keep modules in cache to not reload all modules all the time
    // TODO: Add localStorage cache
    this.modulesCache = {};

    this.components = [];
    this.modules = {};

    // Initialize any event, simply makes handling event in pure JS simpler :D
    this.initializeEvent = function(event) {
        let events = event.event.trim().split(' ');
        if(event.element[0] !== undefined) {
            for(let i = 0; i < event.element.length; ++i) {
                for(let j = 0; j < events.length; ++j)
                    event.element[i].addEventListener(events[j], event.content);
            }
        } else {
            for(let i = 0; i < events.length; ++i)
                event.element.addEventListener(events[i], event.content);
        }
    }.bind(this);

    // Initialize any event or more events, simply makes handling events in pure JS simpler :D
    this.initializeEvents = function(events) {
        for(let i = 0; i < events.length; ++i)
            this.initializeEvent(events[i]);
    }.bind(this);

    // If component does not exist on the client side, download it
    this.loadComponent = function(component) {
        if(!(component in componentsModule.modulesCache))
            componentsModule.modulesCache[component] = getFile('app/Components/Scripts/' + component + '.min.js');
        eval(componentsModule.modulesCache[component]);
    };

    // Initialize component
    this.initializeComponent = function(component) {
        componentsModule.modules[component] = {};
        this.loadComponent(component);
        component = this.modules[component];
        if(component.start) component.start();
        if(!component.events) return false;
        let events = component.events;
        this.initializeEvents(events);
    }.bind(this);

    // Initializes more components at once
    this.initializeComponents = function() {
        for(let i = 0; i < this.components.length; ++i)
            this.initializeComponent(this.components[i]);
    }.bind(this);

    // Starts the whole components system and makes it ready to use
    this.start = function(components) {
        this.components = components;
        this.initializeComponents();
    }.bind(this);

    // Validate components data to make sure any errors will appear on the server
    this.validate = function() {
        for(let i = 0; i < this.components.length; ++i)
            if(!this.modules[this.components[i]].validate())
                return false;
        return true;
    }.bind(this);

    // Serialize data from all components
    this.serialize = function() {
        let result = {};
        for(let i = 0; i < this.components.length; ++i)
            result[this.components[i]] = this.modules[this.components[i]].serialize();
        return result;
    }.bind(this);

    // Create new instance of component (if component supports multiple instances)
    this.createComponent = function(name) {
        let inlineElement = document.querySelector('div.content-builder div.content-builder-content');
        if(typeof inlineElement === 'undefined') return false;
        if(!(name in this.modules)) return false;
        if(!("create" in this.modules[name])) return false;
        let emptyElement = inlineElement.querySelector('p.empty');
        let templateElement = document.querySelector('component-template#component_' + name + '_template');
        if(typeof templateElement === 'undefined') return false;
        if(emptyElement !== null) inlineElement.removeChild(emptyElement);
        let template = templateElement.children[0].cloneNode(true);
        let identifier = +new Date();
        template.setAttribute('data-id', identifier);
        this.modules[name].create(identifier, template);
        this.registerEvents(name, identifier, template);
        inlineElement.appendChild(template);
        if('onCreate' in this.modules[name]) this.modules[name].onCreate(identifier);
    }.bind(this);

    // Register events for the "inline" components with multiple instances
    this.registerEvents = function(name, identifier, element) {
        let headerElement = element.querySelector('div.component-element-header');
        let contentElement = element.querySelector('div.component-element-content');
        let titleElement = headerElement.children[1];
        let titleDefault = titleElement.innerText;
        let removeElement = headerElement.children[3];
        let disableElement = headerElement.children[4];
        let collapseElement = headerElement.children[5];
        titleElement.addEventListener('click', function() {
            titleElement.focus();
            document.execCommand('selectAll', false, null);
        });
        titleElement.addEventListener('blur', function() {
            if(titleElement.innerText.trim() === '')
                titleElement.innerText = titleDefault;
        });
        titleElement.addEventListener('keypress', function(event) {
            if(event.keyCode === 13) {
                titleElement.blur();
                window.getSelection().removeAllRanges();
                event.preventDefault();
            }
        });
        titleElement.addEventListener('keyup', function(event) {
            this.modules[name].data[identifier].title = event.target.innerText.trim();
        }.bind(this));
        titleElement.addEventListener('change', function(event) {
            this.modules[name].data[identifier].title = event.target.innerText.trim();
        }.bind(this));
        titleElement.addEventListener('paste', function() {
            $('br, p', this).replaceWith(' ');
        });
        collapseElement.addEventListener('click', function() {
            contentElement.classList.toggle('hide');
        });
        disableElement.addEventListener('click', function() {
            element.classList.toggle('disabled');
            disableElement.classList.toggle('icon-off');
            this.modules[name].data[identifier].disabled ^= true;
        }.bind(this));
        removeElement.addEventListener('click', function() {
            let componentName = element.querySelector('div.component-element-header label').innerText.trim();
            let actionText = translate.locale.response['ACTION_CONFIRM_REMOVE_COMPONENT'].replace('%component%', componentName);
            confirmAction(actionText, function() {
                element.parentNode.removeChild(element);
                delete this.modules[name].data[identifier];
            }.bind(this));
        }.bind(this));
    }.bind(this);

}

let componentsModule = new ComponentsModule();