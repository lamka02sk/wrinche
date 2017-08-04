componentsModule.modules.tags = {

    start: function() {

        // Save elements
        let current = componentsModule.modules.tags;
        current.parentElement = document.querySelector('[data-component=tags]');
        current.inputElement = current.parentElement.querySelector('input');
        current.listElement = current.parentElement.querySelector('.tags-list');
        current.templateElement = current.parentElement.querySelector('#template_component_tags_item').childNodes[0];

        // Events
        componentsModule.initializeEvents([

            {
                // Delegate click event
                event: 'click',
                element: current.parentElement,
                content: function(event) {

                    // Remove tag
                    if(event.target.matches('.tag-remove')) {

                        current.listElement.removeChild(event.target.parentNode);

                        reloadPackery();

                    }

                }
            },

            {
                // Add tags
                event: 'keyup',
                element: current.inputElement,
                content: function(event) {

                    if(!event.keyCode || event.keyCode !== 13)
                        return true;

                    current.addTag();

                }
            }

        ]);

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.tags;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const tags = JSON.parse(data).tags;

        if(tags === null)
            return true;

        current.addTag(tags.join(','));

    },

    addTag: function(list) {

        let current = componentsModule.modules.tags;
        const tags = list || current.inputElement.value.trim();

        if(!validateTags(tags))
            return true;

        const tagList = tags.split(',');

        tagList.map(function(tag) {

            tag = tag.trim();
            const currentTags = current.serialize().tags;

            if(~currentTags.indexOf(tag))
                return true;

            let template = current.templateElement.cloneNode(true);
            template.innerHTML = '#' + tag + template.innerHTML;

            current.inputElement.value = '';
            current.listElement.appendChild(template);

            reloadPackery();

        });

    },

    validate: function() {

        const tags = componentsModule.modules.tags.serialize().tags;

        return validateTags(tags);

    },

    serialize: function() {

        const tagElements = componentsModule.modules.tags.listElement.childNodes;

        let tagList = Array.from(tagElements).map(function(tagElement) {

            return tagElement.innerText.trim().replace('#', '');

        });

        return {

            tags: tagList

        }

    }

};