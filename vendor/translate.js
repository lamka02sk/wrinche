/**
 * Translates website into all the supported languages
 * @param domains
 * @param local
 * @constructor
 */
function Translate(domains, local) {

    this.local = local;
    this.locale = {};

    for(let i in domains) {

        let domain = domains[i];
        let language;

        if(localStorage.getItem('locale_' + this.local))
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

};