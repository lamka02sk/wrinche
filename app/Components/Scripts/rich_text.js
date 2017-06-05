componentsModule.modules.rich_text = {

    data: {},

    create: function(identifier, element) {
        componentsModule.modules.rich_text.data[identifier] = {
            value: '',
            disabled: 0
        };
        element.querySelector('textarea').setAttribute('id', 'editor_' + identifier);
    },

    onCreate: function(identifier) {
        CKEDITOR.replace('editor_' + identifier, {
            language: html.attr('lang'),
            uiColor: '#ffffff'
        });
        CKEDITOR.instances['editor_' + identifier].on('change', function() {
            componentsModule.modules.rich_text.data[identifier].value = CKEDITOR.instances['editor_' + identifier].getData().trim();
        });
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.rich_text.data;
    }

};