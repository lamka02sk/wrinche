function reloadStylesheets() {
    let queryString = '?reload=' + +new Date();
    $('link[rel="stylesheet"]').each(function() {
        this.href = this.href.replace(/\?.*|$/, queryString);
    });
}

document.addEventListener('keyup', function(event) {
    if(event.keyCode === 82)
        reloadStylesheets();
});

// ---------------------------------------------------------------------------------------------------------------------

function pad(number, positions) {
    number = '' + number;
    return number.length < positions ? pad("0" + number, positions) : number;
}

function validateUrl(url) {
    return (/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(url));
}

function validateTags(tags) {
    return (/^[a-zA-Z]([a-zA-Z0-9_\s,]+)?[a-zA-Z0-9]$/.test(tags) && tags !== '');
}

let mediaManagerClose = document.querySelector('div.media-manager span.close-manager');
function closeMediaManager() {
    mediaManagerClose.click();
}

function triggerEvent(element, event) {
    element.dispatchEvent(
        new MouseEvent(event, { view: window, cancelable: true, bubbles: true })
    );
}

function initializeCounters() {

    let eventList   = ['change', 'keydown', 'keyup'];
    let counterElements = document.querySelectorAll('div.counter');
    let counterElementsCount = counterElements.length;

    for(let counterElement = 0; counterElement < counterElementsCount; ++counterElement) {

        let current       = counterElements[counterElement];
        const maxLength   = current.getAttribute('data-length');
        let type          = current.getAttribute('data-input');
        let element       = current.parentNode.querySelector(type);

        current.innerText = maxLength;

        function inner() {

            let left          = +maxLength - element.value.trim().length;
            current.innerText = left;

            if(left < 0)
                current.classList.add('minus');
            else
                current.classList.remove('minus');

        }

        for(let event in eventList)
            element.addEventListener(eventList[event], inner);

    }

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function showValidationResult(element, locale, hide, callback) {

    let messageBox = element.parentNode.querySelector('span.validate-message');

    if(hide) {
        if(messageBox.innerText === '') return true;
        messageBox.innerText = '';
        messageBox.removeAttribute('data-locale');
        callback();
        return true;
    }

    if(messageBox.getAttribute('data-locale') === locale) return true;

    messageBox.setAttribute('data-locale', locale);
    let loopBreak = false;
    for(let i in translate.locale) {
        for(let j in translate.locale[i]) {
            if(j === locale) {
                messageBox.innerText = translate.locale[i][j];
                loopBreak            = true;
                break;
            }
        }
        if(loopBreak) break;
    }

    callback();

}

// Confirmation box
function confirmAction(action, callback) {

    // Show popup
    let confirmationElement = $('div.confirmation-menu');
    confirmationElement.css({display: 'table'}).animate({opacity: 1}, 150).addClass('open');
    confirmationElement.find('p.confirmation-action-message').html(action);

    // Proceed
    confirmationElement.find('span.confirmation-action-proceed').click(function() {
        callback();
        clearEvents();
        confirmationElement.animate({opacity: 0}, 150).removeClass('open')
            .delay(100).queue(function() {
            $(this).css({display: 'none'}).dequeue();
        });
    });

    // Dismiss
    confirmationElement.find('span.confirmation-action-dismiss').click(function() {
        clearEvents();
        confirmationElement.animate({opacity: 0}, 150).removeClass('open')
            .delay(100).queue(function() {
            $(this).css({display: 'none'}).dequeue();
        });
    });

    function clearEvents() {
        $('span.confirmation-action-proceed').off('click');
        $('span.confirmation-action-dismiss').off('click');
    }

}

// Reload packery
function reloadPackery(timeout) {

    if(!timeout)
        timeout = 0;

    setTimeout(function() {
        packery.packery().reloadItems();
    }, timeout);

}

// AJAX
function postData(link, data, callback) {

    // Show loading message
    responseBox.classList.add('loading');
    responseBox.classList.add('open');
    responseBox.querySelector('span.message-content').innerHTML = translate['locale']['admin_header']['HEADER_LOADING'];

    // Hide loading message
    function hideLoadingMessage() {
        setTimeout(function() {
            responseBox.classList.remove('loading');
            responseBox.classList.remove('open');
            responseBox.querySelector('span.message-content').innerHTML = '';
        }, 400);
    }

    // Send post
    data['csrf_token'] = document.querySelector('meta[name=csrf_token]').getAttribute('content');
    $.ajax({
        url    : link,
        method : 'POST',
        data   : data,
        async  : false,
        success: function(response) {
            callback(response, 'success');
            hideLoadingMessage();
        },
        error  : function(response) {
            callback(response, 'error');
            hideLoadingMessage();
        }
    });

}

// Routes while pretty URLs does not work
let adminRoute      = document.querySelector('meta[name=route]').getAttribute('content');
let baseURI         = '?route='; // While pretty URL does not work
let route           = $('meta[name=route]').attr('content');
let csrf_token      = $('meta[name=csrf_token]').attr('content');
let URI             = baseURI + route + '/';
let locale,
    tmp,
    packery,
    sortable,
    selector,
    languages,
    type,
    typeName,
    componentList,
    components      = [],
    selectors,
    contentElement;
let previousScripts = [];
let responseBox     = document.querySelector('div.response-message');
let body            = document.querySelector('body');
let html            = $('html');
let ckconfig        = {
    language: html.attr('lang'),
    uiColor: '#ffffff',
    extraPlugins: 'autogrow',
    autoGrow_minHeight: 150,
    autoGrow_maxHeight: 700,
    autoGrow_onStartup: true,
    toolbar: [
        {
            name: 'history',
            items: [
                'Undo', 'Redo'
            ]
        },
        {
            name: 'clipboard',
            items: [
                'Cut', 'Copy', 'Paste', 'PasteFromWord'
            ]
        },
        {
            name: 'basic',
            items: [
                'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'
            ]
        },
        {
            name: 'lists',
            items: [
                'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'
            ]
        },
        {
            name: 'justify',
            items: [
                'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'
            ]
        },
        {
            name: 'links',
            items: [
                'Link', 'Unlink'
            ]
        },
        {
            name: 'advanced',
            items: [
                'HorizontalRule', 'Symbol', 'EqnEditor'
            ]
        },
        {
            name: 'color',
            items: [
                'TextColor', 'BGColor'
            ]
        }
    ]
};

// Update CSRF token every 19 minutes
setInterval(function() {
    ajax(
        baseURI + 'api/system.auth.refresh.token&csrf_token=' + csrf_token,
        'GET',
        false,
        '*',
        function(response) {
            csrf_token = response.data;
            document.querySelector('meta[name=csrf_token').setAttribute('content', response.data);
        },
        function() {
            window.addEventListener('focus', function() {
                confirmAction(translate.locale.response['ACTION_CONFIRM_RELOAD_PAGE'], function() {
                    window.location.reload();
                });
            });
        }
    );
}, 1200000);

// Root URL
let root = window.location.href;
root     = root.split(adminRoute)[0] + adminRoute;

// Translations list
let translations    = ['system', 'response', 'admin_header', 'admin_menu'];
let addTranslations = document.querySelector('div.content-wrapper').getAttribute('data-locales');
addTranslations     = addTranslations.split(' ');
for(let i = 0; i < addTranslations.length; ++i) {
    if(translations.indexOf(addTranslations[i]) !== -1) continue;
    translations.push(addTranslations[i]);
}
let translate = new Translate(translations, false);

// Show anchor-tooltip
html.on('mouseover', '[data-link]', function() {
    let link = URI + this.getAttribute('data-link');
    $('div.anchor-hover').addClass('show').text(link);
});
html.on('mouseleave', '[data-link]', function() {
    $('div.anchor-hover').removeClass('show').text('');
});

// Show response message or action message
function showMessage(content, type) {

    let code = content;
    if(content === 200)
        content = locale['register'][content];
    else
        content = locale['response'][content];

    let messageBox  = $('div.response-message span.message-content');
    let responseBox = $('div.response-message');
    responseBox.dequeue();
    messageBox.attr('data-locale', code).html(content);
    responseBox.removeClass('success', 'error').removeClass('loading')
        .addClass(type).addClass('open').delay(5000)
        .queue(function() {
            $(this).removeClass('open').dequeue();
        });

}

// Loader Events
function LoaderStart() {

    // Show loading message
    responseBox.classList.add('loading');
    responseBox.classList.add('open');
    responseBox.querySelector('span.message-content').innerHTML = translate['locale']['admin_header']['HEADER_LOADING'];

}

function LoaderError(code) {

    showMessage(code, 'error');

}

function LoaderDone(content, link, menu) {

    // Get translations
    let addTranslations = document.querySelector('div.content-wrapper').getAttribute('data-locales');
    addTranslations     = addTranslations.split(' ');
    for(let i = 0; i < addTranslations.length; ++i) {
        if(translations.indexOf(addTranslations[i]) !== -1) continue;
        translations.push(addTranslations[i]);
    }
    translate.translateLocales(addTranslations);

    // Remove current script
    let scriptName = previousScripts.pop();
    $('script[src="scripts/' + scriptName + '.min.js"]').remove();

    // Add new script
    let newScript = link.split('/')[0];
    $('body').append('<script type="application/javascript" src="scripts/' + newScript + '.min.js"></script>');

    // Change menu selected item
    if(!menu) {
        let menuLink = link.split('/')[0];
        $('nav li').removeClass('active');
        $('li[data-link="' + menuLink + '"]').addClass('active');
    }

    // Remove loading message
    setTimeout(function() {
        responseBox.classList.remove('loading');
        responseBox.classList.remove('open');
        responseBox.querySelector('span.message-content').innerText = '';
    }, 400);

    $('div.anchor-hover').removeClass('show').text('');

}

// Initialize Loader
new Loader({
    domain : 'admin',
    csrf   : 'csrf_token',
    root   : root,
    targets: {
        content   : 'div.content-wrapper',
        subcontent: 'div.content-subcontent',
        full      : 'html'
    },
    onStart: function() {
        LoaderStart()
    },
    onError: function(code) {
        LoaderError(code)
    },
    onDone : function(content, link, menu) {
        LoaderDone(content, link, menu)
    }
});

// Close opened elements on click outside
let closer = new Closer;
let doc    = $(document);
doc.click(function(e) {
    closer.closeElements(e.target);
});

// Open / Close Footer
let footerMore = $('span.footer-more');
footerMore.click(function() {

    let footer = $('footer');
    if(!footer.hasClass('open')) {
        footer.addClass('open');
        closer.addElement(footer);
    } else
        footer.removeClass('open');

});

// Open / Close Account Dropdown
$('div.header-account').click(function() {

    let dropdown = $('div.account-dropdown');
    if(!dropdown.hasClass('open')) {
        dropdown.addClass('open');
        closer.addElement(dropdown);
    }

});

// Open write menu
$('div.header-write').click(function() {

    $('div.fullscreen-wrapper.write-menu').addClass('open');

});

// Close write menu
$('div.write-menu div.tails-tail').click(function() {
    $('div.write-menu span.header-close').click();
});

$('div.write-menu span.header-close').click(function() {

    $('div.fullscreen-wrapper.write-menu').removeClass('open');

});

// Logout
$('.logout').click(function() {
    window.location.href = URI + 'logout';
});

// Add focus to input
html.on('click', 'div.mainline-search div.input-box', function() {
    $(this).find('input').focus();
});

// Window history
window.onpopstate = function(event) {

    let link = event.state.link;
    if(link === '')
        link = 'dashboard';
    $('[data-link="' + link + '"]').click();

};

// Flatpickr datetime picker
function initDatePicker() {

    flatpickr(".datetime-picker", {
        altFormat    : true,
        dateFormat   : 'd.m.Y H:i:s',
        enableTime   : true,
        enableSeconds: true,
        locale       : translate.language,
        disableMobile: true,
        time_24hr    : true
    });

    flatpickr(".datetime-picker-min", {
        altFormat    : true,
        dateFormat   : 'd.m.Y H:i:s',
        enableTime   : true,
        enableSeconds: true,
        minDate      : 'today',
        locale       : translate.language,
        disableMobile: true,
        time_24hr    : true
    });

    flatpickr(".datetime-picker-max", {
        altFormat    : true,
        dateFormat   : 'd.m.Y H:i:s',
        enableTime   : true,
        enableSeconds: true,
        maxDate      : 'today',
        locale       : translate.language,
        disableMobile: true,
        time_24hr    : true
    });

    flatpickr(".date-picker", {
        altFormat    : true,
        dateFormat   : 'd.m.Y',
        locale       : translate.language,
        disableMobile: true
    });

    flatpickr(".date-picker-max", {
        altFormat    : true,
        dateFormat   : 'd.m.Y',
        maxDate      : 'today',
        locale       : translate.language,
        disableMobile: true
    });

    flatpickr(".date-picker-min", {
        altFormat    : true,
        dateFormat   : 'd.m.Y',
        minDate      : 'today',
        locale       : translate.language,
        disableMobile: true
    });

}

// Show / Hide password fields
function initializePasswordToggle() {

    document.querySelectorAll('span.password-show').forEach(function(item) {
        item.addEventListener('click', function(event) {
            let target       = event.target.getAttribute('data-action');
            let inputElement = document.querySelector('input[name=' + target + ']');
            if(inputElement.getAttribute('type') === 'password') {
                inputElement.setAttribute('type', 'text');
                item.classList.add('visible');
            } else {
                inputElement.setAttribute('type', 'password');
                item.classList.remove('visible');
            }
        });
    });

}