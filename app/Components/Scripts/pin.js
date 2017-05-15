componentsModule.modules.pin = {

    data: {
        value: false
    },

    validate: function() {
        return (typeof componentsModule.modules.pin.data.value === 'boolean');
    },

    serialize: function() {
        return componentsModule.modules.pin.data.value;
    },

    events: [

        {
            // Update pin component data
            event: 'change',
            element: document.querySelector('input[name=component_pin]'),
            content: function(event) {
                componentsModule.modules.pin.data.value = !!(event.target.checked);
            }
        }

    ]

};