/**
 * Loader constructor
 * @param parameters
 * @constructor
 */
function Loader(parameters) {

    // Variables
    this.previous = {
        link: '',
        target: 'content'
    };
    this.link = '';
    this.target = '';
    this.eventCounter = 0;

    // Loader default settings
    this.config = {
        domain: 'admin',
        csrf: '',
        root: '',
        targets: {
            content: 'body',
            subcontent: 'body',
            full: 'html'
        }
    };

    // Save given parameters
    this.parameters = parameters;

    // Apply given parameters
    this.applyParameters();

    // Run core
    this.core();

    // Callback
    if("callback" in this.config)
        this.config.callback(this.config.domain);

}

/**
 * Loader applyParameters Function
 * Save defined parameters to config
 */
Loader.prototype.applyParameters = function() {

    let allowedParameters = ['domain', 'callback', 'csrf', 'root', 'targets', 'onStart', 'onError', 'onDone'];
    for(let i in this.parameters) {
        if(allowedParameters.indexOf(i) === -1) continue;
        this.config[i] = this.parameters[i];
    }

};

/**
 * Loader core Function
 * Controls the entire instance and Loader events
 */
Loader.prototype.core = function() {

    // Create link events
    this.createEvents();

};

/**
 * Loader createEvents Function
 * Creates link events
 */
Loader.prototype.createEvents = function() {

    let links = document.querySelectorAll('[data-link]');
    for(let i = 0; i < links.length; ++i) {
        links[i].onclick = function() {
            if("onStart" in this.config)
                this.config.onStart();
            let link   = links[i].getAttribute('data-link');
            let target = links[i].getAttribute('data-target');
            this.executeEvent(link, target);
        }.bind(this);
        links[i].onmouseup = function(event) {
            if(event.which === 2) {
                if("onStart" in this.config)
                    this.config.onStart();
                let link   = links[i].getAttribute('data-link');
                this.executeEvent(link, 'blank');
                event.preventDefault();
            }
        }.bind(this);
    }

};

/**
 * Loader executeEvent Function
 * Controls flow of the fired link element events
 * @param link
 * @param target
 */
Loader.prototype.executeEvent = function(link, target) {

    // Save first state
    if(this.eventCounter === 0)
        this.saveCurrentState('', 'content');

    // Save event details
    this.link = link;
    this.target = target;

    if(this.target === 'blank') {
        this.openNewTab();
        this.config.onDone(false, this.link, true);
        return true;
    }

    // Load new content
    this.getContent();

};

/**
 * Loader openNewTab Function
 * Open link in the new tab
 */
Loader.prototype.openNewTab = function() {

    let newTab = window.open(this.config.root + this.link, '_blank');
    newTab.location;

};

/**
 * Loader saveCurrentState Function
 * Save first/default page state into browser history
 */
Loader.prototype.saveCurrentState = function(link, target) {

    let title = document.querySelector('title').getAttribute('data-locale');
    if(this.config.root.slice(-1) !== "/")
        this.config.root += '/';
    window.history.pushState({
        title: title,
        link: link,
        target: target
    }, '', this.config.root + link);
    ++this.eventCounter;

};

/**
 * Loader getContent Function
 * Get the new content for clicked link
 */
Loader.prototype.getContent = function() {

    let link = this.link;
    if(this.config.csrf !== '') {
        let csrf = document.querySelector('meta[name="' + this.config.csrf + '"]').getAttribute('content');
        link = this.config.root + this.link + '&' + this.config.csrf + '=' + csrf;
    }
    let url = link;
    let ajaxRequest = new XMLHttpRequest;
    ajaxRequest.onload = function() {
        this.handleContent(ajaxRequest);
    }.bind(this);
    ajaxRequest.open('GET', url);
    ajaxRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    ajaxRequest.send();

};

/**
 * Loader handleContent Function
 * Handle response content
 * @param response
 */
Loader.prototype.handleContent = function(response) {

    // Save response contents
    let status = response.status;
    let content = response.responseText;

    // Handle response by statuses
    if(status !== 200) {
        // onError
        if("onError" in this.config)
            this.config.onError(status);
    }

    // Handle response by content type
    try {
        let result = JSON.parse(content);
        // onError
        if("onError" in this.config)
            this.config.onError(result.code);
    } catch(error) {
        this.renderContent(content);
    }

};

/**
 * Loader renderContent Function
 * Render response content
 * @param content
 */
Loader.prototype.renderContent = function(content) {

    // Replaced element
    let element = document.querySelector(this.config.targets[this.target]);

    // Replace content
    element.remove();
    let body = document.querySelector('body');
    body.insertAdjacentHTML('beforeend', content);

    // Create window history event
    this.saveCurrentState(this.link, this.target);
    this.createEvents();

    // onDone
    if("onDone" in this.config)
        this.config.onDone(content, this.link, this.target);

};