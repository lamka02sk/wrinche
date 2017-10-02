import $ from 'jquery';
import Utils from '../scripts/Modules/Utils';
import Global from '../scripts/Modules/Global';
import Csrf from '../scripts/Modules/Csrf';
import Translate from '../scripts/Modules/Translate';
import Router from '../scripts/Modules/Router';
import { MediaManager } from "../vendor/mediaManager";
import Slee from '../scripts/Modules/Slee';

Slee.prepare();
Global.Selector = require('selector3');
Global.MediaManager = MediaManager;

// Load YouTube API
{

    if(!window['YT']){var YT={loading:0,loaded:0}}if(!window['YTConfig']){let YTConfig={'host':'http://www.youtube.com'}}if(!YT.loading){YT.loading=1;(function(){var l=[];YT.ready=function(f){if(YT.loaded){f()}else{l.push(f)}};window.onYTReady=function(){YT.loaded=1;for(var i=0;i<l.length;i+=1){try{l[i]()}catch(e){}}};YT.setConfig=function(c){for(var k in c){if(c.hasOwnProperty(k)){YTConfig[k]=c[k]}}};var a=document.createElement('script');a.type='text/javascript';a.id='www-widgetapi-script';a.src='https://s.ytimg.com/yts/jsbin/www-widgetapi-vflWkV39n/www-widgetapi.js';a.async=false;var b=document.getElementsByTagName('script')[0];b.parentNode.insertBefore(a,b)})()}

}

// Translate page
{

    let translations = ['system', 'response', 'admin_header', 'admin_menu'];
    Global.translate = new Translate(translations, false);

}

// CSRF updater
Csrf.constructor();

// Anchor link box
Global.$html.on('mouseover', '[data-link]', function() {

    if('ontouchstart' in document.documentElement)
        return false;

    const link = Global.routePrefix + Global.route + '/' + this.getAttribute('data-link');
    Global.anchorBox.addClass('show').text(link);

});
Global.$html.on('mouseleave', '[data-link]', function() {
    Global.anchorBox.removeClass('show').text('');
});

// Execute Router
Global.router = new Router();

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
        else if(target.matches('.show-password, .password-show')) {

            let action = target.getAttribute('data-action');
            let input = document.querySelector('input[name=' + action + ']');

            if(input.getAttribute('type') === 'password') {
                input.setAttribute('type', 'text');
                target.classList.add('visible');
            } else {
                input.setAttribute('type', 'password');
                target.classList.remove('visible');
            }

        }

        // Logout
        else if(target.matches('.logout'))
            window.location.href = Global.URI + 'logout'

        // Link click event
        else if(target.matches('[data-link]') || $(target).parents('[data-link]').length > 0) {

            let link = target.dataset.link;
            let type = target.dataset.target;

            if(!link)
                link = $(target).parents('[data-link]').data('link');

            if(!type)
                type = false;

            let linkAction = link.split('/')[0];
            let menuLink = Global.nav.querySelector('[data-link="' + linkAction + '"]');
            let activeLink = Global.nav.querySelector('.active[data-link]');

            if(activeLink)
                activeLink.classList.remove('active');

            if(menuLink)
                menuLink.classList.add('active');

            Global.router.changeLocation(link, true, type);

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

// Hide splash screen
Utils.hideSplash();