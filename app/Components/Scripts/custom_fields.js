componentsModule.modules.custom_fields = {

    start: function() {

        // Save elements
        let current             = componentsModule.modules.custom_fields;
        current.parentElement   = document.querySelector('[data-component=custom_fields]');
        current.listElement     = current.parentElement.querySelector('.custom_fields-list');
        current.identifierInput = current.parentElement.querySelector('#component_custom-fields_add_name');
        current.valueInput      = current.parentElement.querySelector('#component_custom-fields_add_value');
        current.addButton       = current.parentElement.querySelector('.add-custom_field');
        current.templateElement = current.parentElement.querySelector('#template_component_custom-fields_field').childNodes[0];

        componentsModule.initializeEvents([

            {
                // Delegate click events
                event  : 'click',
                element: current.parentElement,
                content: function(event) {

                    let target = event.target;

                    // Add custom field
                    if(target.matches('.add-custom_field')) {

                        current.addField();

                    }

                    // Edit custom field
                    else if(target.matches('.edit-custom_field')) {

                        let item = target.parentNode;

                        current.identifierInput.value = item.childNodes[0].innerText.trim();
                        current.valueInput.value      = item.childNodes[1].innerText.trim();

                        current.listElement.removeChild(item);
                        current.identifierInput.focus();

                        reloadPackery();

                    }

                    // Remove custom field
                    else if(target.matches('.remove-custom_field')) {

                        current.listElement.removeChild(target.parentNode);
                        current.identifierInput.focus();

                        reloadPackery();

                    }

                }
            },

            {
                // Allow submit with Enter key
                event  : 'keydown',
                element: current.valueInput,
                content: function(event) {

                    if(event.keyCode && event.keyCode === 13)
                        current.addButton.click();

                }

            }

        ]);

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.custom_fields;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const fields = JSON.parse(data).custom_fields;

        if(fields === null)
            return true;

        Object.keys(fields).map(function(key) {

            current.addField(key, fields[key]);

        });

    },

    addField: function(id, val) {

        let current      = componentsModule.modules.custom_fields;
        const identifier = id || current.identifierInput.value.trim();
        const value      = val || current.valueInput.value.trim();

        if(identifier === '' || value === '')
            return true;

        if(current.serialize().custom_fields[identifier]) {

            current.identifierInput.value = '';
            current.identifierInput.focus();
            current.valueInput.value = '';

            return true;

        }

        let template                     = current.templateElement.cloneNode(true);
        template.childNodes[0].innerText = identifier;
        template.childNodes[1].innerText = value;

        current.listElement.insertBefore(template, current.listElement.childNodes[0]);

        id || current.identifierInput.focus();
        current.identifierInput.value = '';
        current.valueInput.value      = '';

        reloadPackery();

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        let fieldElements = componentsModule.modules.custom_fields.listElement.childNodes;
        let data          = {};

        Array.from(fieldElements).map(function(fieldElement) {

            data[fieldElement.childNodes[0].innerText.trim()] = fieldElement.childNodes[1].innerText.trim();

        });

        return {

            custom_fields: data

        }

    }

};