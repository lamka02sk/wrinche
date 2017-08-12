componentsModule.modules.quote = {

    data: {},

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.quote.data;
    },

    resumeInline: function(identifier, element, resumeData) {

        componentsModule.modules.quote.create(identifier, element, resumeData);

    },

    create: function(identifier, element, resumeData) {

        let current = componentsModule.modules.quote;

        // Create instance data
        current.data[identifier] = {
            title         : '',
            quote         : '',
            quote_author  : '',
            quote_position: 1,
            disabled      : 0
        };

        let positionItems = element.querySelectorAll('span.position-item');
        let quoteInput    = element.querySelector('textarea[name=component_inline_quote_text]');
        let authorInput   = element.querySelector('input[name=component_inline_quote_author]');

        componentsModule.initializeEvents([

            {
                // Serialize quote body
                event  : 'change keyup',
                element: quoteInput,
                content: function(event) {
                    current.data[identifier].quote = event.target.value.trim();
                }
            },

            {
                // Serialize quote author
                event  : 'change keyup',
                element: authorInput,
                content: function(event) {
                    current.data[identifier].quote_author = event.target.value.trim();
                }
            },

            {
                // Serialize position component
                event  : 'click',
                element: positionItems,
                content: function(event) {
                    current.data[identifier].quote_position = event.target.getAttribute('data-position');
                    positionItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);

        if(resumeData) {

            if(resumeData.quote) {

                quoteInput.value = resumeData.quote.trim();
                triggerEvent(quoteInput, 'change');

            }

            if(resumeData.quote_author) {

                authorInput.value = resumeData.quote_author.trim();
                triggerEvent(authorInput, 'change');

            }

            if(resumeData.quote_position !== undefined)
                positionItems[resumeData.quote_position].click();

        }

    }

};