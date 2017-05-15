componentsModule.modules.thumbnail = {

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

    validateInput: function(input) {
        // Validate and show errors when needed
    },

    validate: function() {

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
                    if(componentsModule.modules.thumbnail.validateInput(path))
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