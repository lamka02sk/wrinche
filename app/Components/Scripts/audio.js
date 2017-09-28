import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";

let audio = {

    data: {},

    resumeInline: function(identifier, element, resumeData) {

        let path = resumeData.audio;

        audio.create(identifier, element);
        audio.onSelect(identifier, element, path, true);

    },

    validateInput: function(element, identifier, path, onSuccess) {

        let messageBox = element.querySelector('.validate-message');

        if(!/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(path)) {

            Utils.showValidationResults(
                messageBox, 'COMPONENT_URL_INVALID', false
            );

            return false;

        }

        new Promise(function(resolve) {

            let audio = new Audio;

            audio.addEventListener('canplaythrough', function() {
                resolve(true);
            });

            audio.addEventListener('error', function() {
                resolve(false);
            });

            audio.src = path;

        })

        .then(function(result) {

            if(result)
                Utils.showValidationResults(
                    messageBox, 'COMPONENT_URL_INVALID', true
                );

            else
                Utils.showValidationResults(
                    messageBox, 'COMPONENT_URL_INVALID', false
                );

        });

        if(onSuccess)
            onSuccess();

    },

    remove: function(element) {

        element.querySelectorAll('div.component-instance').forEach(function(item) {
            item.querySelector('span.item-remove').click();
        });

    },

    onSelect: function(identifier, element, path, outside) {

        let contentElement = element.querySelector('div.component-element-content');
        contentElement.classList.add('no-padding');

        // Remove current audio
        audio.remove(element);

        // Create source link
        if(!outside)
            path = 'app/Data/Files/Sounds/' + path;


        // Save audio path
        audio.data[identifier] = {
            audio: path
        };

        // Create template
        let template = contentElement.querySelector('#template_component_content_audio_item').children[0].cloneNode(true);
        template.setAttribute('data-path', path);
        template.classList.add('component-instance');
        template.children[0].setAttribute('src', path);
        template.children[3].innerText = path.split('/').pop();
        contentElement.appendChild(template);

        let timer;
        template.children[1].addEventListener('click', function(event) {
            if(template.children[0].ended) template.children[2].click();
            if(template.children[0].paused) {
                template.children[0].play();
                showPlayerTime();
                timer = setInterval(showPlayerTime, 1000);
            } else {
                template.children[0].pause();
                showPlayerTime();
                clearInterval(timer);
            }
            event.target.classList.toggle('icon-pause');
        });

        template.children[2].addEventListener('click', function() {
            template.children[0].currentTime = 0;
            template.children[0].pause();
            template.children[1].classList.remove('icon-pause');
            clearInterval(timer);
            showPlayerTime();
        });

        function showPlayerTime() {
            let position = template.children[0].currentTime;
            position = parseInt(position / 60, 10) + ':' + Utils.pad(Math.round(position % 60), 2);
            let duration = template.children[0].duration;
            let minutes = parseInt(duration / 60, 10);
            let seconds = duration % 60;
            template.children[5].innerText = position + '/' + minutes + ':' + Utils.pad(Math.round(seconds), 2);
        }

        // Hide media manager
        template.children[0].addEventListener('loadedmetadata', function() {
            showPlayerTime();
            contentElement.querySelector('div.input-box.select-image').classList.add('hide');
            document.querySelector('div.media-manager span.close-manager').click();
        });

        // Remove audio
        template.children[4].addEventListener('click', function() {
            contentElement.querySelector('div.input-box.select-image').classList.remove('hide');
            contentElement.removeChild(template);
            contentElement.classList.remove('no-padding');
            delete audio.data[identifier];
        });

    },

    create: function(identifier, element) {

        audio.data[identifier] = {
            title: '',
            disabled: 0
        };

        Utils.registerEvents([

            {
                // Open Media manager
                event: 'click',
                element: element.querySelector('button.inline-image_manager'),
                content: function() {
                    Global.managerActiveInstance = new Global.MediaManager({
                        manager: 'sounds',
                        onSelect: function(path) {
                            audio.onSelect(identifier, element, path, false);
                        }
                    });
                }
            },

            {
                // Enter custom URL to audio
                event: 'keypress',
                element: element.querySelector('input[name=component_inline_audio_input]'),
                content: function(event) {
                    if(event.keyCode && event.keyCode === 13) {
                        let path = event.target.value;
                        audio.validateInput(element, identifier, path, function() {
                            audio.onSelect(identifier, element, path, true);
                        });
                    }
                }
            },

            {
                // Real-time URL validation
                event: 'change keyup',
                element: element.querySelector('input[name=component_inline_audio_input]'),
                content: function(event) {
                    audio.validateInput(element, identifier, event.target.value);
                }
            }

        ]);
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return audio.data;
    }

};

module.exports = audio;