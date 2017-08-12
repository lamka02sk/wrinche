componentsModule.modules.gallery = {

    data: {},

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.gallery.data;
    },

    resumeInline: function(identifier, element, resumeData) {

        let current = componentsModule.modules.gallery;
        current.create(identifier, element);

        resumeData.gallery.forEach(function(image) {

            current.onSelect(identifier, element, image, true);

        });

    },

    validateInput: function(identifier, element, path, onSuccess) {

        if(!/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(path)) {
            showValidationResult(element, 'COMPONENT_URL_INVALID', false, $.noop);
            return false;
        }

        let promise = new Promise(function(resolve, reject) {
            let image     = new Image;
            image.onload  = function() {
                resolve(true);
            };
            image.onerror = function() {
                resolve(false);
            };
            image.src     = path;
        });

        promise.then(function(result) {

            if(result) {
                showValidationResult(element, '', true, $.noop);
                if(onSuccess) onSuccess(identifier, element, path, true);
                return true;
            }

            showValidationResult(element, 'COMPONENT_URL_INVALID', false, $.noop);

        });

    },

    onSelect: function(identifier, element, path, outside) {

        let current        = componentsModule.modules.gallery;
        let contentElement = element.querySelector('div.gallery-items');
        contentElement.classList.remove('no-padding');

        // Create source link
        if(!outside)
            path = 'app/Data/Files/Images/' + path;

        // Check gallery data
        if(current.data[identifier]) {

            if(~current.data[identifier].gallery.indexOf(path)) {

                closeMediaManager();
                return false;

            }

            current.data[identifier].gallery.push(path);

        } else
            current.data[identifier] = {
                title   : '',
                gallery : [path],
                disabled: 0
            };

        // Create template
        if(!current.templateElement)
            current.templateElement = element.querySelector('#template_component_gallery_item').children[0].cloneNode(true);

        let template = current.templateElement.cloneNode(true);

        template.setAttribute('data-path', path);
        template.classList.add('component-instance');

        template.children[0].children[0].setAttribute('src', path);
        template.children[0].children[0].setAttribute('alt', path);

        // Remove image
        template.children[1].addEventListener('click', function() {

            contentElement.removeChild(template);

            for(let i = 0; i < current.data[identifier].gallery.length; ++i) {

                if(current.data[identifier].gallery[i] === path)
                    current.data[identifier].gallery.splice(i, 1);

            }

        });

        // Show image
        contentElement.appendChild(template);

        // Hide Media manager
        if(!outside)
            document.querySelector('div.media-manager span.close-manager').click();

    },

    create: function(identifier, element) {

        let current = componentsModule.modules.gallery;

        componentsModule.initializeEvents([

            {
                // Open Media Manager
                event  : 'click',
                element: element.querySelector('button.inline-image_manager'),
                content: function() {

                    managerActiveInstance = new MediaManager({
                        manager: 'images',

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

                    if(event.keyCode && event.keyCode === 13) {

                        let path = event.target.value.trim();

                        current.validateInput(
                            identifier, element, path,
                            current.onSelect
                        );

                    }

                }
            },

            {
                // Validate image URL
                event  : 'change keyup',
                element: element.querySelector('input[name=component_inline_picture_input]'),
                content: function(event) {

                    current.validateInput(
                        identifier, element, event.target.value.trim()
                    );

                }
            }

        ]);

    }

};