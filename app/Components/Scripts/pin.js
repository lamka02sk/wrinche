let pin = {

    start: function() {

        // Save elements
        pin.parentElement = document.querySelector('[data-component=pin]');
        pin.checkElement = pin.parentElement.querySelector('input');

    },

    resume: function() {

        // Save current instance
        const data  = pin.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const object = JSON.parse(data);
        pin.checkElement.checked = !!(object.pin);

    },

    validate: function() {

        const data = pin.serialize().pin;

        return (typeof data === 'boolean');

    },

    serialize: function() {

        return {
            pin: !!(pin.checkElement.checked)
        }

    }

};

module.exports = pin;