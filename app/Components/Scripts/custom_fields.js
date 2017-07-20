componentsModule.modules.custom_fields = {

    parentElement: document.querySelector('div.component-element[data-component=custom_fields]'),
    listElement: document.querySelector('div.component-element[data-component=custom_fields]').querySelector('div.custom_fields-list'),

    data: {},

    validate: function() {
        return true;
    },

    serialize: function() {
        return {
            custom_fields: componentsModule.modules.custom_fields.data
        };
    },

    events: [

        {
            // Add custom field
            event: 'click',
            element: document.querySelector('span.add-custom_field'),
            content: function() {
                let parent = componentsModule.modules.custom_fields.parentElement;
                let list = componentsModule.modules.custom_fields.listElement;
                let identifierElement = parent.querySelector('input[name=component_custom-fields_name]');
                let valueElement = parent.querySelector('input[name=component_custom-fields_value]');
                let identifier = identifierElement.value.trim();
                let value = valueElement.value.trim();
                if(identifier === '' || value === '') return false;
                if(identifier in componentsModule.modules.custom_fields.data) return false;
                componentsModule.modules.custom_fields.data[identifier] = value;
                let template = document.querySelector('#template_component_custom-fields_field').childNodes[0].cloneNode(true);
                template.childNodes[0].innerText = identifier;
                template.childNodes[1].innerText = value;
                list.insertBefore(template, list.childNodes[0]);
                identifierElement.focus();
                identifierElement.value = '';
                valueElement.value = '';
                template.childNodes[3].addEventListener('click', function() {
                    identifierElement.value = identifier;
                    valueElement.value = value;
                    delete componentsModule.modules.custom_fields.data[identifier];
                    list.removeChild(template);
                    identifierElement.focus();
                    packery.packery().reloadItems();
                });
                template.childNodes[2].addEventListener('click', function() {
                    delete componentsModule.modules.custom_fields.data[identifier];
                    list.removeChild(template);
                    identifierElement.focus();
                    packery.packery().reloadItems();
                });
                packery.packery().reloadItems();
            }
        },

        {
            // Add custom field
            event: 'keyup',
            element: document.querySelector('input[name=component_custom-fields_value]'),
            content: function(event) {
                if(event.keyCode === 13)
                    componentsModule.modules.custom_fields.parentElement.querySelector('span.add-custom_field').click();
            }
        }

    ]

};