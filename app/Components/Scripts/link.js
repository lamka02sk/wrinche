componentsModule.modules.link = {

    data: {},

    create: function(identifier, element) {

        // Initialize Data
        componentsModule.modules.link.data[identifier] = {
            title: '',
            link: '',
            link_text: '',
            link_position: 1,
            link_target: 0
        };

        // Initialize target Selector
        element.querySelector('select[name=component_inline_link_target]').setAttribute('name', identifier);
        setTimeout(function() {
            new Selector({
                selector: 'select[name="' + identifier + '"]',
                onSelect: function(instance, option) {
                    componentsModule.modules.link.data[identifier].link_target = +option.getAttribute('data-item').trim();
                }
            });
        });

        let positionItems = element.querySelectorAll('span.position-item');
        componentsModule.initializeEvents([

            {
                // Serialize link
                event: 'change keyup',
                element: element.querySelector('input[name=component_inline_link_url]'),
                content: function(event) {
                    componentsModule.modules.link.data[identifier].link = event.target.trim();
                }
            },

            {
                // Serialize link text
                event: 'change keyup',
                element: element.querySelector('input[name=component_inline_link_name]'),
                content: function(event) {
                    componentsModule.modules.link.data[identifier].link_text = event.target.trim();
                }
            },

            {
                // Serialize position component
                event: 'click',
                element: positionItems,
                content: function(event) {
                    componentsModule.modules.link.data[identifier].link_position = event.target.getAttribute('data-position');
                    positionItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.link.data;
    }

};