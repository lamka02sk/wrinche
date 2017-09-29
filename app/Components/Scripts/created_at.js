import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";

let created = {

    start() {

        // Save elements
        created.parentElement = document.querySelector('[data-component=created_at]');
        created.customCheck   = created.parentElement.querySelector('[name=component_created]');
        created.dateBox       = created.parentElement.querySelector('.component_created_custom');
        created.dateInput     = created.dateBox.querySelector('input');
        created.clearInput    = created.dateBox.querySelector('.clear-input');

        created.customCheck.checked = false;

        // Events
        Utils.registerEvents([

            {
                // Show / Hide custom input
                event  : 'change',
                element: created.customCheck,
                content() {

                    if(created.customCheck.checked)
                        created.dateBox.classList.remove('hide');
                    else
                        created.dateBox.classList.add('hide');

                    Global.packery.reloadItems();

                }
            },

            {
                // Clear input
                event  : 'click',
                element: created.clearInput,
                content() {

                    created.dateInput.value = '';

                }
            }

        ]);

    },

    resume() {

        // Save current instance
        const data  = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        this.dateInput.value = JSON.parse(data).created_at;
        Utils.triggerEvent(this.customCheck, 'click');

    },

    validate() {

        return true;

    },

    serialize() {

        const isCustom = created.customCheck.checked;
        let data       = false;

        if(isCustom && created.dateInput.value !== '')
            data = created.dateInput.value.trim();

        return {

            created_at: data

        }

    }

};

module.exports = created;