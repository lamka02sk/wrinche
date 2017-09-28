import Utils from "../../../scripts/Modules/Utils";
import Ajax from "../../../scripts/Modules/Ajax";
import Global from "../../../scripts/Modules/Global";

let video = {

    data: {},
    valid: {},

    YT_QUALITY: {
        'small': '240p (LQ)',
        'medium': '360p (SQ)',
        'large': '480p (HQ)',
        'hd720': '720p (HD)',
        'hd1080': '1080p (FullHD)',
        'highres': '1440p+ (QHD+)'
    },

    resumeInline(identifier, element, resumeData) {

        let path = resumeData.video;
        video.create(identifier, element);

        video.onSelect(identifier, element, path, true, function(description, align) {

            let descriptionText = resumeData.video_description.trim();

            if(descriptionText === 'false')
                descriptionText = '';

            description.value = descriptionText;
            Utils.triggerEvent(description, 'change');

            align[resumeData.video_align].click();

        });

    },

    videoType(path) {

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

    registerEvents(template, identifier, contentElement, callback) {

        let alignOptions = template.children[6].querySelectorAll('span');

        Utils.registerEvents([

            {
                // Serialize description
                event: 'change keyup',
                element: template.children[4].children[1],
                content(event) {
                    video.data[identifier].video_description = event.target.value.trim();
                }
            },

            {
                // Serialize video position
                event: 'click',
                element: alignOptions,
                content(event) {
                    video.data[identifier].video_align = +event.target.getAttribute('data-value');
                    alignOptions.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);

        template.children[5].addEventListener('click', function() {
            video.removeInstance(identifier, contentElement, template);
        });

        if(callback)
            callback(template.children[4].children[1], alignOptions);

    },

    loadExternalVideo(identifier, element, path, template, callback) {

        // Close media manager
        document.querySelector('div.media-manager span.close-manager').click();

        let current = this;
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

        template.children[1].innerText = path.replace('app/Data/Files/Videos/', '');
        video.addEventListener('loadedmetadata', function() {

            let duration = video.duration;
            let minutes = parseInt(duration / 60, 10);
            let seconds = duration % 60;
            let time = minutes + ':' + Utils.pad(Math.round(seconds), 2);
            let width = video.videoWidth;
            let height = video.videoHeight;
            let dimensions = width + 'x' + height;

            template.children[2].innerText = time;
            template.children[3].innerText = dimensions;

        });

        current.registerEvents(template, identifier, contentElement, callback);

    },

    loadYouTubeVideo(identifier, element, path, template, callback) {

        let tmp;
        let current = this;
        let video = document.createElement('div');
        const id = 'youtube-player-' + identifier;
        video.setAttribute('id', id);

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

        function createPlayer() {

            new YT.Player(id, {
                videoId: videoId,
                events: {
                    onReady(event) {
                        tmp = event.target.getPlaylist();
                        template.children[1].innerText = event.target.getVideoData().title;
                        let duration = event.target.getDuration();
                        let minutes = parseInt(duration / 60, 10);
                        let seconds = duration % 60;
                        template.children[2].innerText = minutes + ':' + Utils.pad(Math.round(seconds), 2);
                        event.target.setPlaybackQuality('medium');
                    },
                    onStateChange(event) {

                        template.children[3].innerText = (event.target.getAvailableQualityLevels()[0] !== undefined)
                            ? current.YT_QUALITY[event.target.getAvailableQualityLevels()[0]]
                            : '';

                    }
                }
            });

        }

        setTimeout(createPlayer);

        current.registerEvents(template, identifier, contentElement, callback);

    },

    loadVimeoVideo(identifier, element, path, template, callback) {

        let video = Ajax.getJSON('https://vimeo.com/api/oembed.json?url=' + path);

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
        template.children[2].innerText = minutes + ':' + Utils.pad(Math.round(seconds), 2);

        let channelURL = document.createElement('a');
        channelURL.setAttribute('href', video.author_url);
        channelURL.setAttribute('target', '_blank');
        channelURL.innerText = video.author_name;
        template.children[3].appendChild(channelURL);

        this.registerEvents(template, identifier, contentElement, callback);

    },

    removeInstance(identifier, contentElement, template) {

        contentElement.querySelector('div.input-box.select-image').classList.remove('hide');
        contentElement.removeChild(template);
        contentElement.classList.remove('no-padding');
        delete video.data[identifier];

    },

    remove(element) {

        element.querySelectorAll('div.component-instance').forEach(function(item) {
            item.querySelector('span.item-remove').click();
        });

    },

    onSelect(identifier, element, path, outside, callback) {

        // Remove current video if any
        video.remove(element);

        // Create path
        if(!outside)
            path = 'app/Data/Files/Videos/' + path;

        // Save image path and create instance data
        video.data[identifier] = {
            video: path,
            video_description: false,
            video_align: 1
        };

        // Get video type
        let type = video.videoType(path);

        // Create template
        let template = element.querySelector('#template_component_content_video_item').children[0].cloneNode(true);
        template.setAttribute('data-path', path);

        // Load video by type
        switch(type) {
            case -1:
                video.loadExternalVideo(identifier, element, path, template, callback);
                break;
            case 0:
                video.loadYouTubeVideo(identifier, element, path, template, callback);
                break;
            case 1:
                video.loadVimeoVideo(identifier, element, path, template, callback);
                break;
            default:
                return false;
                break;
        }

    },

    create(identifier, element) {

        video.data[identifier] = {
            title: '',
            disabled: 0
        };

        Utils.registerEvents([

            {
                // Open media manager
                event: 'click',
                element: element.querySelector('button.inline-image_manager'),
                content() {
                    Global.managerActiveInstance = new Global.MediaManager({
                        manager: 'videos',
                        onSelect(path) {
                            video.onSelect(identifier, element, path, false);
                        }
                    });
                }
            },

            {
                // Add external video with URL
                event: 'keyup',
                element: element.querySelector('input[name=component_inline_video_input]'),
                content(event) {
                    if(event.keyCode !== 13 || event.target.value.trim().length < 4) return false;
                    video.onSelect(identifier, element, event.target.value.trim(), true);
                }
            }

        ]);
    },

    validate() {
        return true;
    },

    serialize() {
        return video.data;
    }

};

module.exports = video;