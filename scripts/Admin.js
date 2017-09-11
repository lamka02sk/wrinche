import $ from 'jquery';
import Utils from '../scripts/Modules/Utils';
import Global from '../scripts/Modules/Global';
import Csrf from '../scripts/Modules/Csrf';
import Translate from '../scripts/Modules/Translate';

// Log out
Utils.registerEvent([
    'click',
    document.querySelector('.logout'),
    () => window.location.href = Global.URI + 'logout'
]);

// CSRF updater
Csrf.constructor();

// Anchor link box
Utils.registerEvents([

    [
        'mouseover',
        Global.html,
        event => {

            if(!event.matches('[data-link]'))
                return false;

            let link = Global.URI + event.target.dataset.link;
            Global.anchorBox.addClass('show').text(link);

        }
    ],

    [
        'mouseleave',
        Global.html,
        event => {

            if(event.matches('[data-link]'))
                Global.anchorBox.removeClass('show').text('');

        }
    ]

]);

// Translate page
{

    let translations    = ['system', 'response', 'admin_header', 'admin_menu'];
    let addTranslations = document.querySelector('.content-wrapper').getAttribute('data-locales');

    if(addTranslations) {
        addTranslations = addTranslations.split(' ');
        translations = [...translations, ...addTranslations];
    }

    Global.translate = new Translate(translations, false);

}

// Delegate body click events
Utils.registerEvent([
    'click',
    Global.body,
    event => {

        let target = event.target;

        // Close elements on click outside
        Global.closer.closeElements(target);

        // Focus inputs
        if(target.matches('div.mainline-search div.input-box'))
            $(target).find('input').focus();

        // Show / Hide Password Fields
        else if(target.matches('span.show-password')) {

            let action = target.getAttribute('data-action');
            let input = document.querySelector('input[name=' + action + ']');

            if(input.getAttribute('type') === 'password') {
                inputElement.setAttribute('type', 'text');
                target.classList.add('visible');
            } else {
                input.setAttribute('type', 'password');
                target.classList.remove('visible');
            }

        }



    }
]);

// Footer Open / Close
{

    let footer = $('footer');

    Utils.registerEvent([
        'click',
        document.querySelector('.footer-more'),
        () => {

            if(!footer.hasClass('open')) {
                footer.addClass('open');
                Global.closer.addElement(footer);
            } else
                footer.removeClass('open');

        }
    ]);

}

// Account Menu Open / Close
{

    let dropdown = $('div.account-dropdown');

    Utils.registerEvent([
        'click',
        document.querySelector('.header-account'),
        () => {

            if(dropdown.hasClass('open'))
                return false;

            dropdown.addClass('open');
            Global.closer.addElement(dropdown);

        }
    ]);

}

// Write Menu Open / Close
{

    let writeMenu = $('div.write-menu');

    Utils.registerEvents([

        [
            'click',
            document.querySelector('div.header-write'),
            () => {
                writeMenu.addClass('open');
                Global.closer.addElement(writeMenu);
            }
        ],

        [
            'click',
            document.querySelectorAll('div.write-menu span.header-close, div.write-menu div.tails-tail'),
            () => writeMenu.removeClass('open')
        ]

    ]);

}

// Execute Router
