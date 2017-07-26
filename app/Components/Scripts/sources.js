componentsModule.modules.sources = {

    nameInput: document.querySelector('label[for=component_sources]').parentNode.querySelector('input[name=component_sources_add_name'),
    sourceInput: document.querySelector('label[for=component_sources]').parentNode.querySelector('input[name=component_sources_add_source'),
    sourcesList: document.querySelector('label[for=component_sources]').parentNode.querySelector('div.sources-list'),

    data: {
        sources: []
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.sources.data;
    },

    events: [

        {
            // Add new source
            event: 'click',
            element: document.querySelector('label[for=component_sources]').parentNode.querySelector('span.sources-add'),
            content: function() {
                let name = componentsModule.modules.sources.nameInput.value.trim();
                for(let i = 0; i < componentsModule.modules.sources.data.sources.length; ++i) {
                    if(name === componentsModule.modules.sources.data.sources[i][0]) {
                        componentsModule.modules.sources.nameInput.value = '';
                        componentsModule.modules.sources.nameInput.focus();
                        return false;
                    }
                }
                let source = componentsModule.modules.sources.sourceInput.value.trim();
                if(name === '' || source === '') return false;
                componentsModule.modules.sources.data.sources.push([name, source]);
                let template = document.querySelector('#template_component_sources_item').childNodes[0].cloneNode(true);
                template.children[0].innerText = name;
                template.children[1].innerText = source;
                template.children[2].addEventListener('click', function() {
                    for(let i = 0; i < componentsModule.modules.sources.data.sources.length; ++i) {
                        if(name === componentsModule.modules.sources.data.sources[i][0]) {
                            componentsModule.modules.sources.data.sources.splice(i, 1);
                            break;
                        }
                    }
                    componentsModule.modules.sources.nameInput.value = name;
                    componentsModule.modules.sources.nameInput.focus();
                    componentsModule.modules.sources.sourceInput.value = source;
                    componentsModule.modules.sources.sourcesList.removeChild(template);
                    packery.packery().reloadItems();
                });
                template.children[3].addEventListener('click', function() {
                    for(let i = 0; i < componentsModule.modules.sources.data.sources.length; ++i) {
                        if(name === componentsModule.modules.sources.data.sources[i][0]) {
                            componentsModule.modules.sources.data.sources.splice(i, 1);
                            componentsModule.modules.sources.nameInput.focus();
                            componentsModule.modules.sources.sourcesList.removeChild(template);
                            break;
                        }
                    }
                    packery.packery().reloadItems();
                });
                componentsModule.modules.sources.nameInput.value = '';
                componentsModule.modules.sources.nameInput.focus();
                componentsModule.modules.sources.sourceInput.value = '';
                componentsModule.modules.sources.sourcesList.insertBefore(template, componentsModule.modules.sources.sourcesList.children[0]);
                packery.packery().reloadItems();
            }
        },

        {
            // Enter to submit
            event: 'keyup',
            element: document.querySelector('label[for=component_sources]').parentNode.querySelector('input[name=component_sources_add_source'),
            content: function(event) {
                if(event.keyCode !== 13) return false;
                document.querySelector('label[for=component_sources]').parentNode.querySelector('span.sources-add').click();
            }
        }

    ]

};