componentsModule.modules.accessibility = {

    parentElement: document.querySelector('label[for=component_accessibility]').parentNode,
    passwordElement: document.querySelector('label[for=component_accessibility]').parentNode.querySelector('div.component_accessibility_password'),

    data: {
        accessibility_selector: 0,
        accessibility_password: false
    },

    start: function() {
        new Selector({
            selector: 'select[name=component_accessibility_selector]',
            // Serialize status field
            onSelect: function(instance, option) {
                componentsModule.modules.accessibility.data.accessibility_selector = option.getAttribute('data-item').trim();
                if(parseInt(componentsModule.modules.accessibility.data.accessibility_selector) === 1)
                    componentsModule.modules.accessibility.passwordElement.classList.remove('hide');
                else
                    componentsModule.modules.accessibility.passwordElement.classList.add('hide');
                packery.packery().reloadItems();
            },
            onOpen: function() {
                packery.packery().reloadItems();
            },
            onClose: function() {
                packery.packery().reloadItems();
            }
        })
    },

    validate: function() {
        let password;
        let selector = (componentsModule.modules.accessibility.data.accessibility_selector > -1 && componentsModule.modules.accessibility.data.accessibility_selector < 3);
        if(componentsModule.modules.accessibility.data.accessibility_password !== false)
            password = (componentsModule.modules.accessibility.data.accessibility_password.length < 121);
        else
            password = true;
        return (selector && password);
    },

    serialize: function() {
        return componentsModule.modules.accessibility.data;
    },

    events: [

        {
            // Serialize password field
            event: 'change keyup',
            element: document.querySelector('label[for=component_accessibility]').parentNode.querySelector('input[name=component_accessibility_password]'),
            content: function(event) {
                componentsModule.modules.accessibility.data.accessibility_password = event.target.value.trim();
            }
        }

    ]

};