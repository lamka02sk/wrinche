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

            event: 'change',
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

    validate: function() {

        let data = componentsModule.modules.analytics.serialize();

        return (typeof data.analytics === 'boolean' && typeof data.analytics_details === 'boolean')

    },

    serialize: function() {

        let current = componentsModule.modules.analytics;

        return {
            analytics: !!(current.analyticsCheck.checked),
            analytics_details: !!(current.detailsCheck.checked)
        }

    }

};