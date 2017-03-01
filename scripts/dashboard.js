translations.push('admin_dashboard');
let translate = new Translate(translations, false);
locale = translate.getLocale();

// Remove Splash screen
$('div.splash').addClass('done');