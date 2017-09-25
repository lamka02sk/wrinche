import Global from "../../../scripts/Modules/Global";
import Utils from "../../../scripts/Modules/Utils";

let updated = {

    start() {

        // Save elements
        updated.parentElement = document.querySelector('[data-component=last_update]');
        updated.customCheck   = updated.parentElement.querySelector('[name=component_last-update]');
        updated.dateBox       = updated.parentElement.querySelector('.component_last_custom');
        updated.dateInput     = updated.dateBox.querySelector('input');
        updated.clearInput    = updated.dateBox.querySelector('.clear-input');

        updated.customCheck.checked = false;

        // Events
        Utils.registerEvents([

            {
                // Show / Hide custom input
                event  : 'change',
                element: updated.customCheck,
                content() {

                    if(updated.customCheck.checked)
                        updated.dateBox.classList.remove('hide');
                    else
                        updated.dateBox.classList.add('hide');

                    Global.packery.reloadItems();

                }
            },

            {
                // Clear input
                event  : 'click',
                element: updated.clearInput,
                content() {

                    updated.dateInput.value = '';

                }
            }

        ]);

    },

    resume() {

        // Save current instance
        const data  = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        this.dateInput.value = JSON.parse(data).last_update;

    },

    validate() {

        return true;

    },

    serialize() {

        const isCustom = updated.customCheck.checked;
        let data       = false;

        if(isCustom && updated.dateInput.value !== '')
            data = updated.dateInput.value.trim();

        return {

            last_update: data

        }

    }

};

module.exports = updated;