componentsModule.modules.heading = {

    data: {},
    elements: {},

    start: function() {

        // Save elements
        let current = componentsModule.modules.heading;
        current.templateElement = document.querySelector('#component_heading_template').children[0];
        current.resumeData = current.templateElement.getAttribute('data-resume');

    },

    resumeInline: function(identifier, element, resumeData) {

        componentsModule.modules.heading.create(identifier, element, function(data, elements) {

            elements.inputElement.value = resumeData.value.trim();
            triggerEvent(elements.inputElement, 'change');

            elements.typeOptions[+resumeData.type - 1].click();

        });

    },

    create: function(identifier, element, callback) {

        let current = componentsModule.modules.heading;

        current.data[identifier] = {
            title: '',
            type: '1',
            value: '',
            disabled: 0
        };

        current.elements[identifier] = {
            typeOptions: element.querySelectorAll('div.heading-types span'),
            inputElement: element.querySelector('input[name=component_inline_heading]')
        };

        let data = current.data[identifier];
        let elements = current.elements[identifier];

        componentsModule.initializeEvents([

            {
                // Serialize input element
                event: 'change keyup',
                element: elements.inputElement,
                content: function(event) {

                    data.value = event.target.value.trim();

                }
            },

            {
                // Heading type switcher
                event: 'click',
                element: elements.typeOptions,
                content: function(event) {

                    elements.typeOptions.forEach(function(item) {
                        item.classList.remove('type-selected');
                    });

                    event.target.classList.add('type-selected');
                    data.type = event.target.getAttribute('data-heading').trim();

                }
            }

        ]);

        if(callback)
            callback(data, elements);

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        return componentsModule.modules.heading.data;

    }

};