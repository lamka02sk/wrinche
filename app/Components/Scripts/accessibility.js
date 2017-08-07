componentsModule.modules.accessibility = {

    accessibility_selector: 0,

    start: function() {

        // Save elements
        let current             = componentsModule.modules.accessibility;
        current.parentElement   = document.querySelector('[data-component=accessibility]');
        current.passwordElement = current.parentElement.querySelector('.component_accessibility_password');
        current.passwordInput   = current.passwordElement.querySelector('input');
        current.selectElement   = current.parentElement.querySelector('select');

        current.selector = current.createSelector();

    },

    createSelector: function() {

        let current = componentsModule.modules.accessibility;

        return new Selector({

            selector: '[name=component_accessibility_selector]',
            onSelect: function(instance, option) {

                current.accessibility_selector = option.getAttribute('data-item').trim();

                if(parseInt(current.accessibility_selector) === 1)
                    current.passwordElement.classList.remove('hide');
                else
                    current.passwordElement.classList.add('hide');

                reloadPackery();

            },

            onOpen : reloadPackery,
            onClose: reloadPackery

        });

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.accessibility;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const accessibility = JSON.parse(data);

        let selectOptions              = current.selectElement.querySelectorAll('option');
        current.accessibility_selector = accessibility.accessibility_selector;

        if(accessibility.accessibility_selector === 1)
            current.passwordElement.classList.remove('hide');

        Object.values(selectOptions).forEach(function(selectOption, index) {

            if(index !== accessibility.accessibility_selector)
                selectOption.removeAttribute('selected');
            else
                selectOption.setAttribute('selected', 'true');

        });

        current.selector.destroy();
        current.selector = current.createSelector();

    },

    validate: function() {

        const data             = componentsModule.modules.accessibility.serialize();
        const validateSelector = (data.accessibility_selector > -1 && data.accessibility_selector < 3);
        const validatePassword = (data.accessibility_password.length < 121);

        return (validateSelector && validatePassword);

    },

    serialize: function() {

        let current = componentsModule.modules.accessibility;

        return {

            accessibility_selector: current.accessibility_selector,
            accessibility_password: current.passwordInput.value.trim()

        }

    },

};