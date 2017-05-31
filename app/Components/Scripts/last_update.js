componentsModule.modules.last_update = {

    parentElement: document.querySelector('label[for=component_last_update').parentNode,
    customDateElement: document.querySelector('label[for=component_last_update').parentNode.querySelector('div.component_last_custom'),

    data: {
        last_update: false
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.last_update.data.last_update;
    },
    
    events: [

        {
            // Show / Hide custom date selection
            event: 'change',
            element: document.querySelector('label[for=component_last_update').parentNode.querySelector('input[name=component_last-update]'),
            content: function(event) {
                if(!!(event.target.checked))
                    componentsModule.modules.last_update.customDateElement.classList.remove('hide');
                else
                    componentsModule.modules.last_update.customDateElement.classList.add('hide');
                packery.packery().reloadItems();
            }
        },

        {
            // Serialize custom date input
            event: 'change keyup',
            element: document.querySelector('label[for=component_last_update').parentNode.querySelector('input[name=component_last-update_custom]'),
            content: function(event) {
                componentsModule.modules.last_update.data.last_update = event.target.value.trim();
            }
        },

        {
            // Clear custom date input
            event: 'click',
            element: document.querySelector('label[for=component_last_update]').parentNode.querySelector('span.clear-last_update-date'),
            content: function() {
                componentsModule.modules.last_update.parentElement.querySelector('input[name=component_last-update_custom]').value = '';
                componentsModule.modules.last_update.data.last_update = false;
            }
        }

    ]

};