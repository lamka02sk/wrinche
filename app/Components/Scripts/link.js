componentsModule.modules.link = {

    data: {},

    resumeInline: function(identifier, element, resumeData) {

        componentsModule.modules.link.create(identifier, element, resumeData);

    },

    createSelector: function(identifier, current) {

        setTimeout(function() {

            new Selector({

                selector: 'select[name="' + identifier + '"]',

                onSelect: function(instance, option) {

                    current.data[identifier].link_target = +option.getAttribute('data-item').trim();

                }

            });

        });

    },

    create: function(identifier, element, resumeData) {

        let current = componentsModule.modules.link;

        // Initialize Data
        current.data[identifier] = {
            title        : '',
            link         : '',
            link_text    : '',
            link_position: 1,
            link_target  : 0,
            disabled     : 0
        };

        let select        = element.querySelector('select[name=component_inline_link_target]');
        let positionItems = element.querySelectorAll('span.position-item');
        let linkInput     = element.querySelector('input[name=component_inline_link_url]');
        let linkName      = element.querySelector('input[name=component_inline_link_name]');

        if(resumeData) {

            if(resumeData.link)
                current.data[identifier].link = linkInput.value = resumeData.link.trim();

            if(resumeData.link_text)
                current.data[identifier].link_text = linkName.value = resumeData.link_text.trim();

            if(resumeData.link_position !== undefined) {

                current.data[identifier].link_position = resumeData.link_position;

                positionItems.forEach(function(item) {

                    if(item.matches('[data-position="' + resumeData.link_position + '"]')) {

                        item.classList.add('active');
                        return true;

                    }

                    item.classList.remove('active');

                });

            }

            if(resumeData.link_target !== undefined) {

                let selected = select.querySelector('[selected]');

                selected.removeAttribute('selected');
                select.children[resumeData.link_target].setAttribute('selected', 'true');

            }

        }

        // Initialize target Selector
        select.setAttribute('name', identifier);
        current.createSelector(identifier, current);

        componentsModule.initializeEvents([

            {
                // Serialize link
                event  : 'change keyup',
                element: linkInput,
                content: function(event) {

                    current.data[identifier].link = event.target.value.trim();

                }
            },

            {
                // Serialize link text
                event  : 'change keyup',
                element: linkName,
                content: function(event) {

                    current.data[identifier].link_text = event.target.value.trim();

                }
            },

            {
                // Serialize position component
                event  : 'click',
                element: positionItems,
                content: function(event) {

                    current.data[identifier].link_position = event.target.getAttribute('data-position');

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