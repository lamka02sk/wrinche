import Utils from '../../../scripts/Modules/Utils';

let title = {

    start() {

        // Save elements
        title.parentElement = document.querySelector('[data-component=title]');
        title.inputElement  = title.parentElement.querySelector('input');
        title.titleElement  = document.querySelector('.mainline-heading');

        Utils.registerEvent({

            event  : 'keydown keyup change',
            element: title.inputElement,
            content: event => {

                const substring = event.target.value.trim().substr(0, 16);
                title.titleElement.innerText = substring.length === 16 ? substring + '...' : substring;

            }

        });

    },

    resume() {

        // Save current instance
        const data = title.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const object = JSON.parse(data);
        title.inputElement.value = object.title;

        Utils.triggerEvent(title.inputElement, 'change');

    },

    validate() {

        const data = title.serialize().title;

        return (data.length < 101 && data.length > 0);

    },

    serialize() {

        return {
            title: title.inputElement.value.trim()
        }

    }

};

module.exports = title;