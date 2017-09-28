import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";

let gallery = {

    data: {},

    validate() {
        return true;
    },

    serialize() {
        return gallery.data;
    },

    resumeInline(identifier, element, resumeData) {

        gallery.create(identifier, element);

        resumeData.gallery.forEach(function(image) {
            gallery.onSelect(identifier, element, image, true);
        });

    },

    validateInput(identifier, element, path, onSuccess) {

        if(!/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(path)) {
            Utils.showValidationResults(element, 'COMPONENT_URL_INVALID', false);
            return false;
        }

        let promise = new Promise(function(resolve, reject) {
            let image     = new Image;
            image.onload  = function() {
                resolve(true);
            };
            image.onerror = function() {
                resolve(false);
            };
            image.src     = path;
        });

        promise.then(function(result) {

            if(result) {
                Utils.showValidationResults(element, '', true);
                if(onSuccess) onSuccess(identifier, element, path, true);
                return true;
            }

            Utils.showValidationResults(element, 'COMPONENT_URL_INVALID', false);

        });

    },

    onSelect(identifier, element, path, outside) {

        let contentElement = element.querySelector('div.gallery-items');
        contentElement.classList.remove('no-padding');

        // Create source link
        if(!outside)
            path = 'app/Data/Files/Images/' + path;

        // Check gallery data
        if(gallery.data[identifier]) {

            if(~gallery.data[identifier].gallery.indexOf(path)) {

                Global.closeMediaManager();
                return false;

            }

            gallery.data[identifier].gallery.push(path);

        } else
            gallery.data[identifier] = {
                title   : '',
                gallery : [path],
                disabled: 0
            };

        // Create template
        if(!gallery.templateElement)
            gallery.templateElement = element.querySelector('#template_component_gallery_item').children[0].cloneNode(true);

        let template = gallery.templateElement.cloneNode(true);

        template.setAttribute('data-path', path);
        template.classList.add('component-instance');

        template.children[0].children[0].setAttribute('src', path);
        template.children[0].children[0].setAttribute('alt', path);

        // Remove image
        template.children[1].addEventListener('click', function() {

            contentElement.removeChild(template);

            for(let i = 0; i < gallery.data[identifier].gallery.length; ++i) {

                if(gallery.data[identifier].gallery[i] === path)
                    gallery.data[identifier].gallery.splice(i, 1);

            }

        });

        // Show image
        contentElement.appendChild(template);

        // Hide Media manager
        if(!outside)
            document.querySelector('div.media-manager span.close-manager').click();

    },

    create(identifier, element) {

        Utils.registerEvents([

            {
                // Open Media Manager
                event  : 'click',
                element: element.querySelector('button.inline-image_manager'),
                content() {

                    Global.managerActiveInstance = new Global.MediaManager({
                        manager: 'images',
                        onSelect(path) {
                            gallery.onSelect(identifier, element, path, false);
                        }
                    });

                }
            },

            {
                // Enter custom URL to image
                event  : 'keypress',
                element: element.querySelector('input[name=component_inline_picture_input]'),
                content(event) {

                    if(event.keyCode && event.keyCode === 13) {

                        let path = event.target.value.trim();

                        gallery.validateInput(
                            identifier, element, path,
                            gallery.onSelect
                        );

                    }

                }
            },

            {
                // Validate image URL
                event  : 'change keyup',
                element: element.querySelector('input[name=component_inline_picture_input]'),
                content(event) {

                    gallery.validateInput(
                        identifier, element, event.target.value.trim()
                    );

                }
            }

        ]);

    }

};

module.exports = gallery;