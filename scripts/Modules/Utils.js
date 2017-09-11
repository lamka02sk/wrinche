import $ from 'jquery';
import Global from '../Modules/Global';

export default {

    pad(number, positions) {

        number = '' + number;
        return number.length < positions ? pad("0" + number, positions) : number;

    },

    validateUrl(url) {

        return (/[(http(s)?):\/\/(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
            .test(url));

    },

    validateTags(tags) {

        if(typeof tags === 'object')
            if(tags.length === 0)
                return true;

        return (/^[a-zA-Z]([a-zA-Z0-9_\s,]+)?[a-zA-Z0-9]$/
            .test(tags) && tags !== '');

    },

    triggerEvent(element, event) {

        element.dispatchEvent(
            new MouseEvent(event, {
                view      : window,
                cancelable: true,
                bubbles   : true
            })
        );

    },

    registerEvent(event) {

        // [element, events, function] || { element, events, content() }

        event            = Object.values(event);
        const eventsList = event[1].split(' ');

        eventsList.forEach(eventName => {
            event[0].addEventListener(eventName, event[2]);
        });

    },

    registerEvents(events) {

        events.forEach(registerEvent);

    },

    capitalizeFirst(string) {

        string = string.toString();
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

    },

    showValidationResults(element, locale, hide, callback) {

        callback       = callback || function() {};
        let messageBox = element.parentNode.querySelector('.validate-message');

        if(hide === true) {

            if(messageBox.innerText === '')
                return true;

            messageBox.innerText = '';
            messageBox.removeAttribute('data-locale');

            callback();
            return true;

        }

        if(messageBox.getAttribute('data-locale') === locale) {

            callback();
            return true;

        }

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

            if(loopBreak)
                break;

        }

        callback();

    },

    _confirmationElement: $('div.confirmation-menu'),
    _confirmationMessage: this._confirmationElement.find('.confirmation-action-message'),
    _confirmationProceed: this._confirmationElement.find('.confirmation-action-proceed'),
    _confirmationDismiss: this._confirmationElement.find('.confirmation-action-dismiss'),

    confirmAction(action, callback) {

        callback = callback || function() {};
        this._confirmationElement.css({ display: 'table' }).animate({ opacity: 1 }, 150).addClass('open');
        this._confirmationMessage.innerHTML = action;

        function clearEvents() {

            this._confirmationProceed.off('click');
            this._confirmationDismiss.off('click');

        }

        function hidePopup() {

            this._confirmationElement.animate({opacity: 0}, 150).removeClass('open')
                .delay(100).queue(function() {
                $(this).css({display: 'none'}).dequeue();
            });

        }

        // Proceed
        this._confirmationProceed.click(function() {

            callback();
            clearEvents();
            hidePopup();

        });

        // Dismiss
        this._confirmationDismiss.click(function() {

            clearEvents();
            hidePopup();

        });

    },

    reloadPackery(timeout) {

        timeout = timeout || 0;

        setTimeout(() => {
            packery.packery().reloadItems();
        }, timeout);

    },

    _loadingBox: document.querySelector('.response-message'),
    _responseBox: document.querySelector('.response-result-message'),

    showLoading() {

        this._loadingBox.classList.add('loading');
        this._loadingBox.classList.add('open');
        this._loadingBox
            .querySelector('span.message-content')
            .innerHTML = Global.translate['locale']['admin_header']['HEADER_LOADING'];

    },

    hideLoading() {

        setTimeout(function() {

            this._loadingBox.classList.remove('loading');
            this._loadingBox.classList.remove('open');
            this._loadingBox
                .querySelector('span.message-content')
                .innerHTML = '';

        }, 200);

    }

};