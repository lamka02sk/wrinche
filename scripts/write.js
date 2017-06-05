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
sortable = Sortable.create(document.querySelector('div.content-builder-content'), {
    sort: true,
    animation: 200,
    scroll: true,
    draggable: '.component-element',
    handle: '.component-inline-drag'
});

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