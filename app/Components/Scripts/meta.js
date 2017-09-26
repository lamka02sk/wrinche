import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";

let meta = {

    start() {

        // Save elements
        meta.parentElement = document.querySelector('[data-component=meta]');
        meta.customCheck   = meta.parentElement.querySelector('[name=component_meta_manually]');
        meta.customBox     = meta.parentElement.querySelector('.component_meta_custom');
        meta.keyInput      = meta.parentElement.querySelector('[name=component_meta_keywords]');
        meta.descInput     = meta.parentElement.querySelector('[name=component_meta_description]');
        meta.robotsSelect  = meta.parentElement.querySelector('[name=component_meta_robots]');

        meta.customCheck.checked = false;

        // Selector
        meta.selector = meta.createSelector();

        // Events
        Utils.registerEvent({

            event  : 'change',
            element: meta.customCheck,
            content() {

                if(meta.customCheck.checked)
                    meta.customBox.classList.remove('hide');
                else
                    meta.customBox.classList.add('hide');

                Global.packery.reloadItems();

            }

        });

    },

    createSelector() {

        return new Global.Selector({
            element: '[name=component_meta_robots]',
            opened  : Global.packery.reloadItems,
            closed : Global.packery.reloadItems
        });

    },

    resume() {

        // Save current instance
        const data  = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const meta = JSON.parse(data);

        this.customCheck.checked = !!(meta.meta);
        Utils.triggerEvent(this.customCheck, 'change');

        this.keyInput.value  = meta.meta_keywords.trim();
        this.descInput.value = meta.meta_description.trim();

        let selectOptions = this.robotsSelect.querySelectorAll('option');

        Object.values(selectOptions).forEach(function(selectOption, index) {

            if(index !== meta.meta_robots)
                selectOption.removeAttribute('selected');
            else
                selectOption.setAttribute('selected', 'true');

        });

        this.selector.destroy();
        this.selector = this.createSelector();

    },

    validate() {

        return true;

    },

    serialize() {

        return {

            meta            : meta.customCheck.checked,
            meta_keywords   : meta.keyInput.value.trim(),
            meta_description: meta.descInput.value.trim(),
            meta_robots     : parseInt(meta.robotsSelect.querySelector('[selected=true]').getAttribute('value'))

        }

    }

};

module.exports = meta;