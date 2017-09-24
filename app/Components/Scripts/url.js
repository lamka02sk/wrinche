import Utils from '../../../scripts/Modules/Utils';
import Ajax from "../../../scripts/Modules/Ajax";
import Router from "../../../scripts/Modules/Router";
import Global from "../../../scripts/Modules/Global";

let url = {

    isFree() {

        let response = true;

        // Check if slug is in use
        Ajax.post(
            Router.createLink('api/articles.exists.url'),
            {
                api: {
                    url   : url.serialize().url,
                    ignore: document.querySelector('div.content-wrapper').getAttribute('data-id')
                }
            },
            function(data, status) {

                if(status === 'success' && data.success === true)
                    response = !(data.data.result);

            }
        );
        
        return response;

    },

    start() {

        // Save elements
        url.parentElement  = document.querySelector('[data-component=url]');
        url.inputElement   = url.parentElement.querySelector('input');
        url.messageElement = url.parentElement.querySelector('.validate-message');

        // Real-time url validation
        Utils.registerEvent({

            event  : 'keyup change',
            element: url.inputElement,
            content: function() {

                Utils.showValidationResults(
                    url.messageElement,
                    'COMPONENT_URL_INVALID',
                    url.validate()
                );

            }

        });

    },

    resume() {

        // Save current instance
        const data = url.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const object = JSON.parse(data);
        url.inputElement.value = object.url;

        Utils.triggerEvent(url.inputElement, 'change');

    },

    validate() {

        const data  = url.serialize().url;

        if(!/^[a-z][a-z0-9\-]+[a-z]$/.test(data))
            return false;

        if(data.length < 3 || data.length > 120)
            return false;

        return (url.isFree());

    },

    serialize() {

        return {
            url: url.inputElement.value.trim()
        }

    }

};

module.exports = url;