import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";

let header = {

    start() {

        // Save elements
        header.parentElement   = document.querySelector('[data-component=header_image]');
        header.inputBox        = header.parentElement.querySelector('.input-box');
        header.mediaButton     = header.inputBox.querySelector('.image_manager');
        header.mediaInput      = header.inputBox.querySelector('input');
        header.messageElement  = header.inputBox.querySelector('.validate-message');
        header.templateElement = header.parentElement.querySelector('#template_component_header-image_image').childNodes[0];

        // Events
        Utils.registerEvents([

            {
                // Delegate click events
                event  : 'click',
                element: header.parentElement,
                content(event) {

                    // Open MediaManager
                    if(event.target.matches('.image_manager')) {

                        Global.managerActiveInstance = new Global.MediaManager({
                            manager : 'images',
                            onSelect(path) {

                                header.addNew(path, false);

                            }
                        });

                    }

                    // Remove header image
                    else if(event.target.matches('.header_image-remove')) {

                        header.inputBox.classList.remove('hide');

                        header.parentElement.removeChild(
                            header.parentElement.querySelector('div.component-instance')
                        );

                        Global.packery.reloadItems();

                    }

                }
            },

            {
                // Enter custom URL to image
                event  : 'keypress',
                element: header.mediaInput,
                content(event) {

                    if(!event.keyCode || event.keyCode !== 13)
                        return false;

                    let path = event.target.value.trim();

                    header.validateInput(path, function() {

                        header.addNew(path, true);

                    });

                }
            },

            {
                // Real-time URL validation
                event  : 'change keyup',
                element: header.mediaInput,
                content(event) {

                    header.validateInput(event.target.value.trim());

                }
            }

        ]);

    },

    resume() {

        // Save current instance
        const data  = header.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const headerImage = JSON.parse(data).header_image;

        if(headerImage === '')
            return true;

        header.addNew(headerImage, !(~headerImage.indexOf('app/Data/Files/Images/')));

    },

    removeCurrent(parent) {

        if(parent.querySelector('div.header_image-image.component-instance'))
            parent.removeChild(
                parent.querySelector('div.header_image-image.component-instance')
            );

    },

    // --------------------------------------------------------

    addNew(path, outside) {

        path = path.replace('app/Data/Files/Images/', '');

        let text     = path;
        let template = header.templateElement.cloneNode(true);

        header.removeCurrent(header.parentElement);
        header.inputBox.value = '';

        if(!outside)
            path = 'app/Data/Files/Images/' + path;

        template.setAttribute('data-path', path);
        template.classList.add('component-instance');

        template.childNodes[0].setAttribute('src', path);
        template.childNodes[0].setAttribute('alt', path);

        template.childNodes[1].innerText = text;

        header.parentElement.appendChild(template);

        header.inputBox.classList.add('hide');

        Utils.closeMediaManager();
        Global.packery.reloadItems();

    },

    // ---------------------------------------

    validateInput(path, onSuccess, onError) {

        if(!Utils.validateUrl(path))
            return Utils.showValidationResults(
                header.messageElement, 'COMPONENT_URL_INVALID', false, Global.packery.reloadItems
            );

        new Promise(function(resolve) {

            let image = new Image;

            image.onload = function() {
                resolve(true);
            };

            image.onerror = function() {
                resolve(false);
            };

            image.src     = path;

        }).then(function(result) {

            if(result) {

                Utils.showValidationResults(
                    header.messageElement, 'COMPONENT_URL_INVALID', true, Global.packery.reloadItems
                );

                if(onSuccess)
                    onSuccess();

            } else {

                Utils.showValidationResults(
                    header.messageElement, 'COMPONENT_URL_INVALID', false, Global.packery.reloadItems
                );

                if(onError)
                    onError();

            }

        });

    },

    validate() {

        return true;

    },

    serialize() {

        let instance = header.parentElement.querySelector('div.header_image-image.component-instance');
        let data     = '';

        if(instance)
            data = instance.getAttribute('data-path');

        return {
            header_image: data
        };

    }

};

module.exports = header;