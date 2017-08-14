componentsModule.modules.planner = {

    start: function() {

        // Save elements
        let current           = componentsModule.modules.planner;
        current.parentElement = document.querySelector('[data-component=planner');
        current.customPublish = current.parentElement.querySelector('.component_planner_publish_custom');
        current.notifyBox     = current.parentElement.querySelector('.component_planner_notify_email');

        current.publishAuto   = current.parentElement.querySelector('[name=component_planner_publish]');
        current.publishInput  = current.parentElement.querySelector('[name=component_planner_publish_datetime]');
        current.expiryInput   = current.parentElement.querySelector('[name=component_planner_publish_expiry]');
        current.plannerNotify = current.parentElement.querySelector('[name=component_planner_notify]');
        current.notifyEmail   = current.parentElement.querySelector('[name=component_planner_notify_email]');

        // Events
        componentsModule.initializeEvents([

            {
                // Delegate change events
                event  : 'change',
                element: current.parentElement,
                content: function(event) {

                    let target = event.target;

                    // Auto-publication change
                    if(target === current.publishAuto) {

                        if(target.checked)
                            current.customPublish.classList.add('hide');
                        else
                            current.customPublish.classList.remove('hide');


                        reloadPackery();

                    }

                    // Notification change
                    else if(target === current.plannerNotify) {

                        if(target.checked)
                            current.notifyBox.classList.remove('hide');
                        else
                            current.notifyBox.classList.add('hide');

                        reloadPackery();

                    }

                }
            },

            {
                // Delegate click events
                event  : 'click',
                element: current.parentElement,
                content: function(event) {

                    // Clear input
                    if(event.target.matches('.clear-input')) {

                        event.target.parentNode.querySelector('input').value = '';

                    }

                }
            }

        ]);

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.planner;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const planner = JSON.parse(data);

        if(planner === null)
            return true;

        current.publishAuto.checked = !(planner.planner);
        triggerEvent(current.publishAuto, 'change');

        current.publishInput.value = planner.planner_date;
        current.expiryInput.value  = planner.planner_expiry;

        current.plannerNotify.checked = !!(planner.planner_notify);
        triggerEvent(current.plannerNotify, 'change');

        current.notifyEmail.checked = !!(planner.planner_notify_email);

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        let current = componentsModule.modules.planner;

        return {

            planner             : !(current.publishAuto.checked),
            planner_date        : current.publishInput.value.trim(),
            planner_expiry      : current.expiryInput.value.trim(),
            planner_notify      : !!(current.plannerNotify.checked),
            planner_notify_email: !!(current.notifyEmail.checked)

        }

    }

};