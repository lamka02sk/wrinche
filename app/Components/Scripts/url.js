componentsModule.modules.url = {

    isFree: function() {

        let response = true;

        // Check if slug is in use
        postData(
            URI + 'api/articles.exists.url',
            {
                api: {
                    url   : componentsModule.modules.url.serialize().url,
                    ignore: document.querySelector('div.content-wrapper').getAttribute('data-id')
                }
            },
            function(data, status) {

                if(status === 'success' && data.success === true)
                    response = !(data.data.result);

            }
        );
        
        return response;

    },

    start: function() {

        // Save elements
        let current            = componentsModule.modules.url;
        current.parentElement  = document.querySelector('[data-component=url]');
        current.inputElement   = current.parentElement.querySelector('input');
        current.messageElement = current.parentElement.querySelector('.validate-message');

        // Real-time url validation
        componentsModule.initializeEvent({

            event  : 'keyup change',
            element: current.inputElement,
            content: function() {

                showValidationResult(
                    current.messageElement,
                    'COMPONENT_URL_INVALID',
                    current.validate(),
                    reloadPackery
                );

            }

        });

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.url;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const object               = JSON.parse(data);
        current.inputElement.value = object.url;

        triggerEvent(current.inputElement, 'change');

    },

    validate: function() {

        let current = componentsModule.modules.url;
        const data  = current.serialize().url;

        if(!/^[a-z][a-z0-9\-]+[a-z]$/.test(data))
            return false;

        if(data.length < 3 || data.length > 120)
            return false;

        return (current.isFree());

    },

    serialize: function() {

        return {
            url: componentsModule.modules.url.inputElement.value.trim()
        }

    }

};