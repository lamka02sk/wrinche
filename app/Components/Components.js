function ComponentsModule() {

    this.modulesCache = {};

    this.components = [];
    this.modules = {};

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

    this.initializeEvents = function(events) {
        for(let i = 0; i < events.length; ++i)
            this.initializeEvent(events[i]);
    }.bind(this);

    this.loadComponent = function(component) {
        if(!(component in componentsModule.modulesCache))
            componentsModule.modulesCache[component] = getFile('app/Components/Scripts/' + component + '.min.js');
        eval(componentsModule.modulesCache[component]);
    };

    this.initializeComponent = function(component) {
        componentsModule.modules[component] = {};
        this.loadComponent(component);
        component = this.modules[component];
        if(component.start) component.start();
        if(!component.events) return false;
        let events = component.events;
        this.initializeEvents(events);
    }.bind(this);

    this.initializeComponents = function() {
        for(let i = 0; i < this.components.length; ++i)
            this.initializeComponent(this.components[i]);
    }.bind(this);

    this.start = function(components) {
        this.components = components;
        this.initializeComponents();
    }.bind(this);

    this.serialize = function() {
        let result = {};
        for(let i = 0; i < this.components.length; ++i)
            result[this.components[i]] = this.modules[this.components[i]].serialize();
        return result;
    }.bind(this);

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

    this.registerEvents = function(name, identifier, element) {
        let headerElement = element.querySelector('div.component-element-header');
        let contentElement = element.querySelector('div.component-element-content');
        let removeElement = headerElement.children[3];
        let disableElement = headerElement.children[4];
        let collapseElement = headerElement.children[5];
        collapseElement.addEventListener('click', function() {
            contentElement.classList.toggle('hide');
        });
        disableElement.addEventListener('click', function() {
            element.classList.toggle('disabled');
            disableElement.classList.toggle('icon-off');
            this.modules[name].data[identifier].disabled ^= true;
        }.bind(this));
        removeElement.addEventListener('click', function() {
            element.parentNode.removeChild(element);
            delete this.modules[name].data[identifier];
        }.bind(this));
    }.bind(this);

}

let componentsModule = new ComponentsModule();