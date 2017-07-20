componentsModule.modules.status = {

    data: {
        status: 0
    },

    start: function() {
        new Selector({
            selector: 'select[name=component_status]',
            // Serialize status field
            onSelect: function(instance, option) {
                componentsModule.modules.status.data.status = option.getAttribute('data-item').trim();
            },
            onOpen: function() {
                packery.packery().reloadItems();
            },
            onClose: function() {
                packery.packery().reloadItems();
            }
        })
    },

    validate: function() {
        return (componentsModule.modules.status.data.status > -1 && componentsModule.modules.status.data.status < 4);
    },

    serialize: function() {
        return componentsModule.modules.status.data;
    }

};