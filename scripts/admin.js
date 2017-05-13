/*function reloadStylesheets() {
    let queryString = '?reload=' + new Date().getTime();
    $('link[rel="stylesheet"]').each(function () {
        this.href = this.href.replace(/\?.*|$/, queryString);
    });
}

setInterval(reloadStylesheets, 4000);*/

// ---------------------------------------------------------------------------------------------------------------------

function initializeCounters() {

    let events = ['change', 'keydown', 'keyup'];
    let elements = document.querySelectorAll('div.counter');
    for(let i = 0; i < elements.length; ++i) {
        function inner() {
            let left = length - element.value.trim().length;
            current.innerText = left;
            if(left < 0) current.classList.add('minus');
            else current.classList.remove('minus');
        }

        let current = elements[i];
        let length = current.getAttribute('data-length');
        current.innerText = length;
        let type = current.getAttribute('data-input');
        let element = current.parentNode.querySelector(type);
        for(let i in events)
            element.addEventListener(events[i], inner);
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
            if(j == locale) {
                messageBox.innerText = translate.locale[i][j];
                loopBreak = true;
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
    confirmationElement.css({ display: 'table' }).animate({ opacity: 1 }, 150).addClass('open');
    confirmationElement.find('p.confirmation-action-message').text(action);

    // Proceed
    confirmationElement.find('span.confirmation-action-proceed').click(function() {
        callback();
        clearEvents();
        confirmationElement.animate({ opacity: 0 }, 150).removeClass('open')
            .delay(100).queue(function() {
                $(this).css({ display: 'none' }).dequeue();
            });
    });

    // Dismiss
    confirmationElement.find('span.confirmation-action-dismiss').click(function() {
        clearEvents();
        confirmationElement.animate({ opacity: 0 }, 150).removeClass('open')
            .delay(100).queue(function() {
                $(this).css({ display: 'none' }).dequeue();
            });
    });

    function clearEvents() {
        $('span.confirmation-action-proceed').off('click');
        $('span.confirmation-action-dismiss').off('click');
    }

}

// AJAX
function postData(link, data, callback) {

    // Show loading message
    responseBox.classList.add('loading');
    responseBox.classList.add('open');
    responseBox.querySelector('span.message-content').innerHTML = translate['locale']['admin_header']['HEADER_LOADING'];

    // Send post
    data['csrf_token'] = document.querySelector('meta[name=csrf_token]').getAttribute('content');
    $.ajax({
        url: link,
        method: 'POST',
        data: data,
        async: false,
        success: function(response) {
            callback(response, 'success');
        },
        error: function(response) {
            callback(response, 'error');
        }
    });

}

// Routes while pretty URLs does not work
let adminRoute = document.querySelector('meta[name=route]').getAttribute('content');
let baseURI = '?route='; // While pretty URL does not work
let route = $('meta[name=route]').attr('content');
let URI = baseURI + route + '/';
let locale, packery, selector, languages, type, typeName, componentList, components, selectors;
let previousScripts = [];
let responseBox = document.querySelector('div.response-message');
let body = document.querySelector('body');

// Root URL
let root = window.location.href;
root = root.split(adminRoute)[0] + adminRoute;

// Translations list
let translations = ['system', 'response', 'admin_header', 'admin_menu'];
let addTranslations = document.querySelector('div.content-wrapper').getAttribute('data-locales');
addTranslations = addTranslations.split(' ');
for(let i = 0; i < addTranslations.length; ++i) {
    if(translations.indexOf(addTranslations[i]) !== -1) continue;
    translations.push(addTranslations[i]);
}
let translate = new Translate(translations, false);

// Show anchor-tooltip
let html = $('html');
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

    let messageBox = $('div.response-message span.message-content');
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

function LoaderDone(content, link) {

    // Get translations
    let addTranslations = document.querySelector('div.content-wrapper').getAttribute('data-locales');
    addTranslations = addTranslations.split(' ');
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
    let menuLink = link.split('/')[0];
    $('nav li').removeClass('active');
        $('li[data-link="' + menuLink + '"]').addClass('active');

    // Remove loading message
    setTimeout(function() {
        responseBox.classList.remove('loading');
        responseBox.classList.remove('open');
        responseBox.querySelector('span.message-content').innerText = '';
    }, 400);

}

// Initialize Loader
new Loader({
    domain: 'admin',
    csrf: 'csrf_token',
    root: root,
    targets: {
        content: 'div.content-wrapper',
        subcontent: 'div.content-subcontent',
        full: 'html'
    },
    onStart: function() { LoaderStart() },
    onError: function(code) { LoaderError(code) },
    onDone: function(content, link) { LoaderDone(content, link) }
});

// Close opened elements on click outside
let closer = new Closer;
let doc = $(document);
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

    $('div.fullscreen-wrapper.write-menu').css({ display: 'table' })
        .animate({ opacity: 1 }, 150).addClass('open');

});

// Close write menu
$('div.write-menu div.tails-tail').click(function() {
    $('div.write-menu span.header-close').click();
});

$('div.write-menu span.header-close').click(function() {

    $('div.fullscreen-wrapper.write-menu').animate({ opacity: 0 }, 150).removeClass('open')
        .delay(100).queue(function() {
            $(this).css({ display: 'none' }).dequeue();
    });

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
        locale      : translate.language
    });

    flatpickr(".date-picker", {
        altFormat  : true,
        dateFormat : 'd.m.Y',
        locale     : translate.language
    });

    flatpickr(".date-picker-max", {
        altFormat  : true,
        dateFormat : 'd.m.Y',
        maxDate    : 'today',
        locale     : translate.language
    });

}