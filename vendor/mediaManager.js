function MediaManager(parameters) {

    // Files
    this.files = [];

    // Manager default settings
    this.config = {
        manager: 'images'
    };

    // Save given parameters
    this.parameters = parameters;

    this.applyParameters();

    this.start();

}

MediaManager.prototype.applyParameters = function() {

    let allowedParameters = ['manager', 'callback', 'onSelect'];
    for(let i in this.parameters) {
        if(allowedParameters.indexOf(i) === -1) continue;
        this.config[i] = this.parameters[i];
    }

};

MediaManager.prototype.start = function() {

    // Show manager
    $('div.media-manager').addClass('show');

    // On Select
    if('onSelect' in this.config) {

        let mediaManagerElement = $('div.media-manager');
        let selectEvent = function(event) {
            mediaManagerElement.off('click', 'li.item-file input');
            if(event.target.parentNode.getAttribute('data-type') !== this.config.manager)
                return false;
            let name = event.target.parentNode.innerText;
            this.config.onSelect(name.trim());
        }.bind(this);

        mediaManagerElement.on('click', 'li.item-file input', selectEvent);

    }

};

MediaManager.prototype.addFile = function(file) {

    document.querySelector('div.manager-queue').classList.add('show');

    let newFile = {
        name: file.name,
        size: file.size,
        type: file.type
    };

    let type = file.type.split('/')[0];

    let formData = new FormData();
    formData.append("file", file);
    newFile['data'] = formData;

    // Push item into list
    let itemElement = document.createElement('div');
    itemElement.classList.add('queue-item');
    let iconElement = document.createElement('div');
    iconElement.classList.add('type-icon');
    iconElement.classList.add('icon-' + type + '_white');
    let nameElement = document.createElement('p');
    nameElement.classList.add('item-name');
    nameElement.innerText = newFile.name;
    let removeElement = document.createElement('span');
    removeElement.classList.add('remove-item');
    removeElement.classList.add('icon-close_white');
    let uploadElement = document.createElement('span');
    uploadElement.classList.add('upload-item');
    uploadElement.setAttribute('data-locale', 'UPLOAD');
    uploadElement.innerText = translate.locale.admin_header.UPLOAD;

    itemElement.appendChild(iconElement);
    itemElement.appendChild(nameElement);
    itemElement.appendChild(removeElement);
    itemElement.appendChild(uploadElement);
    document.querySelector('div.manager-queue-list').appendChild(itemElement)
    document.querySelector('div.manager-queue').classList.remove('minimize');

    this.files.push(newFile);

};

MediaManager.prototype.removeFile = function(file) {

    let pos = -1;
    for(let i = 0; i < this.files.length; ++i) {
        if(this.files[i].name == file)
            pos = i;
    }

    this.files.splice(pos, 1);

};

MediaManager.prototype.uploadFile = function(file) {

    let pos = -1;
    for(let i = 0; i < this.files.length; ++i) {
        if(this.files[i].name == file)
            pos = i;
    }

    let fileData = this.files[pos];
    fileData.data.append('csrf_token', document.querySelector('meta[name=csrf_token]').getAttribute('content'));

    let result = false;
    $.ajax({
        method: "POST",
        url: "?route=" + $('meta[name=route]').attr('content') + '/mediaManager/upload',
        async: false,
        data: fileData.data,
        cache: false,
        processData: false,
        contentType: false,
        success: function(response) {
            this.files.splice(pos, 1);
            result = true;
        }.bind(this),
        error: function(response) {
            result = false;
        }.bind(this)
    });

    setTimeout(function() {
        managerActiveInstance.updateFiles();
    }, 500);

    return result;

};

MediaManager.prototype.updateFiles = function() {

    $.ajax({
        method: "POST",
        url: '?route=' + $('meta[name=route]').attr('content') + '/mediaManager/filelist',
        async: true,
        data: {
            csrf_token: document.querySelector('meta[name=csrf_token]').getAttribute('content')
        },
        success: function(response) {
            $('div.manager-content').html(response);
        }
    });

};

let managerActiveInstance;

// Load media manager GUI
$.ajax({
    method: "GET",
    url: '?route=' + $('meta[name=route]').attr('content') + '/mediaManager&csrf_token=' + document.querySelector('meta[name=csrf_token]').getAttribute('content'),
    async: false,
    success: function(result) {

        document.querySelector('body').insertAdjacentHTML('beforeend', result);
    
        // Events
        $('button.manager-upload-image').click(function() {
            $('input[name=media_manager_input_image]').click();
        });
    
        $('button.manager-upload-video').click(function() {
            $('input[name=media_manager_input_video]').click();
        });
    
        $('button.manager-upload-audio').click(function() {
            $('input[name=media_manager_input_audio]').click();
        });
    
        $('button.manager-upload-file').click(function() {
            $('input[name=media_manager_input_file]').click();
        });
    
        $('input[name=media_manager_input_image]').change(function(event) {
            managerActiveInstance.addFile(event.target.files[0]);
        });
    
        $('input[name=media_manager_input_video]').change(function(event) {
            managerActiveInstance.addFile(event.target.files[0]);
        });
    
        $('input[name=media_manager_input_audio]').change(function(event) {
            managerActiveInstance.addFile(event.target.files[0]);
        });
    
        $('input[name=media_manager_input_file]').change(function(event) {
            managerActiveInstance.addFile(event.target.files[0]);
        });
    
        // Close manager with button
        $('div.media-manager span.close-manager').click(function() {
            let mediaManagerElement = $('div.media-manager');
            mediaManagerElement.removeClass('show');
            mediaManagerElement.off('click', 'li.item-file input');
        });

        // Minimize manager queue
        $('div.manager-queue-header').click(function() {
            $('div.manager-queue').toggleClass('minimize');
        });

        // Remove item on remove click
        let html = $('html');
        html.on('click', 'div.queue-item span.remove-item', function(event) {
            let fileName = event.target.parentNode.querySelector('p').innerText;
            managerActiveInstance.removeFile(fileName);
            let element = event.target.parentNode;
            element.parentNode.removeChild(element);
        });

        // Upload item on click
        html.on('click', 'div.queue-item span.upload-item', function(event) {
            document.querySelector('div.manager-queue').classList.add('loading');
            let fileName = event.target.parentNode.querySelector('p').innerText;
            if(managerActiveInstance.uploadFile(fileName)) {
                let element = event.target.parentNode;
                element.parentNode.removeChild(element);
            }
            setTimeout(function() {
                document.querySelector('div.manager-queue').classList.remove('loading');
            }, 600);
        });

    }
});