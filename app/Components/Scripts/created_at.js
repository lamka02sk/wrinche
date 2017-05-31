componentsModule.modules.created_at = {

    parentElement: document.querySelector('label[for=component_created_at]').parentNode,
    customDateElement: document.querySelector('label[for=component_created_at]').parentNode.querySelector('div.component_created_custom'),

    data: {
        created_at: false
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.created_at.data.created_at;
    },

    events: [

        {
            // Show / Hide custom date selection
            event: 'change',
            element: document.querySelector('label[for=component_created_at]').parentNode.querySelector('input[name=component_created]'),
            content: function(event) {
                if(!!(event.target.checked))
                    componentsModule.modules.created_at.customDateElement.classList.remove('hide');
                else
                    componentsModule.modules.created_at.customDateElement.classList.add('hide');
                packery.packery().reloadItems();
            }
        },

        {
            // Serialize custom date input
            event: 'change',
            element: document.querySelector('label[for=component_created_at]').parentNode.querySelector('input[name=component_created_custom]'),
            content: function(event) {
                componentsModule.modules.created_at.data.created_at = event.target.value.trim();
            }
        },

        {
            // Clear custom date input
            event: 'click',
            element: document.querySelector('label[for=component_created_at]').parentNode.querySelector('span.clear-created-date'),
            content: function() {
                componentsModule.modules.created_at.parentElement.querySelector('input[name=component_created_custom]').value = '';
                componentsModule.modules.created_at.data.created_at = false;
            }
        }

    ]

};