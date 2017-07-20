componentsModule.modules.perex = {

    data: {
        perex_date: '',
        perex_location: ''
    },

    validatePlace: function() {
        return (componentsModule.modules.perex.data.perex_location.length < 121);
    },

    validate: function() {
        return componentsModule.modules.perex.validatePlace();
    },

    serialize: function() {
        return componentsModule.modules.perex.data;
    },

    events: [

        {
            // Update perex date data
            event: 'change',
            element: document.querySelector('input[name=component_perex_date]'),
            content: function(event) {
                componentsModule.modules.perex.data.perex_date = event.target.value.trim();
            }
        },

        {
            // Update perex place data
            event: 'change keyup',
            element: document.querySelector('input[name=component_perex_location]'),
            content: function(event) {
                componentsModule.modules.perex.data.perex_location = event.target.value.trim();
            }
        },

        {
            // Clear date input
            event: 'click',
            element: document.querySelector('span.clear-input.clear-perex-date'),
            content: function(event) {
                event.target.parentNode.querySelector('input[name=component_perex_date]').value = '';
                componentsModule.modules.perex.data.perex_date = '';
            }
        }

    ]

};