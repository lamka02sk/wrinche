/**
 * Translate website to another language
 * @param language Language full name
 * @param locale Language abbreviation
 * @param domain Translation domain file
 */
function changeLanguage(language, domain, locale) {

    if(typeof locale === 'undefined') {

        // Download translation file
        locale = getJson("app/Data/Locale/" + language + "/" + domain + ".json");

    }

    // Change html element lang
    $('html').attr('lang', locale['LOCALE']);

    // Translate website
    $('[data-locale]').each(function() {

        // Get phrase name
        var phrase = $(this).data('locale');

        // Translate
        $('[data-locale="' + phrase + '"]').html(locale[phrase]);

    });

    $('[data-placeholder]').each(function() {

        // Get phrase name
        var phrase = $(this).data('placeholder');

        // Translate
        $('[data-placeholder="' + phrase + '"]').attr('placeholder', locale[phrase]);

    });

    return locale;

}

/**
 * Translates website
 * @param domain
 */
function translate(domain) {

    var language = $('html').attr('lang');
    locale = getJson("app/Data/Locale/" + language + "/" + domain + ".json");
    changeLanguage(language, domain, locale);

}