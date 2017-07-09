componentsModule.modules.note = {

    data: {},

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.note.data;
    },

    create: function(identifier, element) {

        componentsModule.modules.note.data[identifier] = {
            title: '',
            note: '',
            note_position: 1,
            disabled: 0
        };

        let positionItems = element.querySelectorAll('span.position-item');
        componentsModule.initializeEvents([

            {
                // Serialize textarea
                event: 'change keyup',
                element: element.querySelector('textarea[name=component_inline_note]'),
                content: function(event) {
                    componentsModule.modules.note.data[identifier].note = event.target.value.trim();
                }
            },

            {
                // Serialize position
                event: 'click',
                element: positionItems,
                content: function(event) {
                    componentsModule.modules.note.data[identifier].note_position = event.target.getAttribute('data-position');
                    positionItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);

    }

};