componentsModule.modules.copyright = {

    data: {
        copyright: 0
    },

    start: function() {
        new Selector({
            selector: 'select[name=component_copyright_selector]',
            // Serialize copyright field
            onSelect: function(instance, option) {
                componentsModule.modules.copyright.data.copyright = option.getAttribute('data-item').trim();
            },
            onOpen: function() {
                packery.packery().reloadItems();
            },
            onClose: function() {
                packery.packery().reloadItems();
            }
        });
    },

    validate: function() {
        return (componentsModule.modules.copyright.data.copyright > -1 && componentsModule.modules.copyright.data.copyright < 6);
    },

    serialize: function() {
        return componentsModule.modules.copyright.data;
    }

};