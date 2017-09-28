import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";

let picture = {

    data    : {},
    elements: {},

    start() {

        // Save elements
        picture.contentElement = document.querySelector('.content-wrapper');
        picture.templateElement = picture.contentElement.querySelector('#template_component_content_picture_image').children[0];

    },

    resumeInline(identifier, element, resumeData) {

        let path = resumeData.picture;
        picture.create(identifier, element);

        picture.onSelect(identifier, element, path, true, function(description, align) {

            description.value = resumeData.picture_description.trim();
            Utils.triggerEvent(description, 'change');

            align[resumeData.picture_align].click();

        });

    },

    validateInput(path, identifier, onSuccess, onError) {

        let elements = picture.elements[identifier];

        if(!Utils.validateUrl(path))
            return Utils.showValidationResults(
                elements.messageBox, 'COMPONENT_URL_INVALID', false
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
                    elements.messageBox, 'COMPONENT_URL_INVALID', true
                );

                if(onSuccess)
                    onSuccess();

            } else {

                Utils.showValidationResults(
                    elements.messageBox, 'COMPONENT_URL_INVALID', false
                );

                if(onError)
                    onError();

            }

        });

    },

    removeCurrent(element) {

        let instance = element.querySelector('div.component-instance span.picture-remove');

        if(instance)
            instance.click();

    },

    onSelect(identifier, element, path, outside, callback) {

        let elements = picture.elements[identifier];
        elements.contentElement.classList.add('no-padding');

        // Remove current image
        picture.removeCurrent(element);

        // Create source link
        if(!outside)
            path = 'app/Data/Files/Images/' + path;

        // Save image path
        picture.data[identifier] = {
            picture            : path,
            picture_description: '',
            picture_align      : 1
        };

        // Create template
        let template = picture.templateElement.cloneNode(true);

        template.setAttribute('data-path', path);
        template.classList.add('component-instance');

        template.children[0].setAttribute('src', path);
        template.children[0].setAttribute('alt', path);

        elements.contentElement.appendChild(template);

        // Hide media manager
        template.children[0].addEventListener('load', function() {

            Utils.closeMediaManager();
            elements.inputBox.classList.add('hide');

        });

        let alignOptions = Array.from(template.children[3].children);

        Utils.registerEvents([

            {
                // Serialize description
                event  : 'change keyup',
                element: template.children[2],
                content(event) {

                    picture.data[identifier].picture_description = event.target.value.trim();

                }
            },

            {
                // Align picture
                event  : 'click',
                element: alignOptions,
                content(event) {

                    picture.data[identifier].picture_align = +event.target.getAttribute('data-value');

                    Object.values(alignOptions).forEach(function(item) {

                        item.classList.remove('active');

                    });

                    event.target.classList.add('active');

                }
            }

        ]);

        // Remove image
        template.children[1].addEventListener('click', function() {

            elements.inputBox.classList.remove('hide');
            elements.contentElement.removeChild(template);
            elements.contentElement.classList.remove('no-padding');

            delete picture.data[identifier];

        });

        if(callback)
            callback(template.children[2], alignOptions);

    },

    create(identifier, element) {

        picture.elements[identifier] = {};

        // Prepare basic data
        picture.data[identifier] = {
            title   : '',
            disabled: 0
        };

        let elements            = picture.elements[identifier];
        elements.parentElement  = element;
        elements.contentElement = element.querySelector('div.component-element-content');
        elements.inputBox       = elements.contentElement.querySelector('div.input-box.select-image');
        elements.messageBox     = elements.inputBox.querySelector('.validate-message');

        Utils.registerEvents([

            {
                // Open Media Manager
                event  : 'click',
                element: element.querySelector('button.inline-image_manager'),
                content() {

                    Global.managerActiveInstance = new Global.MediaManager({
                        manager : 'images',
                        onSelect(path) {

                            picture.onSelect(identifier, element, path, false);

                        }
                    });

                }
            },

            {
                // Enter custom URL to image
                event  : 'keypress',
                element: element.querySelector('input[name=component_inline_picture_input]'),
                content(event) {

                    if(!event.keyCode || event.keyCode !== 13)
                        return false;

                    let path = event.target.value.trim();

                    picture.validateInput(path, identifier, function() {

                        picture.onSelect(identifier, element, path, true);

                    });

                }
            },

            {
                // Real-time URL validation
                event  : 'change keyup',
                element: element.querySelector('input[name=component_inline_picture_input]'),
                content(event) {

                    picture.validateInput(event.target.value.trim(), identifier);

                }
            }

        ]);
    },

    validate() {

        return true;

    },

    serialize() {

        return picture.data;

    }

};

module.exports = picture;