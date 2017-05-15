componentsModule.modules.url = {

    messageElement: document.querySelector('input[name=component_url]').parentNode.parentNode.querySelector('span.field-validation'),

    data: {
        value: ''
    },

    validate: function() {
        return false;
    },

    serialize: function() {
        return componentsModule.modules.url.data.value;
    },

    events: [

        {
            // Update excerpt component data
            event: 'change keyup',
            element: document.querySelector('input[name=component_url]'),
            content: function(event) {
                componentsModule.modules.url.data.value = event.target.value.trim();
                if(componentsModule.modules.url.validate()) {
                    componentsModule.modules.url.messageElement.classList.remove('show');
                    setTimeout(function() {
                        packery.packery().reloadItems();
                    }, 150);
                } else {
                    componentsModule.modules.url.messageElement.setAttribute('data-locale', 'COMPONENT_URL_INVALID');
                    componentsModule.modules.url.messageElement.innerText = translate.locale.components.COMPONENT_URL_INVALID;
                    componentsModule.modules.url.messageElement.classList.add('show');
                    setTimeout(function() {
                        packery.packery().reloadItems();
                    }, 150);
                }
            }
        }

    ]

};