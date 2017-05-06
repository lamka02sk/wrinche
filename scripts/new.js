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
                element: document.querySelector('textarea[name=new_category_description]'),
                content: function(event) {
                    this.description.data.text = event.target.value.trim();
                }.bind(this)
            }

        ]

    };

    // The Parent component
    this.parent = {

        start: function() {

            new Selector({
                selector: 'select[name=new_category_parent]',
                onSelect: function(currentInstance, clicked) {
                    this.parent.data.value = clicked.getAttribute('value');
                }.bind(this)
            })

        }.bind(this),

        data: {
            value: -1
        },

        validate: function() {
            return !(isNaN(this.parent.data.value));
        }.bind(this),

        serialize: function() {
            return this.parent.data.value;
        }.bind(this)

    };

    // The Thumbnail component
    this.thumbnail = {

        data: {
            path: ''
        },

        validate: function() {
            // Check if image is valid and loadable
            return true;
        }.bind(this),

        serialize: function() {
            return this.thumbnail.data.path;
        }.bind(this),

        addThumbnail: function(image, custom) {

            let parent = document.querySelector('label[for=category-thumbnail]').parentNode;

            // Current image remove
            if(parent.querySelector('div.header_image-image.category-image-instance'))
                parent.removeChild(parent.querySelector('div.header_image-image.category-image-instance'));

            // Create source link
            let source;
            if(!custom)
                source = 'app/Data/Files/Images/' + image;
            else
                source = image;

            // Create new image box from template
            let template = parent.querySelector('#template_new_category_thumbnail_image').children[0].cloneNode(true);
            template.setAttribute('data-path', image);
            template.classList.add('category-image-instance');
            template.children[0].setAttribute('src', source);
            template.children[0].setAttribute('alt', image);
            template.children[1].innerText = image;
            parent.appendChild(template);

            // Hide menu, manager and reload packery
            template.children[0].addEventListener('load', function() {
                parent.querySelector('div.input-box').classList.add('hide');
                $('div.media-manager span.close-manager').click();
                packery.packery().reloadItems();
            });

            // Remove event
            document.querySelector('div.header_image-image.category-image-instance span.header_image-remove').addEventListener('click', function() {
                this.thumbnail.data.path = '';
                let instance = parent.querySelector('div.category-image-instance');
                parent.querySelector('div.input-box').classList.remove('hide');
                parent.removeChild(instance);
                packery.packery().reloadItems();
            }.bind(this));

            // Save image path
            this.thumbnail.data.path = source;

        }.bind(this),

        events: [

            {
                // Image manager event
                event: "click",
                element: document.querySelector('label[for=category-thumbnail]').parentNode.querySelector('button.image_manager'),
                content: function() {

                    // Open manager
                    managerActiveInstance = new MediaManager({
                        onSelect: function(image) {

                            this.thumbnail.addThumbnail(image, false);

                        }.bind(this)
                    });

                }.bind(this)
            },

            {
                // Validate
                event: "change click keyup",
                element: document.querySelector('input[name=new_category_thumbnail_input]'),
                content: function(event) {

                    let input = event.target;
                    let value = input.value;

                    // Validate URL
                    if(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(value)) {

                        showValidationResult(input, "", true, function() {
                            packery.packery().reloadItems();
                        });

                        // Check ENTER key
                        if(event.keyCode && event.keyCode === 13) {

                            // Check if image exists
                            let testImage = new Image;
                            testImage.onload = function() {
                                this.thumbnail.addThumbnail(value, true);
                            }.bind(this);
                            testImage.onerror = function() {
                                showValidationResult(input, "VALIDATION_URL_UNRESOLVED", false, function() {
                                    packery.packery().reloadItems();
                                });
                            }.bind(this);
                            testImage.src = value;

                        }

                    } else
                        showValidationResult(input, "VALIDATION_URL_INVALID", false, function() {
                            packery.packery().reloadItems();
                        });

                }.bind(this)
            }

        ]

    };

    // The Visibility component
    this.visibility = {

        data: {
            value: true
        },

        validate: function() {
            return (typeof(this.visibility.data.value) === 'boolean');
        }.bind(this),

        serialize: function() {
            return this.visibility.data.value;
        }.bind(this),

        events: [

            {
                // Update data content
                event: 'change',
                element: document.querySelector('input[name=new_category_visibility]'),
                content: function(event) {
                    this.visibility.data.value = !!(event.target.checked);
                }.bind(this)
            }

        ]

    };

    // Initialize all events for components
    initializeComponentEvents(this);

    // Global validator
    this.validate = function() {

        for(let i = 0; i < this.components.length; ++i)
            if(!this[this.components[i]].validate()) return false;

        return true;

    }.bind(this);

    // Global serializer
    this.serialize = function() {

        let messageElement = document.querySelector('div.action-bar span.result-message');

        // If not valid, show error
        if(!this.validate()) {
            translate.addTranslation('validate');
            messageElement.classList.remove('success');
            messageElement.classList.add('error');
            messageElement.setAttribute('data-locale', 'EMPTY_INPUT');
            messageElement.innerText = translate.locale.validate['EMPTY_INPUT'];
            return false;
        } else {
            messageElement.classList.remove('success');
            messageElement.classList.remove('error');
            messageElement.setAttribute('data-locale', 'LOADING');
            messageElement.innerText = translate.locale.response['LOADING'];
        }

        let resultArray = {};
        for(let i = 0; i < this.components.length; ++i)
            resultArray[this.components[i]] = this[this.components[i]].serialize();

        return resultArray;

    }.bind(this);

}

// Tag COMPONENT
function Tag() {

    // List of category components
    this.components = ['title', 'url', 'description', 'visibility'];

    // The Title component
    this.title = {

        data: {
            value: ''
        },

        validate: function() {
            return (this.title.data.value.length < 101 && this.title.data.value.length > 0 && /^[a-zA-Z][a-zA-Z0-9_]+[a-zA-Z0-9]$/g.test(this.title.data.value));
        }.bind(this),

        serialize: function() {
            return this.title.data.value;
        }.bind(this),

        events: [

            {
                // Update data content
                event: 'change keyup',
                element: document.querySelector('input[name=new_tag_name]'),
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
                element: document.querySelector('input[name=new_tag_url]'),
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
                element: document.querySelector('textarea[name=new_tag_description]'),
                content: function(event) {
                    this.description.data.text = event.target.value.trim();
                }.bind(this)
            }

        ]

    };

    // The Visibility component
    this.visibility = {

        data: {
            value: true
        },

        validate: function() {
            return (typeof(this.visibility.data.value) === 'boolean');
        }.bind(this),

        serialize: function() {
            return this.visibility.data.value;
        }.bind(this),

        events: [

            {
                // Update data content
                event: 'change',
                element: document.querySelector('input[name=new_tag_visibility]'),
                content: function(event) {
                    this.visibility.data.value = !!(event.target.checked);
                }.bind(this)
            }

        ]

    };

    // Initialize all events for components
    initializeComponentEvents(this);

    // Global validator
    this.validate = function() {

        for(let i = 0; i < this.components.length; ++i)
            if(!this[this.components[i]].validate()) return false;

        return true;

    }.bind(this);

    // Global serializer
    this.serialize = function() {

        let messageElement = document.querySelector('div.action-bar span.result-message');

        // If not valid, show error
        if(!this.validate()) {
            translate.addTranslation('validate');
            messageElement.classList.remove('success');
            messageElement.classList.add('error');
            messageElement.setAttribute('data-locale', 'EMPTY_INPUT');
            messageElement.innerText = translate.locale.validate['EMPTY_INPUT'];
            return false;
        } else {
            messageElement.classList.remove('success');
            messageElement.classList.remove('error');
            messageElement.setAttribute('data-locale', 'LOADING');
            messageElement.innerText = translate.locale.response['LOADING'];
        }

        let resultArray = {};
        for(let i = 0; i < this.components.length; ++i)
            resultArray[this.components[i]] = this[this.components[i]].serialize();

        return resultArray;

    }.bind(this);

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
        element.on('change keyup click focusin', function() {
            let left = maxLen - element.val().trim().length;
            if(left < 0)
                current.addClass('minus');
            else if(current.hasClass('minus'))
                current.removeClass('minus');
            current.text(left);
        });
    } else {
        let element = $(this).parent().find('textarea');
        element.on('change keyup click focusin', function() {
            let left = maxLen - element.val().trim().length;
            if(left < 0)
                current.addClass('minus');
            else if(current.hasClass('minus'))
                current.removeClass('minus');
            current.text(left);
        });
    }
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

// Init packery
packery = $('div.content-content').packery({
    itemSelector: 'div.settings-component',
    gutter: 22
});

// Create new category/tag
document.querySelector('button.action-button.save-button').addEventListener('click', function() {
    let data = components.serialize();
    let messageElement = document.querySelector('div.action-bar span.result-message');
    if(data === false) return false;
    postData(URI + 'new/' + type[type.length - 1], data, function(response, type) {

        if(type === 'error') {
            messageElement.classList.remove('success');
            messageElement.classList.add('error');
            messageElement.setAttribute('data-locale', 'CONNECTION_ERROR');
            messageElement.innerText = translate.locale.response['CONNECTION_ERROR'];
        } else {
            response = JSON.parse(response);
            if(response.success) {
                messageElement.classList.add('success');
                messageElement.classList.remove('error');
                messageElement.setAttribute('data-locale', 'NEW_CREATED_SUCCESS');
                messageElement.innerText = translate.locale.admin_new['NEW_CREATED_SUCCESS'];
                setTimeout(function() {
                    window.history.back();
                }, 1000);
            } else {
                messageElement.classList.remove('success');
                messageElement.classList.add('error');
                if(response.code) {
                    messageElement.setAttribute('data-locale', response.code);
                    messageElement.innerText = translate.locale.response[response.code];
                } else {
                    messageElement.setAttribute('data-locale', 'NEW_CREATED_ERROR');
                    messageElement.innerText = translate.locale.admin_new['NEW_CREATED_ERROR'];
                }
            }
        }

    });
});

// Remove Splash screen
$('div.splash').addClass('done');