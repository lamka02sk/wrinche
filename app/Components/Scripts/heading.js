componentsModule.modules.heading = {

    data: {},

    start: function(element) {

    },

    create: function(identifier, element) {
        componentsModule.modules.heading.data[identifier] = {
            title: '',
            type: '1',
            value: '',
            disabled: 0
        };
        let typeOptions = element.querySelectorAll('div.heading-types span');
        let inputElement = element.querySelector('input[name=component_inline_heading]');
        componentsModule.initializeEvents([

            {
                // Serialize input element
                event: 'change keyup',
                element: inputElement,
                content: function(event) {
                    componentsModule.modules.heading.data[identifier].value = event.target.value.trim();
                }
            },

            {
                // Heading type switcher
                event: 'click',
                element: typeOptions,
                content: function(event) {
                    typeOptions.forEach(function(item) {
                        item.classList.remove('type-selected');
                    });
                    event.target.classList.add('type-selected');
                    componentsModule.modules.heading.data[identifier].type = event.target.getAttribute('data-heading').trim();
                }
            }

        ]);
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.heading.data;
    }

};