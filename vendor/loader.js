function Loader(domain) {

    this.link = '';
    this.prevTranslation = '';
    this.prevContent = '';
    this.historyCounter = 0;
    this.domain = domain;

}

Loader.prototype.redirect = function(link, type) {

    // Show loading message
    let responseMessage = $('div.response-message');
    responseMessage.addClass('loading').addClass('open');
    responseMessage.find('span.message-content').html(translate['locale']['admin_header']['HEADER_LOADING']);

    this.link = link;

    // Detect type
    switch(type) {
        case 'content':
            this.changeContent();
            break;
        default:
            return false;
            break;
    }

    // Hide loading message
    responseMessage.delay(400).queue(function() {
        responseMessage.removeClass('loading').removeClass('open').removeClass('error').removeClass('success');
        responseMessage.find('.message-content').text("");
        $(this).dequeue();
    });

};

Loader.prototype.changeContent = function() {

    // Load content
    this.getContent();

    // Change address bar
    this.changeAddress();

    // Manage translations
    this.manageTranslations();

};

Loader.prototype.updateContent = function(responseContent) {

    try {

        let result = JSON.parse(responseContent);
        showMessage(result.code, 'error');

    } catch(error) {

        this.responseContent = responseContent;
        let contentWrapper = $('div.content-wrapper');
        this.prevContent = contentWrapper.html();
        contentWrapper.remove();
        $('body').append(responseContent);

    }

};

Loader.prototype.getContent = function() {

    let instance = this;

    $.ajax({
        type: 'GET',
        url: URI + this.link + '&csrf_token=' + $('meta[name=csrf_token]').attr('content'),
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        cache: true,
        async: false,
        success: function(result) {
            instance.updateContent(result);
        },
        error: function(result) {

            // Show some error message
            result = JSON.parse(result)['responseText'];
            showMessage(result.code, 'error');

        }
    });

};

Loader.prototype.changeAddress = function() {

    let windowAddress = window.location.href;

    // Save current address if counter set to 0
    let title;
    if(this.historyCounter == 0) {
        title = $('title').data('locale');
        window.history.pushState({ 'title': title, 'route': windowAddress, 'content': this.prevContent }, "", windowAddress);
        ++this.historyCounter;
    }

    // Create new URL
    windowAddress = windowAddress.split('/');

    // Clean array from empty last item
    if(windowAddress[(windowAddress.length - 1)] == "")
        windowAddress.splice((windowAddress.length - 1), 1);

    // Find admin route position
    let routePosition = 0;
    for(let i = 0; i < windowAddress.length; ++i) {
        let substr = windowAddress[i].substring(0, 7);
        if(substr == "index.p" || substr == baseURI) {
            routePosition = i;
            break;
        }
    }

    // Remove the route path and join URL back
    this.prevTranslation = windowAddress.splice(+routePosition + 1);

    // Add route to address
    windowAddress.push(this.link);
    windowAddress = windowAddress.join("/");

    // Push state
    window.history.pushState({ 'title': title, 'route': windowAddress, 'content': this.prevContent }, "", windowAddress);

};

Loader.prototype.manageTranslations = function() {

    let oldTranslation = this.domain + '_' + this.prevTranslation;

    // Find old translation position in list
    let position = 0;
    for(let i = 0; i < translations.length; ++i) {
        if(translations[i] === oldTranslation) {
            position = i;
            break;
        }
    }

    // Remove the old translation from list
    translations.splice(position, 1);

    // Create new translation name
    let newTranslation = this.domain + '_' + this.link;

    // Add new translation to the translations list
    translations.push(newTranslation);

    // Trigger translation of the new content
    translate.addTranslation(newTranslation);

};