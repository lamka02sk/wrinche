componentsModule.modules.attachments = {

    start: function() {

        // Save elements
        let current             = componentsModule.modules.attachments;
        current.parentElement   = document.querySelector('[data-component=attachments]');
        current.listElement     = current.parentElement.querySelector('.attachments-list');
        current.templateElement = current.parentElement.querySelector('#template_component_attachments_added').childNodes[0];

        // Delegate events
        componentsModule.initializeEvent({

            event  : 'click',
            element: current.parentElement,
            content: function(event) {

                // Open MediaManager
                if(event.target.matches('.add-attachment')) {

                    let type = event.target.getAttribute('data-content');

                    managerActiveInstance = new MediaManager({
                        manager : type,
                        onSelect: function(path) {

                            current.addNew(path, type);

                        }
                    });

                }

                // Remove attachment
                else if(event.target.matches('.attachment-remove')) {

                    current.listElement.removeChild(event.target.parentNode);

                    reloadPackery();

                }

            }

        });

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.attachments;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const attachments = JSON.parse(data).attachments;

        if(attachments === null)
            return true;

        const attachmentTypes       = ['images', 'videos', 'sounds', 'files'];
        const attachmentDefinitions = [
            'app/Data/Files/Images/', 'app/Data/Files/Videos/', 'app/Data/Files/Sounds/', 'app/Data/Files/Files/'
        ];

        Array.from(attachments).forEach(function(attachment) {

            const typeNumber = attachmentDefinitions.findIndex(function(definition) {
                return ~attachment.indexOf(definition);
            });

            attachment = attachment.replace(attachmentDefinitions[typeNumber], '');

            current.addNew(attachment, attachmentTypes[typeNumber]);

        });

    },

    isDuplicate: function(path) {

        return ~componentsModule.modules.attachments.serialize().attachments.indexOf(path);

    },

    addNew: function(path, type) {

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

        let current    = componentsModule.modules.attachments;
        let pathPrefix = 'app/Data/Files/';
        let fileType   = types[type][1];
        let text       = path;

        path = pathPrefix + types[type][0] + '/' + path;

        if(current.isDuplicate(path))
            return closeMediaManager();

        let template = current.templateElement.cloneNode(true);

        template.classList.add('component-instance');
        template.setAttribute('data-path', path);
        template.classList.add('icon-' + fileType);
        template.childNodes[1].innerText = text;

        current.listElement.insertBefore(template, current.listElement.childNodes[0]);

        closeMediaManager();
        reloadPackery();

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        let attachmentsElements = componentsModule.modules.attachments.listElement.childNodes;
        let attachmentsList     = Array.from(attachmentsElements).reverse()
            .map(function(element) {
                return element.getAttribute('data-path');
            });

        return {

            attachments: attachmentsList

        }

    }

};