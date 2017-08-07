componentsModule.modules.mistakes = {

    start: function() {

        // Save elements
        let current           = componentsModule.modules.mistakes;
        current.parentElement = document.querySelector('[data-component=mistakes]');
        current.enableCheck   = current.parentElement.querySelector('[name=component_mistakes]');
        current.notifyBox     = current.parentElement.querySelector('.component_mistakes_notify');
        current.notifyCheck   = current.notifyBox.querySelector('[name=component_mistakes_notify]');
        current.emailBox      = current.notifyBox.querySelector('div');
        current.emailCheck    = current.emailBox.querySelector('input');

        // Delegate change event
        componentsModule.initializeEvent({

            event  : 'change',
            element: current.parentElement,
            content: function(event) {

                let target = event.target;

                // Show notifications settings
                if(target === current.enableCheck) {

                    if(!!(target.checked))
                        current.notifyBox.classList.remove('hide');
                    else
                        current.notifyBox.classList.add('hide');

                    reloadPackery();

                }

                // Show email notifications settings
                else if(target === current.notifyCheck) {

                    if(!!(target.checked))
                        current.emailBox.classList.remove('hide');
                    else
                        current.emailBox.classList.add('hide');

                    reloadPackery();

                }

            }

        });

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.mistakes;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const mistakes = JSON.parse(data);

        current.enableCheck.checked = !!(mistakes.mistakes);
        triggerEvent(current.enableCheck, 'change');

        current.emailCheck.checked = !!(mistakes.mistakes_email);

        current.notifyCheck.checked = !!(mistakes.mistakes_notify);
        triggerEvent(current.notifyCheck, 'change');

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        let current = componentsModule.modules.mistakes;

        return {

            mistakes       : !!(current.enableCheck.checked),
            mistakes_notify: !!(current.notifyCheck.checked),
            mistakes_email : !!(current.emailCheck.checked)

        }

    }

};