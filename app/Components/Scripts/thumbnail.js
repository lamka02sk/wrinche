import Utils from "../../../scripts/Modules/Utils";
import Global from '../../../scripts/Modules/Global';

let thumbnail = {

    start() {

        // Save elements
        thumbnail.parentElement   = document.querySelector('[data-component=thumbnail]');
        thumbnail.inputBox        = thumbnail.parentElement.querySelector('.input-box');
        thumbnail.mediaButton     = thumbnail.inputBox.querySelector('.image_manager');
        thumbnail.mediaInput      = thumbnail.inputBox.querySelector('input');
        thumbnail.messageElement  = thumbnail.inputBox.querySelector('.validate-message');
        thumbnail.templateElement = thumbnail.parentElement.querySelector('#template_component_thumbnail_image').childNodes[0];

        // Events
        Utils.registerEvents([

            {
                // Delegate click events
                event  : 'click',
                element: thumbnail.parentElement,
                content(event) {

                    // Open MediaManager
                    if(event.target.matches('.image_manager')) {

                        Global.managerActiveInstance = new Global.MediaManager({
                            manager : 'images',
                            onSelect(path) {

                                thumbnail.addNew(path, false);

                            }
                        });

                    }

                    // Remove thumbnail
                    else if(event.target.matches('.thumbnail-remove')) {

                        thumbnail.inputBox.classList.remove('hide');

                        thumbnail.parentElement.removeChild(
                            thumbnail.parentElement.querySelector('div.component-instance')
                        );

                        Global.packery.reloadItems();

                    }

                }
            },

            {
                // Enter custom URL to image
                event  : 'keypress',
                element: thumbnail.mediaInput,
                content(event) {

                    if(!event.keyCode || event.keyCode !== 13)
                        return false;

                    let path = event.target.value.trim();

                    thumbnail.validateInput(path, function() {

                        thumbnail.addNew(path, true);

                    });

                }
            },

            {
                // Real-time URL validation
                event  : 'change keyup',
                element: thumbnail.mediaInput,
                content(event) {

                    thumbnail.validateInput(event.target.value.trim());

                }
            }

        ]);

    },

    resume() {

        // Save current instance
        const data  = thumbnail.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const thumb = JSON.parse(data).thumbnail;

        if(thumb === '')
            return true;

        thumbnail.addNew(thumb, !(~thumb.indexOf('app/Data/Files/Images/')));

    },

    removeCurrent(parent) {

        if(parent.querySelector('div.thumbnail-image.component-instance'))
            parent.removeChild(
                parent.querySelector('div.thumbnail-image.component-instance')
            );

    },

    addNew(path, outside) {

        path = path.replace('app/Data/Files/Images/', '');

        let text     = path;
        let template = thumbnail.templateElement.cloneNode(true);

        thumbnail.removeCurrent(thumbnail.parentElement);
        thumbnail.inputBox.value = '';

        if(!outside)
            path = 'app/Data/Files/Images/' + path;

        template.setAttribute('data-path', path);
        template.classList.add('component-instance');

        template.childNodes[0].setAttribute('src', path);
        template.childNodes[0].setAttribute('alt', path);

        template.childNodes[1].innerText = text;

        thumbnail.parentElement.appendChild(template);

        thumbnail.inputBox.classList.add('hide');

        Utils.closeMediaManager();
        Global.packery.reloadItems();

    },

    validateInput(path, onSuccess, onError) {

        if(!Utils.validateUrl(path))
            return Utils.showValidationResults(
                thumbnail.messageElement, 'COMPONENT_URL_INVALID', false, Global.packery.reloadItems
            );

        new Promise(function(resolve) {

            let image = new Image;

            image.onload = function() {
                resolve(true);
            };

            image.onerror = function() {
                resolve(false);
            };

            image.src = path;

        }).then(function(result) {

            if(result) {

                Utils.showValidationResults(
                    thumbnail.messageElement, 'COMPONENT_URL_INVALID', true, Global.packery.reloadItems
                );

                if(onSuccess)
                    onSuccess();

            } else {

                Utils.showValidationResults(
                    thumbnail.messageElement, 'COMPONENT_URL_INVALID', false, Global.packery.reloadItems
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

        let instance = thumbnail.parentElement.querySelector('div.thumbnail-image.component-instance');
        let data     = '';

        if(instance)
            data = instance.getAttribute('data-path');

        return {
            thumbnail: data
        };

    }

};

module.exports = thumbnail;