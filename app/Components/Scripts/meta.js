componentsModule.modules.meta = {

    parentElement: document.querySelector('label[for=component_meta]').parentNode,

    data: {
        meta: false,
        meta_keywords: '',
        meta_description: '',
        meta_robots: 0
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.meta.data;
    },

    start: function() {
        new Selector({
            selector: 'select[name=component_meta_robots]',
            // Serialize robots field
            onSelect: function(instance, option) {
                componentsModule.modules.meta.data.meta_robots = option.getAttribute('data-item').trim();
            },
            onOpen: function() {
                packery.packery().reloadItems();
            },
            onClose: function() {
                packery.packery().reloadItems();
            }
        });
    },

    events: [

        {
            // Show / Hide custom meta settings
            event: 'change',
            element: document.querySelector('label[for=component_meta]').parentNode.querySelector('input[name=component_meta_manually]'),
            content: function(event) {
                let value = !!(event.target.checked);
                if(value)
                    componentsModule.modules.meta.parentElement.querySelector('div.component_meta_custom').classList.remove('hide');
                else
                    componentsModule.modules.meta.parentElement.querySelector('div.component_meta_custom').classList.add('hide');
                componentsModule.modules.meta.data.meta = value;
                packery.packery().reloadItems();
            }
        },

        {
            // Serialize keywords
            event: 'change keyup',
            element: document.querySelector('label[for=component_meta]').parentNode.querySelector('input[name=component_meta_keywords]'),
            content: function(event) {
                componentsModule.modules.meta.data.meta_keywords = event.target.value.trim();
            }
        },

        {
            // Serialize description
            event: 'change keyup',
            element: document.querySelector('label[for=component_meta]').parentNode.querySelector('input[name=component_meta_description]'),
            content: function(event) {
                componentsModule.modules.meta.data.meta_description = event.target.value.trim();
            }
        }

    ]

};