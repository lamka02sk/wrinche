componentsModule.modules.audio = {

    data: {},
    valid: {},

    showError: function(element, identifier) {
        let messageElement = element.querySelector('span.field-validation');
        messageElement.setAttribute('data-locale', 'COMPONENT_URL_INVALID');
        messageElement.innerText = translate.locale.components.COMPONENT_URL_INVALID;
        messageElement.classList.add('show');
        componentsModule.modules.audio.valid[identifier] = {
            valid: false
        };
    },

    hideError: function(element, identifier) {
        let messageElement = element.querySelector('span.field-validation');
        messageElement.classList.remove('show');
        componentsModule.modules.audio.valid[identifier] = {
            valid: true
        };
    },

    validateInput: function(element, identifier, path) {

        if(!/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(path)) {
            componentsModule.modules.audio.showError(element, identifier);
            return false;
        }

        let promise = new Promise(function(resolve, reject) {
            let audio = new Audio;
            audio.addEventListener('canplaythrough', function() {
                resolve(true);
            });
            audio.addEventListener('error', function() {
                resolve(false);
            });
            audio.src = path;
        });

        promise.then(function(result) {
            if(result)
                componentsModule.modules.audio.hideError(element, identifier);
            else
                componentsModule.modules.audio.showError(element, identifier);

        });

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
        componentsModule.modules.audio.remove(element);

        // Create source link
        if(!outside)
            path = 'app/Data/Files/Sounds/' + path;

        // Save audio path
        componentsModule.modules.audio.data[identifier] = {
            title: '',
            audio: path,
            valid: true,
            disabled: 0
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
            position = parseInt(position / 60, 10) + ':' + pad(Math.round(position % 60), 2);
            let duration = template.children[0].duration;
            let minutes = parseInt(duration / 60, 10);
            let seconds = duration % 60;
            template.children[5].innerText = position + '/' + minutes + ':' + pad(Math.round(seconds), 2);
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
            delete componentsModule.modules.audio.data[identifier];
        });

    },

    create: function(identifier, element) {
        componentsModule.initializeEvents([

            {
                // Open Media manager
                event: 'click',
                element: element.querySelector('button.inline-image_manager'),
                content: function() {
                    managerActiveInstance = new MediaManager({
                        manager: 'sounds',
                        onSelect: function(path) {
                            componentsModule.modules.audio.onSelect(identifier, element, path, false);
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
                        componentsModule.modules.audio.validateInput(element, identifier, path);
                        console.log((componentsModule.modules.audio.valid[identifier].valid));
                        if(componentsModule.modules.audio.valid[identifier].valid)
                            componentsModule.modules.audio.onSelect(identifier, element, path, true);
                    }
                }
            },

            {
                // Real-time URL validation
                event: 'change keyup',
                element: element.querySelector('input[name=component_inline_audio_input]'),
                content: function(event) {
                    componentsModule.modules.audio.validateInput(element, identifier, event.target.value);
                }
            }

        ]);
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.audio.data;
    }

};