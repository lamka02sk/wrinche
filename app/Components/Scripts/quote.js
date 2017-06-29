componentsModule.modules.quote = {

    data: {},

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.quote.data;
    },

    create: function(identifier, element) {

        // Create instance data
        componentsModule.modules.quote.data[identifier] = {
            title: '',
            quote: '',
            quote_author: '',
            quote_position: 1,
            disabled: 0
        };

        let positionItems = element.querySelectorAll('span.position-item');
        componentsModule.initializeEvents([

            {
                // Serialize quote body
                event: 'change keyup',
                element: element.querySelector('textarea[name=component_inline_quote_text]'),
                content: function(event) {
                    componentsModule.modules.quote.data[identifier].quote = event.target.value.trim();
                }
            },

            {
                // Serialize quote author
                event: 'change keyup',
                element: element.querySelector('input[name=component_inline_quote_author]'),
                content: function(event) {
                    componentsModule.modules.quote.data[identifier].quote_author = event.target.value.trim();
                }
            },

            {
                // Serialize position component
                event: 'click',
                element: positionItems,
                content: function(event) {
                    componentsModule.modules.quote.data[identifier].quote_position = event.target.getAttribute('data-position');
                    positionItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);

    }

};