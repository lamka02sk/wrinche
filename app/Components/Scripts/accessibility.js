componentsModule.modules.accessibility = {

    data: {
        accessibility_selector: 0,
        accessibility_password: false
    },

    start: function() {

        // Save elements
        let current = componentsModule.modules.accessibility;
        current.parentElement = document.querySelector('div[data-component=accessibility]');
        current.passwordElement = current.parentElement.querySelector('div.component_accessibility_password');

        // Initialize Selector
        new Selector({

            selector: 'select[name=component_accessibility_selector]',
            onSelect: function(instance, option) {

                current.data.accessibility_selector = option.getAttribute('data-item').trim();

                if(parseInt(current.data.accessibility_selector) === 1)
                    current.passwordElement.classList.remove('hide');
                else
                    current.passwordElement.classList.add('hide');

                reloadPackery();

            },

            onOpen: reloadPackery,
            onClose: reloadPackery

        });

    },

    validate: function() {

        let current = componentsModule.modules.accessibility;
        let selector = (current.data.accessibility_selector > -1 && current.data.accessibility_selector < 3);

        let password = true;
        if(current.data.accessibility_password !== false)
            password = (current.data.accessibility_password.length < 121);

        return (selector && password);

    },

    serialize: this.data,

    events: [

        {
            // Serialize password field
            event: 'change keyup',
            element: document.querySelector('div[data-component=accessibility]').querySelector('input[name=component_accessibility_password]'),
            content: function(event) {
                componentsModule.modules.accessibility.data.accessibility_password = event.target.value.trim();
            }
        }

    ]

};