import Utils from '../../../scripts/Modules/Utils';

let excerpt = {

    start() {

        // Save elements
        excerpt.parentElement = document.querySelector('[data-component=excerpt]');
        excerpt.inputElement  = excerpt.parentElement.querySelector('textarea');
        excerpt.excerptBox    = document.querySelector('.header-description');

        Utils.registerEvent({

            event  : 'keydown keyup change',
            element: excerpt.inputElement,
            content: function(event) {

                let value    = event.target.value.trim();
                const length = value.length;

                if(length > 36)
                    value = value.substr(0, 36) + '...';

                excerpt.excerptBox.innerText = value;

            }

        });

    },

    resume() {

        // Save current instance
        const data  = excerpt.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const object = JSON.parse(data);
        excerpt.inputElement.value = object.excerpt;

        Utils.triggerEvent(excerpt.inputElement, 'change');

    },

    validate() {

        const data = excerpt.serialize().excerpt;

        return (data.length < 361);

    },

    serialize() {

        return {
            excerpt: excerpt.inputElement.value.trim()
        }

    }

};

module.exports = excerpt;