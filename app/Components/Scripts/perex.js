componentsModule.modules.perex = {

    start: function() {

        // Save elements
        let current           = componentsModule.modules.perex;
        current.parentElement = document.querySelector('[data-component=perex]');
        current.dateInput     = current.parentElement.querySelector('[name=component_perex_date]');
        current.locationInput = current.parentElement.querySelector('[name=component_perex_location]');

        // Clear date input
        componentsModule.initializeEvent({

            event  : 'click',
            element: current.parentElement.querySelector('.clear-perex-date'),
            content: function() {

                current.dateInput.value = '';

            }

        });

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.perex;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const object = JSON.parse(data);

        current.dateInput.value     = object.perex_date;
        current.locationInput.value = object.perex_location;

        triggerEvent(current.locationInput, 'change');

    },

    validate: function() {

        const data = componentsModule.modules.perex.serialize().perex_location;

        return (data.length < 121);

    },

    serialize: function() {

        let current = componentsModule.modules.perex;

        return {
            perex_date    : current.dateInput.value.trim(),
            perex_location: current.locationInput.value.trim()
        }

    }

};