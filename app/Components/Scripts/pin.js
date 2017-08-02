componentsModule.modules.pin = {

    start: function() {

        // Save elements
        let current = componentsModule.modules.pin;
        current.parentElement = document.querySelector('[data-component=pin]');
        current.checkElement = current.parentElement.querySelector('input');

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.pin;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const object               = JSON.parse(data);
        current.checkElement.checked = !!(object.pin);

    },

    validate: function() {

        const data = componentsModule.modules.pin.serialize().pin;

        return (typeof data === 'boolean');

    },

    serialize: function() {

        return {
            pin: !!(componentsModule.modules.pin.checkElement.checked)
        }

    }

};