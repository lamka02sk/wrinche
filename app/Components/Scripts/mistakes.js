componentsModule.modules.mistakes = {

    notifyElement: document.querySelector('label[for=component_mistakes]').parentNode.querySelector('div.component_mistakes_notify'),
    notifyEmailElement: document.querySelector('label[for=component_mistakes]').parentNode.querySelector('div.component_mistakes_email'),

    data: {
        mistakes: false,
        mistakes_notify: false,
        mistakes_email: false
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.mistakes.data;
    },

    events: [

        {
            // Show / Hide notification settings
            event: 'change',
            element: document.querySelector('label[for=component_mistakes]').parentNode.querySelector('input[name=component_mistakes]'),
            content: function(event) {
                let value = !!(event.target.checked);
                if(value)
                    componentsModule.modules.mistakes.notifyElement.classList.remove('hide');
                else
                    componentsModule.modules.mistakes.notifyElement.classList.add('hide');
                componentsModule.modules.mistakes.data.mistakes = value;
                packery.packery().reloadItems();
            }
        },

        {
            // Show / Hide email notification settings
            event: 'change',
            element: document.querySelector('label[for=component_mistakes]').parentNode.querySelector('input[name=component_mistakes_notify]'),
            content: function(event) {
                let value = !!(event.target.checked);
                if(value)
                    componentsModule.modules.mistakes.notifyEmailElement.classList.remove('hide');
                else
                    componentsModule.modules.mistakes.notifyEmailElement.classList.add('hide');
                componentsModule.modules.mistakes.data.mistakes_notify = value;
                packery.packery().reloadItems();
            }
        },

        {
            // Serialize email notification settings
            event: 'change',
            element: document.querySelector('label[for=component_mistakes]').parentNode.querySelector('input[name=component_mistakes_email]'),
            content: function(event) {
                componentsModule.modules.mistakes.data.mistakes_email = !!(event.target.checked);
            }
        }

    ]

};