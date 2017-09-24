import Utils from "../../../scripts/Modules/Utils";

let perex = {

    start: function() {

        // Save elements
        perex.parentElement = document.querySelector('[data-component=perex]');
        perex.dateInput     = perex.parentElement.querySelector('[name=component_perex_date]');
        perex.locationInput = perex.parentElement.querySelector('[name=component_perex_location]');

        // Clear date input
        Utils.registerEvent({

            event  : 'click',
            element: perex.parentElement.querySelector('.clear-perex-date'),
            content: function() {
                perex.dateInput.value = '';
            }

        });

    },

    resume: function() {

        // Save current instance
        const data  = perex.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const object = JSON.parse(data);

        perex.dateInput.value     = object.perex_date;
        perex.locationInput.value = object.perex_location;

        Utils.triggerEvent(perex.locationInput, 'change');

    },

    validate: function() {

        const data = perex.serialize().perex_location;

        return (data.length < 121);

    },

    serialize: function() {

        return {
            perex_date    : perex.dateInput.value.trim(),
            perex_location: perex.locationInput.value.trim()
        }

    }

};

module.exports = perex;