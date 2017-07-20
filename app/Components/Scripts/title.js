componentsModule.modules.title = {

    data: {
        title: ''
    },

    validate: function() {
        return (componentsModule.modules.title.data.title.length < 101 && componentsModule.modules.title.data.title.length > 0);
    },

    serialize: function() {
        return componentsModule.modules.title.data;
    },

    events: [

        {
            // Update title component data
            event: 'change keyup',
            element: document.querySelector('input[name=component_title]'),
            content: function(event) {
                componentsModule.modules.title.data.title = event.target.value.trim();
            }
        }

    ]

};