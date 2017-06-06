componentsModule.modules.rich_text = {

    data: {},

    reload: function(identifier) {
        componentsModule.modules.rich_text.onCreate(identifier);
        CKEDITOR.instances['editor_' + identifier].setData(componentsModule.modules.rich_text.data[identifier].value);
    },

    create: function(identifier, element) {
        componentsModule.modules.rich_text.data[identifier] = {
            title: '',
            value: '',
            disabled: 0
        };
        element.querySelector('textarea').setAttribute('id', 'editor_' + identifier);
    },

    onCreate: function(identifier) {
        CKEDITOR.replace('editor_' + identifier, ckconfig);
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