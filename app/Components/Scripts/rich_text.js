componentsModule.modules.rich_text = {

    data: {},
    elements: {},

    resumeInline: function(identifier, element, resumeData) {

        let current = componentsModule.modules.rich_text;

        current.create(identifier, element, function() {

            current.data[identifier].value = resumeData.value.trim();

        });

    },

    reload: function(identifier) {

        componentsModule.modules.rich_text.onCreate(identifier);
        CKEDITOR.instances['editor_' + identifier].setData(componentsModule.modules.rich_text.data[identifier].value);

    },

    create: function(identifier, element, callback) {

        componentsModule.modules.rich_text.data[identifier] = {
            title: '',
            value: '',
            disabled: 0
        };

        element.querySelector('textarea').setAttribute('id', 'editor_' + identifier);

        if(callback)
            callback();

    },

    onCreate: function(identifier) {

        let current = componentsModule.modules.rich_text;

        CKEDITOR.replace('editor_' + identifier, ckconfig);

        CKEDITOR.instances['editor_' + identifier].on('change', function() {
            current.data[identifier].value = CKEDITOR.instances['editor_' + identifier].getData().trim();
        });

        if(current.data[identifier].value !== '')
            CKEDITOR.instances['editor_' + identifier].setData(current.data[identifier].value);

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        return componentsModule.modules.rich_text.data;

    }

};