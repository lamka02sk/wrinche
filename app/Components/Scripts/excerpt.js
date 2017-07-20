componentsModule.modules.excerpt = {

    data: {
        excerpt: ''
    },

    validate: function() {
        return (componentsModule.modules.excerpt.data.excerpt.length < 361);
    },

    serialize: function() {
        return componentsModule.modules.excerpt.data;
    },

    events: [

        {
            // Update excerpt component data
            event: 'change keyup',
            element: document.querySelector('textarea[name=component_excerpt]'),
            content: function(event) {
                componentsModule.modules.excerpt.data.excerpt = event.target.value.trim();
            }
        }

    ]

};