componentsModule.modules.header_image = {

    messageElement: document.querySelector('label[for=component_header_image]').parentNode.querySelector('span.field-validation'),
    valid: false,

    data: {
        header_image: ''
    },

    removeThis: function(parentElement) {

        if(parentElement.querySelector('div.header_image-image.component-instance'))
            parentElement.removeChild(parentElement.querySelector('div.header_image-image.component-instance'));

    },

    addNew: function(path, outside) {

        // Parent element
        let parentElement = document.querySelector('label[for=component_header_image]').parentNode;

        // Remove current image
        componentsModule.modules.header_image.removeThis(parentElement);

        // Create source link
        if(!outside)
            path = 'app/Data/Files/Images/' + path;

        // Save thumbnail path to serialize
        componentsModule.modules.header_image.data.header_image = path;

        // Create new template instance for thumbnail
        let template = parentElement.querySelector('#template_component_header-image_image').childNodes[0].cloneNode(true);
        template.setAttribute('data-path', path);
        template.classList.add('component-instance');
        template.childNodes[0].setAttribute('src', path);
        template.childNodes[0].setAttribute('alt', path);
        template.childNodes[1].innerText = path;
        parentElement.appendChild(template);

        // Hide media manager
        template.childNodes[0].addEventListener('load', function() {
            parentElement.querySelector('div.input-box').classList.add('hide');
            document.querySelector('div.media-manager span.close-manager').click();
            packery.packery().reloadItems();
        });

        // Initialize remove thumbnail event
        template.childNodes[2].addEventListener('click', function() {
            parentElement.querySelector('div.input-box').classList.remove('hide');
            parentElement.removeChild(parentElement.querySelector('div.component-instance'));
            componentsModule.modules.header_image.data.header_image = '';
            packery.packery().reloadItems();
        });

    },

    showError: function() {
        componentsModule.modules.header_image.messageElement.setAttribute('data-locale', 'COMPONENT_URL_INVALID');
        componentsModule.modules.header_image.messageElement.innerText = translate.locale.components.COMPONENT_URL_INVALID;
        componentsModule.modules.header_image.messageElement.classList.add('show');
        componentsModule.modules.header_image.valid = false;
        setTimeout(function() {
            packery.packery().reloadItems();
        }, 150);
    },

    hideError: function() {
        componentsModule.modules.header_image.messageElement.classList.remove('show');
        componentsModule.modules.header_image.valid = true;
        setTimeout(function() {
            packery.packery().reloadItems();
        }, 150);
    },

    validateInput: function(input) {
        if(!/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(input)) {
            componentsModule.modules.header_image.showError();
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
                componentsModule.modules.header_image.hideError();
            else
                componentsModule.modules.header_image.showError();

        });
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.header_image.data;
    },

    events: [

        {
            // Open image manager on click
            event: 'click',
            element: document.querySelector('label[for=component_header_image]').parentNode.querySelector('button.image_manager'),
            content: function() {
                managerActiveInstance = new MediaManager({
                    manager: 'images',
                    onSelect: function(path) {
                        componentsModule.modules.header_image.addNew(path, false);
                    }
                });
            }
        },

        {
            // Enter custom URL to image
            event: 'keypress',
            element: document.querySelector('input[name=component_header-image]'),
            content: function(event) {
                if(event.keyCode && event.keyCode === 13) {
                    let path = event.target.value;
                    componentsModule.modules.header_image.validateInput(path);
                    if(componentsModule.modules.header_image.valid)
                        componentsModule.modules.header_image.addNew(path, true);
                }
            }
        },

        {
            // Real-time URL validation
            event: 'change keyup',
            element: document.querySelector('input[name=component_header-image]'),
            content: function(event) {
                componentsModule.modules.header_image.validateInput(event.target.value);
            }
        }

    ]

};