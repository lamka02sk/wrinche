componentsModule.modules.perex = {

    data: {
        date: '',
        place: ''
    },

    validatePlace: function() {
        return (componentsModule.modules.perex.data.place.length < 121);
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
                componentsModule.modules.perex.data.date = event.target.value.trim();
            }
        },

        {
            // Update perex place data
            event: 'change keyup',
            element: document.querySelector('input[name=component_perex_location]'),
            content: function(event) {
                componentsModule.modules.perex.data.place = event.target.value.trim();
            }
        }

    ]

};