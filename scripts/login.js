let baseURI = '?route='; // While pretty URL does not work
let locale;

function showResponseMessage(content, type) {

    $('span.response-box').html(content).addClass('active').addClass(type).delay(3000).queue(function() {
        $(this).removeClass('active').removeClass(type).dequeue();
    });

}

// Translate website
translate('install');
translate('auth');

// Animate
$('div.outer-container, div.logo-box, img.logo-heading-charcoal, img.logo-heading-mustard, form.login-form').addClass('animate');

// Open settings
$('div.control-panel p.controls-title').click(function() {
    $('div.panel-content').toggleClass('active');
});

// Load Theme
let date = new Date();
let theme = 'light';
if((date.getHours() >= 18) || (date.getHours() < 8))
    theme = 'dark';
if(localStorage.getItem('theme_login'))
    theme = localStorage.getItem('theme_login');
changeTheme(theme, 'login');

// Change Theme
$('span.theme-option').click(function() {
    theme = $(this).data('value');
    changeTheme(theme, 'login');
    localStorage.setItem('theme_login', theme);
});

// Change language on selector click
$('#language .selector-options .selector-option').click(function() {

    let currentLanguage = $('html').attr("lang");
    let language = $(this).data('value');
    if(currentLanguage === language)
        return;

    let lc ="ENGLISH";
    if(language === 'sk')
        lc = "SLOVAK";

    $(this).parent().parent().find('.selector-selected').attr('data-locale', lc);
    changeLanguage(language, 'install');
    locale = changeLanguage(language, 'auth');

});

// Login Button
$('button.login').click(function() {

    let url = baseURI + $('meta[name=route]').attr("content");
    let formsData = {
        'username': $('form.login-form input[name=username]').val(),
        'password': $('form.login-form input[name=password]').val()
    };

    if(formsData.username.trim() === '' || formsData.password.trim() === '')
        showResponseMessage(locale['EMPTY_INPUT'], 'error');

    $.ajax({
        type: 'POST',
        url: url + '/login',
        data: {
            'login': formsData,
            'csrf_token': $('meta[name=csrf_token]').attr('content')
        },
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        cache: false,
        success: function(result) {

            $('html').html(result);
            /*result = JSON.parse(result);
            if(result.success) {
                showResponseMessage(result.code, 'success');
                $('head').append('<meta http-equiv="refresh" content="0; url=' + baseURI + '">')
            } else {
                showResponseMessage(result.code, 'error');
            }*/

        },
        error: function(result) {

            $('html').html(result['responseText']);
            // Unable to connect to the server
            //showResponseMessage('Lorem ipsum dolor sit amet');

        }
    });
});