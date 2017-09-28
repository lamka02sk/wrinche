import Utils from "../../../scripts/Modules/Utils";

let quote = {

    data: {},

    validate() {
        return true;
    },

    serialize() {
        return quote.data;
    },

    resumeInline(identifier, element, resumeData) {

        quote.create(identifier, element, resumeData);

    },

    create(identifier, element, resumeData) {

        // Create instance data
        quote.data[identifier] = {
            title         : '',
            quote         : '',
            quote_author  : '',
            quote_position: 1,
            disabled      : 0
        };

        let positionItems = element.querySelectorAll('span.position-item');
        let quoteInput    = element.querySelector('textarea[name=component_inline_quote_text]');
        let authorInput   = element.querySelector('input[name=component_inline_quote_author]');

        Utils.registerEvents([

            {
                // Serialize quote body
                event  : 'change keyup',
                element: quoteInput,
                content(event) {
                    quote.data[identifier].quote = event.target.value.trim();
                }
            },

            {
                // Serialize quote author
                event  : 'change keyup',
                element: authorInput,
                content(event) {
                    quote.data[identifier].quote_author = event.target.value.trim();
                }
            },

            {
                // Serialize position component
                event  : 'click',
                element: positionItems,
                content(event) {
                    quote.data[identifier].quote_position = event.target.getAttribute('data-position');
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
                Utils.triggerEvent(quoteInput, 'change');

            }

            if(resumeData.quote_author) {

                authorInput.value = resumeData.quote_author.trim();
                Utils.triggerEvent(authorInput, 'change');

            }

            if(resumeData.quote_position !== undefined)
                positionItems[resumeData.quote_position].click();

        }

    }

};

module.exports = quote;