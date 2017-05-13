componentsModule.modules.excerpt = {

    data: {
        value: ''
    },

    validate: function() {
        return (componentsModule.modules.excerpt.data.value.length < 361);
    },

    serialize: function() {
        return componentsModule.modules.excerpt.data.value;
    },

    events: [

        {
            // Update excerpt component data
            event: 'change keyup',
            element: document.querySelector('textarea[name=component_excerpt]'),
            content: function(event) {
                componentsModule.modules.excerpt.data.value = event.target.value.trim();
            }
        }

    ]

};