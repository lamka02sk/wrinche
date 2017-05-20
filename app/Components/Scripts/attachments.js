componentsModule.modules.attachments = {

    attachmentsElement: document.querySelector('label[for=component_attachments]').parentNode,
    attachmentsList:document.querySelector('label[for=component_attachments]').parentNode.querySelector('div.attachments-list'),

    data: {
        attachments: []
    },

    addNew: function(path, type) {
        let prePath = 'app/Data/Files/';
        let fileType;
        switch(type) {
            case 'images':
                path = prePath + 'Images/' + path;
                fileType = 'image';
                break;
            case 'videos':
                path = prePath + 'Videos/' + path;
                fileType = 'video';
                break;
            case 'sounds':
                path = prePath + 'Sounds/' + path;
                fileType = 'audio';
                break;
            default:
                path = prePath + 'Files/' + path;
                fileType = 'file';
                break;
        }
        if(componentsModule.modules.attachments.data.attachments.indexOf(path) !== -1) {
            $('div.media-manager span.close-manager').click();
            return false;
        }
        let template = componentsModule.modules.attachments.attachmentsElement.querySelector('#template_component_attachments_added').childNodes[0].cloneNode(true);
        template.classList.add('component-instance');
        template.setAttribute('data-path', path);
        template.classList.add('icon-' + fileType);
        template.childNodes[1].innerText = path;
        componentsModule.modules.attachments.attachmentsList.insertBefore(template, componentsModule.modules.attachments.attachmentsList.childNodes[0]);
        componentsModule.modules.attachments.data.attachments.push(path);
        template.querySelector('span.attachment-remove').addEventListener('click', function() {
            template.parentNode.removeChild(template);
            componentsModule.modules.attachments.data.attachments.splice(componentsModule.modules.attachments.data.attachments.indexOf(path), 1);
            packery.packery().reloadItems();
        });
        $('div.media-manager span.close-manager').click();
        packery.packery().reloadItems();
    },
    
    serialize: function() {
        return componentsModule.modules.attachments.data.attachments;
    },

    validate: function() {
        return true;
    },

    events: [

        {
            // Open media manager on click
            event: 'click',
            element: document.querySelector('label[for=component_attachments]').parentNode.querySelectorAll('button.add-attachment'),
            content: function(event) {
                let type = event.target.getAttribute('data-content');
                managerActiveInstance = new MediaManager({
                    manager: type,
                    onSelect: function(path) {
                        componentsModule.modules.attachments.addNew(path, type);
                    }
                });
            }
        }

    ]

};