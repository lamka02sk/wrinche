componentsModule.modules.analytics = {

    start: function() {

        // Save elements
        let current            = componentsModule.modules.analytics;
        current.parentElement  = document.querySelector('[data-component=analytics]');
        current.detailsElement = current.parentElement.querySelector('div.component_analytics_details');
        current.analyticsCheck = current.parentElement.querySelector('[name=component_analytics]');
        current.detailsCheck   = current.parentElement.querySelector('[name=component_analytics_details]');

        // Show / Hide "detailed analytics" checkbox
        componentsModule.initializeEvent({

            event  : 'change',
            element: current.analyticsCheck,

            content: function(event) {

                let classList = componentsModule.modules.analytics.detailsElement.classList;

                if(!!(event.target.checked))
                    classList.remove('hide');
                else
                    classList.add('hide');

                reloadPackery();

            }

        })

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.analytics;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const analytics = JSON.parse(data);

        current.analyticsCheck.checked = !!(analytics.analytics);
        triggerEvent(current.analyticsCheck, 'change');

        current.detailsCheck.checked = !!(analytics.analytics_details);

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        let current = componentsModule.modules.analytics;

        return {

            analytics        : !!(current.analyticsCheck.checked),
            analytics_details: !!(current.detailsCheck.checked)

        }

    }

};