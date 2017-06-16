componentsModule.modules.video = {

    data: {},
    valid: {},

    YT_QUALITY: {
        'small': '240p (LQ)',
        'medium': '360p (SQ)',
        'large': '480p (HQ)',
        'hd720': '720p (HD)',
        'hd1080': '1080p (FullHD)',
        'highres': '>= 1440p (>= QHD)'
    },

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

    registerEvents: function(template, identifier, contentElement) {

        let alignOptions = template.children[6].querySelectorAll('span');
        componentsModule.initializeEvents([

            {
                // Serialize description
                event: 'change keyup',
                element: template.children[4].children[1],
                content: function(event) {
                    componentsModule.modules.video.data[identifier].video_description = event.target.value.trim();
                }
            },

            {
                // Serialize video position
                event: 'click',
                element: alignOptions,
                content: function(event) {
                    componentsModule.modules.video.data[identifier].video_align = +event.target.getAttribute('data-value');
                    alignOptions.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);

        template.children[5].addEventListener('click', function() {
            componentsModule.modules.video.removeInstance(identifier, contentElement, template);
        });

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

        componentsModule.modules.video.registerEvents(template, identifier, contentElement);

    },

    loadYouTubeVideo: function(identifier, element, path, template) {

        let video = document.createElement('div');
        video.setAttribute('id', 'youtube-player-' + identifier);

        let contentElement = element.querySelector('div.component-element-content');
        contentElement.classList.add('no-padding');
        contentElement.querySelector('div.select-image').classList.add('hide');

        let container = document.createElement('div');
        container.classList.add('iframe-container');
        container.appendChild(video);

        template.insertBefore(container, template.children[0]);
        contentElement.appendChild(template);

        let videoId = path.split('v=')[1];
        let ampersandPosition = videoId.indexOf('&');
        if(ampersandPosition !== -1)
            videoId = videoId.substring(0, ampersandPosition);

        let player = new YT.Player('youtube-player-' + identifier, {
            videoId: videoId,
            events: {
                onReady: function(event) {
                    tmp = event.target.getPlaylist();
                    template.children[1].innerText = event.target.getVideoData().title;
                    let duration = event.target.getDuration();
                    let minutes = parseInt(duration / 60, 10);
                    let seconds = duration % 60;
                    template.children[2].innerText = minutes + ':' + pad(Math.round(seconds), 2);
                    event.target.setPlaybackQuality('medium');
                },
                onStateChange: function(event) {
                    template.children[3].innerText = (event.target.getAvailableQualityLevels()[0] !== undefined)
                    ? componentsModule.modules.video.YT_QUALITY[event.target.getAvailableQualityLevels()[0]]
                    : '';
                }
            }
        });

        componentsModule.modules.video.registerEvents(template, identifier, contentElement);

    },

    loadVimeoVideo: function(identifier, element, path, template) {

        let video = getJson('https://vimeo.com/api/oembed.json?url=' + path);

        let contentElement = element.querySelector('div.component-element-content');
        contentElement.classList.add('no-padding');
        contentElement.querySelector('div.select-image').classList.add('hide');

        let container = document.createElement('div');
        container.classList.add('iframe-container');
        container.insertAdjacentHTML('afterbegin', video.html);

        template.insertBefore(container, template.children[0]);
        contentElement.appendChild(template);

        template.children[1].innerText = video.title;
        let duration = video.duration;
        let minutes = parseInt(duration / 60, 10);
        let seconds = duration % 60;
        template.children[2].innerText = minutes + ':' + pad(Math.round(seconds), 2);

        let channelURL = document.createElement('a');
        channelURL.setAttribute('href', video.author_url);
        channelURL.setAttribute('target', '_blank');
        channelURL.innerText = video.author_name;
        template.children[3].appendChild(channelURL);

        componentsModule.modules.video.registerEvents(template, identifier, contentElement);

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
                componentsModule.modules.video.loadYouTubeVideo(identifier, element, path, template);
                break;
            case 1:
                componentsModule.modules.video.loadVimeoVideo(identifier, element, path, template);
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
            },

            {
                // Add external video with URL
                event: 'keyup',
                element: element.querySelector('input[name=component_inline_video_input]'),
                content: function(event) {
                    if(event.keyCode !== 13 || event.target.value.trim().length < 4) return false;
                    componentsModule.modules.video.onSelect(identifier, element, event.target.value.trim(), true);
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