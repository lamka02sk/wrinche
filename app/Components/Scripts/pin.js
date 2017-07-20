componentsModule.modules.pin = {

    data: {
        pin: false
    },

    validate: function() {
        return (typeof componentsModule.modules.pin.data.pin === 'boolean');
    },

    serialize: function() {
        return componentsModule.modules.pin.data;
    },

    events: [

        {
            // Update pin component data
            event: 'change',
            element: document.querySelector('input[name=component_pin]'),
            content: function(event) {
                componentsModule.modules.pin.data.pin = !!(event.target.checked);
            }
        }

    ]

};