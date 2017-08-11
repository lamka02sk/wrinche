componentsModule.modules.picture = {

    data    : {},
    elements: {},

    start: function() {

        // Save elements
        let current             = componentsModule.modules.picture;
        current.templateElement = contentElement.querySelector('#template_component_content_picture_image').children[0];

    },

    resumeInline: function(identifier, element, resumeData) {

        let current = componentsModule.modules.picture;
        let path    = resumeData.picture;

        current.create(identifier, element);

        current.onSelect(identifier, element, path, true, function(description, align) {

            description.value = resumeData.picture_description.trim();
            triggerEvent(description, 'change');

            align[resumeData.picture_align].click();

        });

    },

    validateInput: function(path, identifier, onSuccess, onError) {

        console.log('validation');

        let current  = componentsModule.modules.picture;
        let elements = current.elements[identifier];

        if(!validateUrl(path))
            return showValidationResult(
                elements.messageBox, 'COMPONENT_URL_INVALID', false, reloadPackery
            );

        new Promise(function(resolve) {

            let image = new Image;

            image.onload = function() {
                resolve(true);
            };

            image.onerror = function() {
                resolve(false);
            };

            image.src = path;

        }).then(function(result) {

            if(result) {

                showValidationResult(
                    elements.messageBox, 'COMPONENT_URL_INVALID', true, reloadPackery
                );

                if(onSuccess)
                    onSuccess();

            } else {

                showValidationResult(
                    elements.messageBox, 'COMPONENT_URL_INVALID', false, reloadPackery
                );

                if(onError)
                    onError();

            }

        });

    },

    removeCurrent: function(element) {

        let instance = element.querySelector('div.component-instance span.picture-remove');

        if(instance)
            instance.click();

    },

    onSelect: function(identifier, element, path, outside, callback) {

        let current  = componentsModule.modules.picture;
        let elements = current.elements[identifier];

        elements.contentElement.classList.add('no-padding');

        // Remove current image
        current.removeCurrent(element);

        // Create source link
        if(!outside)
            path = 'app/Data/Files/Images/' + path;

        // Save image path
        current.data[identifier] = {
            title              : '',
            picture            : path,
            picture_description: '',
            picture_align      : 1,
            disabled           : 0
        };

        // Create template
        let template = current.templateElement.cloneNode(true);

        template.setAttribute('data-path', path);
        template.classList.add('component-instance');

        template.children[0].setAttribute('src', path);
        template.children[0].setAttribute('alt', path);

        elements.contentElement.appendChild(template);

        // Hide media manager
        template.children[0].addEventListener('load', function() {

            closeMediaManager();
            elements.inputBox.classList.add('hide');

        });

        let alignOptions = template.children[3].children;
        componentsModule.initializeEvents([

            {
                // Serialize description
                event  : 'change keyup',
                element: template.children[2],
                content: function(event) {

                    current.data[identifier].picture_description = event.target.value.trim();

                }
            },

            {
                // Align picture
                event  : 'click',
                element: alignOptions,
                content: function(event) {

                    current.data[identifier].picture_align = +event.target.getAttribute('data-value');

                    Object.values(alignOptions).forEach(function(item) {

                        item.classList.remove('active');

                    });

                    event.target.classList.add('active');

                }
            }

        ]);

        // Remove image
        template.children[1].addEventListener('click', function() {

            elements.inputBox.classList.remove('hide');
            elements.contentElement.removeChild(template);
            elements.contentElement.classList.remove('no-padding');

            delete current.data[identifier];

        });

        if(callback)
            callback(template.children[2], alignOptions);

    },

    create: function(identifier, element) {

        let current                  = componentsModule.modules.picture;
        current.elements[identifier] = {};

        let elements            = current.elements[identifier];
        elements.parentElement  = element;
        elements.contentElement = element.querySelector('div.component-element-content');
        elements.inputBox       = elements.contentElement.querySelector('div.input-box.select-image');
        elements.messageBox     = elements.inputBox.querySelector('.validate-message');

        componentsModule.initializeEvents([

            {
                // Open Media Manager
                event  : 'click',
                element: element.querySelector('button.inline-image_manager'),
                content: function() {

                    managerActiveInstance = new MediaManager({
                        manager : 'images',
                        onSelect: function(path) {

                            current.onSelect(identifier, element, path, false);

                        }
                    });

                }
            },

            {
                // Enter custom URL to image
                event  : 'keypress',
                element: element.querySelector('input[name=component_inline_picture_input]'),
                content: function(event) {

                    if(!event.keyCode || event.keyCode !== 13)
                        return false;

                    let path = event.target.value.trim();

                    current.validateInput(path, identifier, function() {

                        current.onSelect(identifier, element, path, true);

                    });

                }
            },

            {
                // Real-time URL validation
                event  : 'change keyup',
                element: element.querySelector('input[name=component_inline_picture_input]'),
                content: function(event) {

                    current.validateInput(event.target.value.trim(), identifier);

                }
            }

        ]);
    },

    validate: function() {

        return true;

    },

    serialize: function() {

        return componentsModule.modules.picture.data;

    }

};