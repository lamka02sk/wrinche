componentsModule.modules.note = {

    data: {},

    resumeInline: function(identifier, element, resumeData) {

        componentsModule.modules.note.create(identifier, element, resumeData);

    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.note.data;
    },

    create: function(identifier, element, resumeData) {

        let current       = componentsModule.modules.note;
        let positionItems = element.querySelectorAll('span.position-item');
        let textarea      = element.querySelector('textarea[name=component_inline_note]');

        current.data[identifier] = {
            title        : '',
            note         : '',
            note_position: 1,
            disabled     : 0
        };

        componentsModule.initializeEvents([

            {
                // Serialize textarea
                event  : 'change keyup',
                element: textarea,
                content: function(event) {
                    current.data[identifier].note = event.target.value.trim();
                }
            },

            {
                // Serialize position
                event  : 'click',
                element: positionItems,
                content: function(event) {
                    current.data[identifier].note_position = event.target.getAttribute('data-position');
                    positionItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);

        if(resumeData) {

            if(resumeData.note) {

                textarea.value = resumeData.note.trim();
                triggerEvent(textarea, 'change');

            }

            if(resumeData.note_position !== undefined)
                positionItems[resumeData.note_position].click();

        }

    }

};