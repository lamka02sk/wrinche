componentsModule.modules.video = {

    data: {},
    valid: {},

    videoType: function(path) {

        // Vimeo
        if(/^((?:https?:)?\/\/)?((?:www|m|player)\.)?((?:vimeo\.com))(?:$|\/|)(\S+)?$/gm.test(path))
            return 1;
        // YouTube
        else if(/(https?:\/\/.*?youtube\.com)\/watch\?v=(.*)/igm.test(path))
            return 0;
        // External videos
        else
            return -1;

    },

    loadExternalVideo: function(identifier, element, path, template) {

        // Close media manager
        document.querySelector('div.media-manager span.close-manager').click();

        let video = document.createElement('video');
        video.setAttribute('src', path);
        video.classList.add('item-player');
        video.setAttribute('controls', 'true');
        video.volume = .5;

        let contentElement = element.querySelector('div.component-element-content');
        contentElement.classList.add('no-padding');
        contentElement.querySelector('div.select-image').classList.add('hide');

        template.insertBefore(video, template.children[0]);
        contentElement.appendChild(template);

        template.children[1].innerText = path;
        video.addEventListener('loadedmetadata', function() {
            let duration = video.duration;
            let minutes = parseInt(duration / 60, 10);
            let seconds = duration % 60;
            let time = minutes + ':' + pad(Math.round(seconds), 2);
            let width = video.videoWidth;
            let height = video.videoHeight;
            let dimensions = width + 'x' + height;
            template.children[2].innerText = time;
            template.children[3].innerText = dimensions;
        });

        template.children[5].addEventListener('click', function() {
            componentsModule.modules.video.removeInstance(identifier, contentElement, template);
        });

    },

    removeInstance: function(identifier, contentElement, template) {

        contentElement.querySelector('div.input-box.select-image').classList.remove('hide');
        contentElement.removeChild(template);
        contentElement.classList.remove('no-padding');
        delete componentsModule.modules.video.data[identifier];

    },

    remove: function(element) {

        element.querySelectorAll('div.component-instance').forEach(function(item) {
            item.querySelector('span.item-remove').click();
        });

    },

    onSelect: function(identifier, element, path, outside) {

        // Remove current video if any
        componentsModule.modules.video.remove(element);

        // Create path
        if(!outside)
            path = 'app/Data/Files/Videos/' + path;

        // Save image path and create instance data
        componentsModule.modules.video.data[identifier] = {
            title: '',
            video: path,
            video_description: false,
            video_align: 1,
            type: -1,
            valid: true,
            disabled: 0
        };

        // Get video type
        let type = componentsModule.modules.video.videoType(path);

        // Create template
        let template = element.querySelector('#template_component_content_video_item').children[0].cloneNode(true);
        template.setAttribute('data-path', path);

        // Load video by type
        switch(type) {
            case -1:
                componentsModule.modules.video.loadExternalVideo(identifier, element, path, template);
                break;
            case 0:
                
                break;
            case 1:

                break;
            default:
                return false;
                break;
        }

    },

    create: function(identifier, element) {
        componentsModule.initializeEvents([

            {
                // Open media manager
                event: 'click',
                element: element.querySelector('button.inline-image_manager'),
                content: function() {
                    managerActiveInstance = new MediaManager({
                        manager: 'videos',
                        onSelect: function(path) {
                            componentsModule.modules.video.onSelect(identifier, element, path, false);
                        }
                    });
                }
            }

        ]);
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.video.data;
    }

};