componentsModule.modules.header_image = {

    start: function() {

        // Save elements
        let current             = componentsModule.modules.header_image;
        current.parentElement   = document.querySelector('[data-component=header_image]');
        current.inputBox        = current.parentElement.querySelector('.input-box');
        current.mediaButton     = current.inputBox.querySelector('.image_manager');
        current.mediaInput      = current.inputBox.querySelector('input');
        current.messageElement  = current.inputBox.querySelector('.validate-message');
        current.templateElement = current.parentElement.querySelector('#template_component_header-image_image').childNodes[0];

        // Events
        componentsModule.initializeEvents([

            {
                // Delegate click events
                event  : 'click',
                element: current.parentElement,
                content: function(event) {

                    // Open MediaManager
                    if(event.target.matches('.image_manager')) {

                        managerActiveInstance = new MediaManager({
                            manager : 'images',
                            onSelect: function(path) {

                                current.addNew(path, false);

                            }
                        });

                    }

                    // Remove header image
                    else if(event.target.matches('.header_image-remove')) {

                        current.inputBox.classList.remove('hide');

                        current.parentElement.removeChild(
                            current.parentElement.querySelector('div.component-instance')
                        );

                        reloadPackery();

                    }

                }
            },

            {
                // Enter custom URL to image
                event  : 'keypress',
                element: current.mediaInput,
                content: function(event) {

                    if(!event.keyCode || event.keyCode !== 13)
                        return false;

                    let path = event.target.value.trim();

                    current.validateInput(path, function() {

                        current.addNew(path, true);

                    });

                }
            },

            {
                // Real-time URL validation
                event  : 'change keyup',
                element: current.mediaInput,
                content: function(event) {

                    current.validateInput(event.target.value.trim());

                }
            }

        ]);

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.header_image;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const headerImage = JSON.parse(data).header_image;

        if(headerImage === '')
            return true;

        current.addNew(headerImage, !(~headerImage.indexOf('app/Data/Files/Images/')));

    },

    removeCurrent: function(parent) {

        if(parent.querySelector('div.header_image-image.component-instance'))
            parent.removeChild(
                parent.querySelector('div.header_image-image.component-instance')
            );

    },

    // --------------------------------------------------------

    addNew: function(path, outside) {

        path = path.replace('app/Data/Files/Images/', '');

        let current  = componentsModule.modules.header_image;
        let text     = path;
        let template = current.templateElement.cloneNode(true);

        current.removeCurrent(current.parentElement);
        current.inputBox.value = '';

        if(!outside)
            path = 'app/Data/Files/Images/' + path;

        template.setAttribute('data-path', path);
        template.classList.add('component-instance');

        template.childNodes[0].setAttribute('src', path);
        template.childNodes[0].setAttribute('alt', path);

        template.childNodes[1].innerText = text;

        current.parentElement.appendChild(template);

        current.inputBox.classList.add('hide');
        closeMediaManager();
        reloadPackery();

    },

    // ---------------------------------------

    validateInput: function(path, onSuccess, onError) {

        let current = componentsModule.modules.header_image;

        if(!validateUrl(path))
            return showValidationResult(
                current.messageElement, 'COMPONENT_URL_INVALID', false, reloadPackery
            );

        new Promise(function(resolve) {

            let image = new Image;

            image.onload  = resolve(true);
            image.onerror = resolve(false);
            image.src     = path;

        }).then(function(result) {

            if(result) {

                showValidationResult(
                    current.messageElement, 'COMPONENT_URL_INVALID', true, reloadPackery
                );

                if(onSuccess)
                    onSuccess();

            } else {

                showValidationResult(
                    current.messageElement, 'COMPONENT_URL_INVALID', false, reloadPackery
                );

                if(onError)
                    onError();

            }

        });

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        let current  = componentsModule.modules.header_image;
        let instance = current.parentElement.querySelector('div.header_image-image.component-instance');
        let data     = '';

        if(instance)
            data = instance.getAttribute('data-path');

        return {
            header_image: data
        };

    }

};