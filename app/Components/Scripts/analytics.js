componentsModule.modules.analytics = {

    detailsElement: document.querySelector('div.component_analytics_details'),

    data: {
        analytics: false,
        analytics_details: false
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.analytics.data;
    },

    events: [

        {
            // Show / Hide analytics details
            event: 'change',
            element: document.querySelector('input[name=component_analytics]'),
            content: function(event) {
                let value = !!(event.target.checked);
                if(value)
                    componentsModule.modules.analytics.detailsElement.classList.remove('hide');
                else
                    componentsModule.modules.analytics.detailsElement.classList.add('hide');
                componentsModule.modules.analytics.data.analytics = value;
                packery.packery().reloadItems();
            }
        },

        {
            // Serialize analytics details
            event: 'change',
            element: document.querySelector('input[name=component_analytics_details]'),
            content: function(event) {
                componentsModule.modules.analytics.data.analytics_details = !!(event.target.checked);
            }
        }

    ]

};