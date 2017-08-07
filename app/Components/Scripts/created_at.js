componentsModule.modules.created_at = {

    start: function() {

        // Save elements
        let current           = componentsModule.modules.created_at;
        current.parentElement = document.querySelector('[data-component=created_at]');
        current.customCheck   = current.parentElement.querySelector('[name=component_created]');
        current.dateBox       = current.parentElement.querySelector('.component_created_custom');
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
        let current = componentsModule.modules.created_at;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        current.dateInput.value = JSON.parse(data).created_at;

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        let current    = componentsModule.modules.created_at;
        const isCustom = !!(current.customCheck.checked);
        let data       = false;

        if(isCustom && current.dateInput.value !== '')
            data = current.dateInput.value.trim();

        return {

            created_at: data

        }

    }

};