/**
 * Translates website into all the supported languages
 * @param domains
 * @param local
 * @constructor
 */
function Translate(domains, local) {

    this.domains = domains;

    if(local !== false)
        this.local = local;
    this.locale = {};

    for(let i in domains) {

        let domain = domains[i];
        let language;

        if(localStorage.getItem('locale_' + this.local) && local !== false)
            language = localStorage.getItem('locale_' + this.local);
        else
            language = $('html').attr('lang');

        this.language  = language;

        this.locale[domain] = getJson("app/Data/Locale/" + language + "/" + domain + ".json");
        this.changeLanguage(language, this.locale[domain]);

    }

}

/**
 * Return current language abbr
 * @return {*}
 */
Translate.prototype.getLanguage = function() {
    return this.language;
};

/**
 * Return current locale content
 * @return {*}
 */
Translate.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Translate website to another language
 * @param language Language full name
 * @param locale Language abbreviation
 */
Translate.prototype.changeLanguage = function(language, locale) {

    // Change local storage
    if(this.local)
        localStorage.setItem('locale_' + this.local, language);

    // Change html element lang
    $('html').attr('lang', locale['LOCALE']);

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

    $('[data-sublocale]').each(function() {

        let phrase = $(this).data('sublocale');
        $('[data-sublocale="' + phrase + '"]').html(locale[phrase]);/*.find('.option-text').text(locale[phrase]);*/

    });

};

/**
 * Translate or load given locales
 * @param locales
 */
Translate.prototype.translateLocales = function(locales) {

    for(let i = 0; i < locales.length; ++i)
        this.addTranslation(locales[i]);

};

/**
 * Detect new content and translate it
 */
Translate.prototype.addTranslation = function(translation) {

    if(this.locale[translation]) {
        this.changeLanguage(this.language, this.locale[translation]);
        return true;
    }

    this.locale[translation] = getJson("app/Data/Locale/" + this.language + "/" + translation + ".json");
    this.changeLanguage(this.language, this.locale[translation]);

};