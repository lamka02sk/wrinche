import Global from "../../../scripts/Modules/Global";

let accessibility = {

    accessibility_selector: 0,

    start() {

        // Save elements
        accessibility.parentElement   = document.querySelector('[data-component=accessibility]');
        accessibility.passwordElement = accessibility.parentElement.querySelector('.component_accessibility_password');
        accessibility.passwordInput   = accessibility.passwordElement.querySelector('input');
        accessibility.selectElement   = accessibility.parentElement.querySelector('select');

        accessibility.selector = accessibility.createSelector();

    },

    createSelector() {

        return Global.Selector({

            element: 'select[name=component_accessibility_selector]',
            selected(instance, option) {

                accessibility.accessibility_selector = option;

                if(parseInt(accessibility.accessibility_selector) === 1)
                    accessibility.passwordElement.classList.remove('hide');
                else
                    accessibility.passwordElement.classList.add('hide');

                Global.packery.reloadItems();

            },

            opened: Global.packery.reloadItems,
            closed: Global.packery.reloadItems

        });

    },

    resume() {

        // Save current instance
        const data = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const accessibility = JSON.parse(data);

        let selectOptions           = this.selectElement.querySelectorAll('option');
        this.accessibility_selector = accessibility.accessibility_selector;

        if(accessibility.accessibility_selector === 1)
            this.passwordElement.classList.remove('hide');

        Object.values(selectOptions).forEach(function(selectOption, index) {

            if(index !== accessibility.accessibility_selector)
                selectOption.removeAttribute('selected');
            else
                selectOption.setAttribute('selected', 'true');

        });

        this.selector.destroy();
        this.selector = this.createSelector();

    },

    validate() {

        const data             = accessibility.serialize();
        const validateSelector = (data.accessibility_selector > -1 && data.accessibility_selector < 3);
        const validatePassword = (data.accessibility_password.length < 121);

        return (validateSelector && validatePassword);

    },

    serialize() {

        return {

            accessibility_selector: accessibility.accessibility_selector,
            accessibility_password: accessibility.passwordInput.value.trim()

        }

    },

};

module.exports = accessibility;