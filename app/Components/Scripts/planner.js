componentsModule.modules.planner = {

    parentElement: document.querySelector('label[for=component_planner]').parentNode,
    customPublishElement: document.querySelector('label[for=component_planner]').parentNode.querySelector('div.component_planner_publish_custom'),
    notifyEmailElement: document.querySelector('label[for=component_planner]').parentNode.querySelector('div.component_planner_notify_email'),

    data: {
        planner: false,
        planner_date: false,
        planner_expiry: false,
        planner_notify: false,
        planner_notify_email: false
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.planner.data;
    },

    events: [

        {
            // Show / Hide automatic publish box
            event: 'change',
            element: document.querySelector('label[for=component_planner]').parentNode.querySelector('input[name=component_planner_publish]'),
            content: function(event) {
                componentsModule.modules.planner.data.planner = !!(event.target.checked);
                if(componentsModule.modules.planner.data.planner)
                    componentsModule.modules.planner.customPublishElement.classList.add('hide');
                else
                    componentsModule.modules.planner.customPublishElement.classList.remove('hide');
                packery.packery().reloadItems();
            }
        },

        {
            // Serialize publish date input
            event: 'change',
            element: document.querySelector('label[for=component_planner]').parentNode.querySelector('input[name=component_planner_publish_datetime]'),
            content: function(event) {
                componentsModule.modules.planner.data.planner_date = event.target.value;
            }
        },

        {
            // Remove publish date value
            event: 'click',
            element: document.querySelector('label[for=component_planner]').parentNode.querySelector('span.clear-planner_publish-date'),
            content: function() {
                componentsModule.modules.planner.parentElement.querySelector('input[name=component_planner_publish_datetime]').value = '';
                componentsModule.modules.planner.data.planner_date = false;
            }
        },

        {
            // Serialize expiry date input
            event: 'change',
            element: document.querySelector('label[for=component_planner]').parentNode.querySelector('input[name=component_planner_publish_expiry]'),
            content: function(event) {
                componentsModule.modules.planner.data.planner_expiry = event.target.value;
            }
        },

        {
            // Remove expiry date value
            event: 'click',
            element: document.querySelector('label[for=component_planner]').parentNode.querySelector('span.clear-planner_expiry-date'),
            content: function() {
                componentsModule.modules.planner.parentElement.querySelector('input[name=component_planner_publish_expiry]').value = '';
                componentsModule.modules.planner.data.planner_expiry = false;
            }
        },

        {
            // Show / Hide email notification
            event: 'change',
            element: document.querySelector('label[for=component_planner]').parentNode.querySelector('input[name=component_planner_notify]'),
            content: function(event) {
                componentsModule.modules.planner.data.planner_notify = !!(event.target.checked);
                if(componentsModule.modules.planner.data.planner_notify)
                    componentsModule.modules.planner.notifyEmailElement.classList.remove('hide');
                else
                    componentsModule.modules.planner.notifyEmailElement.classList.add('hide');
                packery.packery().reloadItems();
            }
        },

        {
            // Serialize email notification input
            event: 'change',
            element: document.querySelector('label[for=component_planner]').parentNode.querySelector('input[name=component_planner_notify_email]'),
            content: function(event) {
                componentsModule.modules.planner.data.planner_notify = !!(event.target.checked);
            }
        }

    ]

};