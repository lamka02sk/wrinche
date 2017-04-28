// Category COMPONENT
function Category() {

    // List of category components
    this.components = ['title', 'url', 'description', 'parent', 'thumbnail', 'visibility'];

    // The Title component
    this.title = {

        data: {
            value: ''
        },

        validate: function() {
            return (this.title.data.value.length < 101 && this.title.data.value.length > 0);
        }.bind(this),

        serialize: function() {
            return this.title.data.value;
        }.bind(this),

        events: [

            {
                // Update data content
                event: 'change keyup',
                element: document.querySelector('input[name=new_category_name]'),
                content: function(event) {
                    this.title.data.value = event.target.value.trim();
                }.bind(this)
            }

        ]

    };

    // The Url component
    this.url = {

        data: {
            value: ''
        },

        validate: function() {
            if(this.url.data.value === '') return true;
            let url = (/^[a-z0-9][-a-z0-9]+[a-z0-9]$/.test(this.url.data.value));
            let len = (this.url.data.value.length < 121 && this.url.data.value.length > 2);
            return (url && len);
        }.bind(this),

        serialize: function() {
            return this.url.data.value;
        }.bind(this),

        events: [

            {
                // Update data content
                event: 'change keyup',
                element: document.querySelector('input[name=new_category_url]'),
                content: function(event) {
                    this.url.data.value = event.target.value.trim();
                }.bind(this)
            }

        ]

    };

    // The Description component
    this.description = {

        data: {
            text: ''
        },

        validate: function() {
            return (this.description.data.text.length < 200);
        }.bind(this),

        serialize: function() {
            return this.description.data.text;
        }.bind(this),

        events: [

            {
                // Update data content
                event: 'change keyup',
                element: document.querySelector('input[name=new_category_description]'),
                content: function(event) {
                    this.description.data.text = event.target.innerText.trim();
                }.bind(this)
            }

        ]

    };

    // The Parent component
    this.parent = {

        data: {
            value: ''
        },

        validate: function() {

        }.bind(this),

        serialize: function() {

        }.bind(this),

        events: [



        ]

    };

    // The Thumbnail component
    this.thumbnail = {

        data: {
            value: ''
        },

        validate: function() {

        }.bind(this),

        serialize: function() {

        }.bind(this),

        events: [



        ]

    };

    // The Visibility component
    this.visibility = {

        data: {
            value: ''
        },

        validate: function() {

        }.bind(this),

        serialize: function() {

        }.bind(this),

        events: [



        ]

    };

    // Initialize all events for components
    initializeComponentEvents(this);

    // Global validator
    this.validate = function() {

        // ...

    };

    // Global serializer
    this.serialize = function() {

        // ...

    };

}

// Component initializer
function initializeComponentEvents(reference) {

    for(let i = 0; i < reference.components.length; ++i) {
        if(!(reference.components[i] in reference)) continue;
        if(reference[reference.components[i]].start)
            reference[reference.components[i]].start();
        if(!reference[reference.components[i]]['events']) continue;
        // Initialize events
        for(let j = 0; j < reference[reference.components[i]]['events'].length; ++j) {
            let eventTemplate = reference[reference.components[i]]['events'][j];
            let eventList = eventTemplate.event.trim().split(' ');
            if(eventTemplate.element[0] !== undefined) {
                for(let k = 0; k < eventTemplate.element.length; ++k) {
                    let element = eventTemplate.element[k];
                    for(let l = 0; l < eventList.length; ++l)
                        element.addEventListener(eventList[l], eventTemplate.content);
                }
            } else {
                for(let k = 0; k < eventList.length; ++k)
                    eventTemplate.element.addEventListener(eventList[k], eventTemplate.content);
            }
        }
    }

}

// Add current script
previousScripts.push('new');

// Init counters
$('div.counter').each(function() {
    let maxLen = $(this).attr('data-maxLength');
    $(this).text(maxLen);
    let current = $(this);
    let type = $(this).attr('data-input');
    if(type === 'input') {
        let element = $(this).parent().find('input');
        element.on('change keydown keyup click focusout focusin', function() {
            let left = maxLen - element.val().trim().length;
            if(left < 0)
                current.addClass('minus');
            else if(current.hasClass('minus'))
                current.removeClass('minus');
            current.text(left);
        });
    } else {
        let element = $(this).parent().find('textarea');
        element.on('change keydown keyup click focusout focusin', function() {
            let left = maxLen - element.val().trim().length;
            if(left < 0)
                current.addClass('minus');
            else if(current.hasClass('minus'))
                current.removeClass('minus');
            current.text(left);
        });
    }
});

// Init Selector
selector = new Selector();

// Init packery
packery = $('div.content-content').packery({
    itemSelector: 'div.settings-component',
    gutter: 22
});

// Determine type of content
type = window.location.href.split('/');
for(let i = 0; i < type.length; ++i) {
    if(type[i] === '')
        type.splice(i, 1);
}
typeName = type[type.length - 1];
typeName = capitalizeFirstLetter(typeName);

// Execute component for current type
eval('components = new ' + typeName);

// Remove Splash screen
$('div.splash').addClass('done');