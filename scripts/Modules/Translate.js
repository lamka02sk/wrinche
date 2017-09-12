import Ajax from '../Modules/Ajax';
import Global from '../Modules/Global';
import $ from 'jquery';

export default class {

    constructor(domains, local) {

        this.domains = domains;
        this.locale  = {};
        let language;

        if(local !== false)
            this.local = local;

        if(localStorage.getItem('locale_' + this.local) && local !== false)
            language = localStorage.getItem('locale_' + this.local);
        else
            language = Global.html.getAttribute('lang');

        this.language = language;

        domains.forEach(domain => {

            this.locale[domain] = Ajax.getJSON("app/Data/Locale/" + language + "/" + domain + ".json", false);
            this.changeLanguage(language, this.locale[domain]);

        });

    }

    getLanguage() {
        return this.language;
    }

    getLocale() {
        return this.locale;
    }

    changeLanguage(language, locale) {

        // Change local storage
        if(this.local)
            localStorage.setItem('locale_' + this.local, language);

        // Change html element lang
        Global.html.setAttribute('lang', locale['LOCALE']);

        // Translate website
        $('[data-locale]').each(function() {

            let phrase = $(this).data('locale');
            $('[data-locale="' + phrase + '"]').html(locale[phrase]);

        });

        // Translate placeholders
        $('[data-placeholder]').each(function() {

            let phrase = $(this).data('placeholder');
            $('[data-placeholder="' + phrase + '"]').attr('placeholder', locale[phrase]);

        });

        // Translate title attributes
        $('[data-title]').each(function() {

            let phrase = $(this).data('title');
            $('[data-title="' + phrase + '"]').attr('title', locale[phrase]);

        });

        $('[data-sublocale]').each(function() {

            let phrase = $(this).data('sublocale');
            $('[data-sublocale="' + phrase + '"]').html(locale[phrase]);

        });

    }

    translateLocales(locales) {

        locales.forEach(locale => {
            this.addTranslation(locale);
        });

    }

    addTranslation(locale) {

        if(this.locale[locale]) {
            this.changeLanguage(this.language, this.locale[locale]);
            return true;
        }

        this.locale[locale] = Ajax.getJSON("app/Data/Locale/" + this.language + "/" + locale + ".json", false);
        this.changeLanguage(this.language, this.locale[locale]);

    }

}