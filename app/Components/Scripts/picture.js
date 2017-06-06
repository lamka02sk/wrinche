componentsModule.modules.picture = {

    data: {},
    
    validateImage: function(image, callback) {

    },

    start: function(element) {

    },

    create: function(identifier, element) {
        componentsModule.modules.picture.data[identifier] = {
            title: '',
            picture: false,
            picture_description: false,
            disabled: false
        };

    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.module.picture.data;
    }

};