componentsModule.modules.revisions = {

    data: {
        revision: ''
    },

    validate: function() {
        return (componentsModule.modules.revisions.data.revision.length < 251);
    },

    serialize: function() {
        return componentsModule.modules.revisions.data;
    },

    events: [

        {
            event: 'change keyup',
            element: document.querySelector('textarea[name=component_revisions]'),
            content: function(event) {
                componentsModule.modules.revisions.data.revision = event.target.value.trim();
            }
        }

    ]

};