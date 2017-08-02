componentsModule.modules.excerpt = {

    start: function() {

        // Save elements
        let current           = componentsModule.modules.excerpt;
        current.parentElement = document.querySelector('[data-component=excerpt]');
        current.inputElement  = current.parentElement.querySelector('textarea');
        current.excerptBox    = document.querySelector('.header-description');

        componentsModule.initializeEvent({

            event  : 'keydown keyup change',
            element: current.inputElement,
            content: function(event) {

                let value    = event.target.value.trim();
                const length = value.length;

                if(length > 36)
                    value = value.substr(0, 36) + '...';

                current.excerptBox.innerText = value;

            }

        });

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.excerpt;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const object               = JSON.parse(data);
        current.inputElement.value = object.excerpt;

        triggerEvent(current.inputElement, 'change');

    },

    validate: function() {

        const data = componentsModule.modules.excerpt.serialize().excerpt;

        return (data.length < 361);

    },

    serialize: function() {

        return {
            excerpt: componentsModule.modules.excerpt.inputElement.value.trim()
        }

    }

};