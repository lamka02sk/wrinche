import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";

let attachments = {

    start() {

        // Save elements
        attachments.parentElement   = document.querySelector('[data-component=attachments]');
        attachments.listElement     = attachments.parentElement.querySelector('.attachments-list');
        attachments.templateElement = attachments.parentElement.querySelector('#template_component_attachments_added').childNodes[0];

        // Delegate events
        Utils.registerEvent({

            event  : 'click',
            element: attachments.parentElement,
            content: function(event) {

                // Open MediaManager
                if(event.target.matches('.add-attachment')) {

                    let type = event.target.getAttribute('data-content');

                    Global.managerActiveInstance = new Global.MediaManager({
                        manager : type,
                        onSelect: function(path) {

                            attachments.addNew(path, type);

                        }
                    });

                }

                // Remove attachment
                else if(event.target.matches('.attachment-remove')) {

                    attachments.listElement.removeChild(event.target.parentNode);
                    Global.packery.reloadItems();

                }

            }

        });

    },

    resume() {

        // Save attachments instance
        const data = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const attachments = JSON.parse(data).attachments;

        if(attachments === null)
            return true;

        const attachmentTypes       = ['images', 'videos', 'sounds', 'files'];
        const attachmentDefinitions = [
            'app/Data/Files/Images/', 'app/Data/Files/Videos/', 'app/Data/Files/Sounds/', 'app/Data/Files/Files/'
        ];

        Array.from(attachments).forEach(attachment => {

            const typeNumber = attachmentDefinitions.findIndex(function(definition) {
                return ~attachment.indexOf(definition);
            });

            attachment = attachment.replace(attachmentDefinitions[typeNumber], '');

            this.addNew(attachment, attachmentTypes[typeNumber]);

        });

    },

    isDuplicate(path) {

        return ~attachments.serialize().attachments.indexOf(path);

    },

    addNew(path, type) {

        const types = {
            images: [
                'Images',
                'image'
            ],
            videos: [
                'Videos',
                'video'
            ],
            sounds: [
                'Sounds',
                'audio'
            ],
            files : [
                'Files',
                'file'
            ]
        };

        let pathPrefix = 'app/Data/Files/';
        let fileType   = types[type][1];
        let text       = path;

        path = pathPrefix + types[type][0] + '/' + path;

        if(attachments.isDuplicate(path))
            return Utils.closeMediaManager();

        let template = attachments.templateElement.cloneNode(true);

        template.classList.add('component-instance');
        template.setAttribute('data-path', path);
        template.classList.add('icon-' + fileType);
        template.childNodes[1].innerText = text;

        attachments.listElement.insertBefore(template, attachments.listElement.childNodes[0]);

        Utils.closeMediaManager();
        Global.packery.reloadItems();

    },

    validate() {

        return true;

    },

    serialize() {

        let attachmentsElements = attachments.listElement.childNodes;
        let attachmentsList     = Array.from(attachmentsElements).reverse()
            .map(function(element) {
                return element.getAttribute('data-path');
            });

        return {

            attachments: attachmentsList

        }

    }

};

module.exports = attachments;