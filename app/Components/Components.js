function ComponentsModule() {

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

    this.initializeComponent = function(component) {
        if(!(component in this.modules)) return false;
        component = this.modules[component];
        if(component.start) component.start();
        if(!component.events) return false;
        let events = component.events;
        for(let i = 0; i < events.length; ++i)
            this.initializeEvent(events[i]);
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

}

let componentsModule = new ComponentsModule();