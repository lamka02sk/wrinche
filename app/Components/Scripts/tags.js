componentsModule.modules.tags = {

    data: {
        tags: []
    },

    validateTags: function(tag) {
        return (/^[a-zA-Z]([a-zA-Z0-9_\s,]+)?[a-zA-Z0-9]$/.test(tag) && tag !== '');
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.tags.data;
    },

    events: [

        {
            // Add tags
            event: 'keyup',
            element: document.querySelector('input[name=component_tags]'),
            content: function(event) {
                if(event.keyCode !== 13) {
                    // Dropdown tags through future API
                } else {
                    let value = event.target.value.trim();
                    if(!componentsModule.modules.tags.validateTags(value))
                        return false;
                    let values = value.split(',');
                    for(let i = 0; i < values.length; ++i) {
                        value = values[i].trim();
                        if(componentsModule.modules.tags.data.tags.indexOf(value) !== -1) continue;
                        let template = event.target.parentNode.querySelector('#template_component_tags_item').childNodes[0].cloneNode(true);
                        template.innerHTML = '#' + value + template.innerHTML;
                        event.target.parentNode.querySelector('div.tags-list').appendChild(template);
                        componentsModule.modules.tags.data.tags.push(value);
                        template.childNodes[1].addEventListener('click', function() {
                            componentsModule.modules.tags.data.tags.splice(componentsModule.modules.tags.data.tags.indexOf(value), 1);
                            template.parentNode.removeChild(template);
                            packery.packery().reloadItems();
                        });
                    }
                    event.target.value = '';
                    packery.packery().reloadItems();
                }
            }
        }

    ]

};