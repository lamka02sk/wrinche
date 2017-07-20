componentsModule.modules.url = {

    messageElement: document.querySelector('input[name=component_url]').parentNode.parentNode.querySelector('span.field-validation'),
    regexUrl: /^[a-z]{1}[a-z0-9\-]*[^\-]$/,

    data: {
        url: ''
    },

    isFree: function() {
        // Check if slug is in use
        return true;
    },

    validate: function() {
        if(!componentsModule.modules.url.regexUrl.test(componentsModule.modules.url.data.url))
            return false;
        if(componentsModule.modules.url.data.url.length < 3 || componentsModule.modules.url.data.url.length > 120)
            return false;
        if(!componentsModule.modules.url.isFree())
            return false;
        return true;
    },

    serialize: function() {
        return componentsModule.modules.url.data;
    },

    events: [

        {
            // Update excerpt component data
            event: 'change keyup',
            element: document.querySelector('input[name=component_url]'),
            content: function(event) {
                componentsModule.modules.url.data.url = event.target.value.trim();
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