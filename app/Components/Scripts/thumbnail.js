componentsModule.modules.thumbnail = {

    messageElement: document.querySelector('label[for=component_thumbnail]').parentNode.querySelector('span.field-validation'),
    valid: false,

    data: {
        path: ''
    },

    removeThis: function(parentElement) {

        if(parentElement.querySelector('div.thumbnail-image.component-instance'))
            parentElement.removeChild(parentElement.querySelector('div.thumbnail-image.component-instance'));

    },

    addNew: function(path, outside) {

        // Parent element
        let parentElement = document.querySelector('label[for=component_thumbnail]').parentNode;

        // Remove current image
        componentsModule.modules.thumbnail.removeThis(parentElement);

        // Create source link
        if(!outside)
            path = 'app/Data/Files/Images/' + path;

        // Save thumbnail path to serialize
        componentsModule.modules.thumbnail.data.path = path;

        // Create new template instance for thumbnail
        let template = parentElement.querySelector('#template_component_thumbnail_image').childNodes[0].cloneNode(true);
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
            componentsModule.modules.thumbnail.data.path = '';
            packery.packery().reloadItems();
        });

    },

    showError: function() {
        componentsModule.modules.thumbnail.messageElement.setAttribute('data-locale', 'COMPONENT_URL_INVALID');
        componentsModule.modules.thumbnail.messageElement.innerText = translate.locale.components.COMPONENT_URL_INVALID;
        componentsModule.modules.thumbnail.messageElement.classList.add('show');
        componentsModule.modules.thumbnail.valid = false;
        setTimeout(function() {
            packery.packery().reloadItems();
        }, 150);
    },

    hideError: function() {
        componentsModule.modules.thumbnail.messageElement.classList.remove('show');
        componentsModule.modules.thumbnail.valid = true;
        setTimeout(function() {
            packery.packery().reloadItems();
        }, 150);
    },

    validateInput: function(input) {
        if(!/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(input)) {
            componentsModule.modules.thumbnail.showError();
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
                componentsModule.modules.thumbnail.hideError();
            else
                componentsModule.modules.thumbnail.showError();

        });
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.thumbnail.data.path;
    },

    events: [

        {
            // Open image manager on click
            event: 'click',
            element: document.querySelector('label[for=component_thumbnail]').parentNode.querySelector('button.image_manager'),
            content: function() {
                managerActiveInstance = new MediaManager({
                    manager: 'images',
                    onSelect: function(path) {
                        componentsModule.modules.thumbnail.addNew(path, false);
                    }
                });
            }
        },

        {
            // Enter custom URL to image
            event: 'keypress',
            element: document.querySelector('input[name=component_thumbnail_input]'),
            content: function(event) {
                if(event.keyCode && event.keyCode === 13) {
                    let path = event.target.value;
                    componentsModule.modules.thumbnail.validateInput(path);
                    if(componentsModule.modules.thumbnail.valid)
                        componentsModule.modules.thumbnail.addNew(path, true);
                }
            }
        },

        {
            // Real-time URL validation
            event: 'change keyup',
            element: document.querySelector('input[name=component_thumbnail_input]'),
            content: function(event) {
                componentsModule.modules.thumbnail.validateInput(event.target.value);
            }
        }

    ]

};