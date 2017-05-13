componentsModule.modules.title = {

    data: {
        value: ''
    },

    validate: function() {
        return (componentsModule.modules.title.data.value.length < 101 && componentsModule.modules.title.data.value.length > 0);
    },

    serialize: function() {
        return componentsModule.modules.title.data.value;
    },

    events: [

        {
            // Update title component data
            event: 'change keyup',
            element: document.querySelector('input[name=component_title]'),
            content: function(event) {
                componentsModule.modules.title.data.value = event.target.value.trim();
            }
        }

    ]

};