componentsModule.modules.picture = {

    data: {},
    valid: {},

    showError: function(element, identifier) {
        let messageElement = element.querySelector('span.field-validation');
        messageElement.setAttribute('data-locale', 'COMPONENT_URL_INVALID');
        messageElement.innerText = translate.locale.components.COMPONENT_URL_INVALID;
        messageElement.classList.add('show');
        componentsModule.modules.picture.valid[identifier] = {
            valid: false
        };
    },

    hideError: function(element, identifier) {
        let messageElement = element.querySelector('span.field-validation');
        messageElement.classList.remove('show');
        componentsModule.modules.picture.valid[identifier] = {
            valid: true
        };
    },

    validateInput: function(element, identifier, input) {

        if(!/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(input)) {
            componentsModule.modules.picture.showError(element, identifier);
            return false;
        }
        let promise = new Promise(function(resolve, reject) {
            let image = new Image;
            image.onload = function() {
                resolve(true);
            };
            image.onerror = function() {
                resolve(false);
            };
            image.src = input;
        });
        promise.then(function(result) {
            if(result)
                componentsModule.modules.picture.hideError(element, identifier);
            else
                componentsModule.modules.picture.showError(element, identifier);

        });

    },

    remove: function(element) {

        element.querySelectorAll('div.component-instance').forEach(function(item) {
            item.querySelector('span.picture-remove').click();
        });

    },

    onSelect: function(identifier, element, path, outside) {

        let contentElement = element.querySelector('div.component-element-content');
        contentElement.classList.add('no-padding');

        // Remove current image
        componentsModule.modules.picture.remove(element);

        // Create source link
        if(!outside)
            path = 'app/Data/Files/Images/' + path;

        // Save image path
        componentsModule.modules.picture.data[identifier] = {
            title: '',
            picture: path,
            picture_description: '',
            picture_align: 1,
            valid: true,
            disabled: 0
        };

        // Create template
        let template = contentElement.querySelector('#template_component_content_picture_image').children[0].cloneNode(true);
        template.setAttribute('data-path', path);
        template.classList.add('component-instance');
        template.children[0].setAttribute('src', path);
        template.children[0].setAttribute('alt', path);
        contentElement.appendChild(template);

        // Hide media manager
        template.children[0].addEventListener('load', function() {
            contentElement.querySelector('div.input-box.select-image').classList.add('hide');
            document.querySelector('div.media-manager span.close-manager').click();
        });

        let alignOptions = template.children[3].querySelectorAll('span');
        componentsModule.initializeEvents([

            {
                // Serialize description
                event: 'change keyup',
                element: template.children[2],
                content: function(event) {
                    componentsModule.modules.picture.data[identifier].picture_description = event.target.value.trim();
                }
            },

            {
                // Align picture
                event: 'click',
                element: alignOptions,
                content: function(event) {
                    componentsModule.modules.picture.data[identifier].picture_align = +event.target.getAttribute('data-value');
                    alignOptions.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);

        // Remove image
        template.children[1].addEventListener('click', function() {
            contentElement.querySelector('div.input-box.select-image').classList.remove('hide');
            contentElement.removeChild(template);
            contentElement.classList.remove('no-padding');
            delete componentsModule.modules.picture.data[identifier];
        });

    },

    create: function(identifier, element) {
        componentsModule.initializeEvents([

            {
                // Open Media Manager
                event: 'click',
                element: element.querySelector('button.inline-image_manager'),
                content: function() {
                    managerActiveInstance = new MediaManager({
                        manager : 'images',
                        onSelect: function(path) {
                            componentsModule.modules.picture.onSelect(identifier, element, path, false);
                        }
                    });
                }
            },

            {
                // Enter custom URL to image
                event: 'keypress',
                element: element.querySelector('input[name=component_inline_picture_input]'),
                content: function(event) {
                    if(event.keyCode && event.keyCode === 13) {
                        let path = event.target.value;
                        componentsModule.modules.picture.validateInput(element, identifier, path);
                        if(componentsModule.modules.picture.valid[identifier].valid)
                            componentsModule.modules.picture.onSelect(identifier, element, path, true);
                    }
                }
            },

            {
                // Real-time URL validation
                event: 'change keyup',
                element: element.querySelector('input[name=component_inline_picture_input]'),
                content: function(event) {
                    componentsModule.modules.picture.validateInput(element, identifier, event.target.value);
                }
            }

        ]);
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.module.picture.data;
    }

};