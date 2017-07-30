componentsModule.modules.accessibility = {

    accessibility_selector: 0,

    start: function() {

        // Save elements
        let current             = componentsModule.modules.accessibility;
        current.parentElement   = document.querySelector('[data-component=accessibility]');
        current.passwordElement = current.parentElement.querySelector('.component_accessibility_password');
        current.passwordInput   = current.passwordElement.querySelector('input');

        // Initialize Selector
        new Selector({

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