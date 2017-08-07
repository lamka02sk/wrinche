componentsModule.modules.last_update = {

    start: function() {

        // Save elements
        let current           = componentsModule.modules.last_update;
        current.parentElement = document.querySelector('[data-component=last_update]');
        current.customCheck   = current.parentElement.querySelector('[name=component_last-update]');
        current.dateBox       = current.parentElement.querySelector('.component_last_custom');
        current.dateInput     = current.dateBox.querySelector('input');
        current.clearInput    = current.dateBox.querySelector('.clear-input');

        current.customCheck.checked = false;

        // Events
        componentsModule.initializeEvents([

            {
                // Show / Hide custom input
                event  : 'change',
                element: current.customCheck,
                content: function() {

                    if(!!(current.customCheck.checked))
                        current.dateBox.classList.remove('hide');
                    else
                        current.dateBox.classList.add('hide');

                    reloadPackery();

                }
            },

            {
                // Clear input
                event  : 'click',
                element: current.clearInput,
                content: function() {

                    current.dateInput.value = '';

                }
            }

        ]);

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.last_update;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        current.dateInput.value = JSON.parse(data).last_update;

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        let current    = componentsModule.modules.last_update;
        const isCustom = !!(current.customCheck.checked);
        let data       = false;

        if(isCustom && current.dateInput.value !== '')
            data = current.dateInput.value.trim();

        return {

            last_update: data

        }

    }

};