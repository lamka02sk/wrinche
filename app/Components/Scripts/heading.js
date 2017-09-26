import Utils from "../../../scripts/Modules/Utils";

let heading = {

    data: {},
    elements: {},

    start() {

        // Save elements
        heading.templateElement = document.querySelector('#component_heading_template').children[0];
        heading.resumeData = heading.templateElement.getAttribute('data-resume');

    },

    resumeInline(identifier, element, resumeData) {

        heading.create(identifier, element, function(data, elements) {

            elements.inputElement.value = resumeData.value.trim();
            triggerEvent(elements.inputElement, 'change');

            elements.typeOptions[+resumeData.type - 1].click();

        });

    },

    create(identifier, element, callback) {

        heading.data[identifier] = {
            title: '',
            type: '1',
            value: '',
            disabled: 0
        };

        heading.elements[identifier] = {
            typeOptions: element.querySelectorAll('div.heading-types span'),
            inputElement: element.querySelector('input[name=component_inline_heading]')
        };

        let data = heading.data[identifier];
        let elements = heading.elements[identifier];

        Utils.registerEvents([

            {
                // Serialize input element
                event: 'change keyup',
                element: elements.inputElement,
                content(event) {

                    data.value = event.target.value.trim();

                }
            },

            {
                // Heading type switcher
                event: 'click',
                element: elements.typeOptions,
                content(event) {

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

    validate() {

        return true;

    },

    serialize() {

        return heading.data;

    }

};

module.exports = heading;