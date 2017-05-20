componentsModule.modules.revisions = {

    data: {
        value: ''
    },

    validate: function() {
        return (componentsModule.modules.revisions.data.value.length < 251);
    },

    serialize: function() {
        return componentsModule.modules.revisions.data.value;
    },

    events: [

        {
            event: 'change keyup',
            element: document.querySelector('textarea[name=component_revisions]'),
            content: function(event) {
                componentsModule.modules.revisions.data.value = event.target.value.trim();
            }
        }

    ]

};