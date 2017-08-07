componentsModule.modules.sources = {

    start: function() {

        // Save elements
        let current             = componentsModule.modules.sources;
        current.parentElement   = document.querySelector('[data-component=sources]');
        current.nameInput       = current.parentElement.querySelector('[name=component_sources_add_name]');
        current.valueInput      = current.parentElement.querySelector('[name=component_sources_add_source]');
        current.addButton       = current.parentElement.querySelector('.sources-add');
        current.itemsList       = current.parentElement.querySelector('.sources-list');
        current.templateElement = current.parentElement.querySelector('#template_component_sources_item').childNodes[0];

        // Events
        componentsModule.initializeEvents([

            {
                // Enter to add source
                event  : 'keyup',
                element: current.valueInput,
                content: function(event) {

                    if(!event.keyCode || event.keyCode !== 13)
                        return true;

                    current.addButton.click();

                }
            },

            {
                // Delegate click events
                event  : 'click',
                element: current.parentElement,
                content: function(event) {

                    let target = event.target;

                    // Add source
                    if(target === current.addButton)
                        current.addSource();

                    // Edit source
                    else if(target.matches('.source-edit')) {

                        let parent = target.parentNode;

                        current.nameInput.value  = parent.childNodes[0].innerText.trim();
                        current.valueInput.value = parent.childNodes[1].innerText.trim();
                        current.nameInput.focus();

                        current.itemsList.removeChild(parent);

                        reloadPackery();

                    }

                    // Remove source
                    else if(target.matches('.source-remove')) {

                        current.nameInput.value  = '';
                        current.valueInput.value = '';
                        current.nameInput.focus();

                        current.itemsList.removeChild(target.parentNode);

                        reloadPackery();

                    }

                }
            }

        ]);

    },

    addSource: function(source) {

        // Save current
        let current        = componentsModule.modules.sources;
        let currentSources = current.itemsList.childNodes;

        let sourceNames = Object.values(currentSources).map(function(sourceElement) {
            return sourceElement.childNodes[0].innerText.trim();
        });

        const sourceName = source[0] || current.nameInput.value.trim();

        if(~sourceNames.indexOf(sourceName)) {
            current.nameInput.value = '';
            if(!source)
                current.nameInput.focus();
            return true;
        }

        const sourceValue = source[1] || current.valueInput.value.trim();

        if(sourceName === '' || sourceValue === '') {
            if(!source)
                current.nameInput.focus();
            return true;
        }

        let template                   = current.templateElement.cloneNode(true);
        template.children[0].innerText = sourceName;
        template.children[1].innerText = sourceValue;

        current.nameInput.value  = '';
        current.valueInput.value = '';

        if(!source)
            current.nameInput.focus();

        current.itemsList.insertBefore(template, current.itemsList.childNodes[0]);
        reloadPackery();

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.sources;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const sources = JSON.parse(data).sources;

        sources.forEach(function(source) {

            current.addSource(source);

        });

        reloadPackery();

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        let sourceItems = componentsModule.modules.sources.itemsList.childNodes;

        let sources = Object.values(sourceItems).reverse().map(function(sourceItem) {

            return [
                sourceItem.childNodes[0].innerText.trim(),
                sourceItem.childNodes[1].innerText.trim()
            ]

        });

        return {

            sources: sources

        }

    }

};