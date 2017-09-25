import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";

let fields = {

    start() {

        // Save elements
        fields.parentElement   = document.querySelector('[data-component=custom_fields]');
        fields.listElement     = fields.parentElement.querySelector('.custom_fields-list');
        fields.identifierInput = fields.parentElement.querySelector('#component_custom-fields_add_name');
        fields.valueInput      = fields.parentElement.querySelector('#component_custom-fields_add_value');
        fields.addButton       = fields.parentElement.querySelector('.add-custom_field');
        fields.templateElement = fields.parentElement.querySelector('#template_component_custom-fields_field').childNodes[0];

        Utils.registerEvents([

            {
                // Delegate click events
                event  : 'click',
                element: fields.parentElement,
                content(event) {

                    let target = event.target;

                    // Add custom field
                    if(target.matches('.add-custom_field'))
                        fields.addField();

                    // Edit custom field
                    else if(target.matches('.edit-custom_field')) {

                        let item = target.parentNode;

                        fields.identifierInput.value = item.childNodes[0].innerText.trim();
                        fields.valueInput.value      = item.childNodes[1].innerText.trim();

                        fields.listElement.removeChild(item);
                        fields.identifierInput.focus();

                        Global.packery.reloadItems();

                    }

                    // Remove custom field
                    else if(target.matches('.remove-custom_field')) {

                        fields.listElement.removeChild(target.parentNode);
                        fields.identifierInput.focus();

                        Global.packery.reloadItems();

                    }

                }
            },

            {
                // Allow submit with Enter key
                event  : 'keydown',
                element: fields.valueInput,
                content(event) {

                    if(event.keyCode && event.keyCode === 13)
                        fields.addButton.click();

                }

            }

        ]);

    },

    resume() {

        // Save current instance
        const data  = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const fields = JSON.parse(data).custom_fields;

        if(fields === null)
            return true;

        Object.keys(fields).map(key => {

            this.addField(key, fields[key]);

        });

    },

    addField(id, val) {

        const identifier = id || fields.identifierInput.value.trim();
        const value      = val || fields.valueInput.value.trim();

        if(identifier === '' || value === '')
            return true;

        if(fields.serialize().custom_fields[identifier]) {

            fields.identifierInput.value = '';
            fields.identifierInput.focus();
            fields.valueInput.value = '';

            return true;

        }

        let template                     = fields.templateElement.cloneNode(true);
        template.childNodes[0].innerText = identifier;
        template.childNodes[1].innerText = value;

        fields.listElement.insertBefore(template, fields.listElement.childNodes[0]);

        id || fields.identifierInput.focus();
        fields.identifierInput.value = '';
        fields.valueInput.value      = '';

        Global.packery.reloadItems();

    },

    validate() {

        return true;

    },

    serialize() {

        let fieldElements = fields.listElement.childNodes;
        let data          = {};

        Array.from(fieldElements).map(function(fieldElement) {

            data[fieldElement.childNodes[0].innerText.trim()] = fieldElement.childNodes[1].innerText.trim();

        });

        return {

            custom_fields: data

        }

    }

};

module.exports = fields;