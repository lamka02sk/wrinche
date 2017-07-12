// Create componentsList
componentList = [];
selectors  = document.querySelectorAll('div.component-element');
for(let i = 0; i < selectors.length; ++i)
    componentList.push(selectors[i].getAttribute('data-component'));

if(typeof componentsModule === 'undefined') {
    let element = document.createElement('script');
    element.setAttribute('type', 'text/javascript');
    element.setAttribute('src', 'app/Components/Components.min.js');
    element.onload = function() {
        componentsModule.start(componentList);
    };
    body.appendChild(element);
} else {
    componentsModule.start(componentList);
}

// Add current script
previousScripts.push('write');

// Init counters
initializeCounters();

// Init password toggles
initializePasswordToggle();

// Init packery
packery = $('div.content-settings').packery({
    itemSelector: 'div.component-element',
    gutter: 22
});

// Init sortable
tmp = document.querySelector('div.content-builder-content');
if(tmp) {
    sortable = Sortable.create(tmp, {
        sort     : true,
        animation: 200,
        scroll   : true,
        draggable: '.component-element',
        handle   : '.component-inline-drag',
        onChoose : function() {
            let elements = document.querySelectorAll('div.component-placeholder');
            elements.forEach(function(element) {
                element.classList.remove('hide');
            });
        },
        onStart  : function(event) {
            let identifier = event.item.attributes['data-id'].value;
            if(CKEDITOR.instances['editor_' + identifier])
                CKEDITOR.instances['editor_' + identifier].destroy();
        },
        onEnd    : function(event) {
            let element    = event.item;
            let identifier = element.attributes['data-id'].value;
            let component  = element.attributes['data-component'].value;
            if(component in componentsModule.modules) {
                if('reload' in componentsModule.modules[component])
                    componentsModule.modules[component].reload(identifier);
            }
            let elements = document.querySelectorAll('div.component-placeholder');
            elements.forEach(function(element) {
                element.classList.add('hide');
            });
        }
    });
}
tmp = undefined;

/* Init CKEditor*/
/*ckedit = CKEDITOR.replace('component_inline_rich-text', {
    language: html.attr('lang'),
    uiColor: '#ffffff'
});*//*

ckedit.on('instanceReady', function() {
    packery.packery().reloadItems();
});

*/

// Collapse / Show All Settings
$('span.collapse-trigger').click(function(event) {
    event.target.parentNode.parentNode.parentNode.classList.toggle('open');
    packery.packery().reloadItems();
});

// Add inline component
document.querySelectorAll('div.builder-tools button.add-content').forEach(function(item) {
    item.addEventListener('click', function(event) {
        let component = event.target.getAttribute('data-content');
        componentsModule.createComponent(component);
    });
});

// Init Selector
selector = new Selector({
    selector: 'select.selector-search-select'
});

// Init date picker
initDatePicker();

// Remove Splash screen
$('div.splash').addClass('done');