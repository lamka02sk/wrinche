componentsModule.modules.title = {

    start: function() {

        // Save elements
        let current           = componentsModule.modules.title;
        current.parentElement = document.querySelector('[data-component=title]');
        current.inputElement  = current.parentElement.querySelector('input');
        current.titleElement  = document.querySelector('.mainline-heading');

        componentsModule.initializeEvent({

            event  : 'keydown keyup change',
            element: current.inputElement,
            content: function(event) {

                current.titleElement.innerText = event.target.value.trim();

            }

        });

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.title;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const object               = JSON.parse(data);
        current.inputElement.value = object.title;

        triggerEvent(current.inputElement, 'change');

    },

    validate: function() {

        const data = componentsModule.modules.title.serialize().title;

        return (data.length < 101 && data.length > 0);

    },

    serialize: function() {

        return {
            title: componentsModule.modules.title.inputElement.value.trim()
        }

    }

};