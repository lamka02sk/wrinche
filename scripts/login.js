let baseURI = '?route='; // While pretty URL does not work
let route = $('meta[name=route]').attr('content');
let URI = baseURI + route + '/';
let locale;

function showResponseMessage(content, type) {

    let code = content;

    if(content === 200)
        content = locale['login'][content];
    else
        content = locale['response'][content];

    let responseBox = $('span.response-box');
    responseBox.attr('data-locale', code);
    responseBox.html(content).removeClass('success', 'error').addClass('active').addClass(type);

}

// Translate website
let translate = new Translate(['controls', 'system', 'login', 'validate', 'response'], 'auth');
locale = translate.getLocale();

// Change language option to match reality
let language = translate.getLanguage();
$('button.selector-option[data-value=' + language + ']').click();

// Animate
$('div.outer-container, div.logo-box, img.logo-heading-charcoal, img.logo-heading-mustard, form.login-form').addClass('animate');

// Open settings
$('div.control-panel p.controls-title').click(function() {
    $('div.panel-content').toggleClass('active');
});

// Theme
initTheme('login');
$('span.theme-option').click(function() {
    let theme = $(this).data('value');
    changeTheme(theme, 'login');
    localStorage.setItem('theme_login', theme);
});


// Change language on selector click
$('#language .selector-options .selector-option').click(function() {

    let currentLanguage = $('html').attr("lang");
    let language = $(this).data('value');

    if(currentLanguage === language)
        return false;

    let lc ="ENGLISH";
    if(language === 'sk')
        lc = "SLOVAK";

    $(this).parent().parent().find('.selector-selected').attr('data-locale', lc);

    localStorage.setItem('locale_auth', language);
    translate = new Translate(['controls', 'system', 'login', 'validate', 'response'], 'auth');
    locale = translate.getLocale();

});

// Login Button
$('button.login').click(function() {

    showResponseMessage('LOADING', 'success');

    let url = URI;
    let formsData = {
        'username': $('form.login-form input[name=username]').val(),
        'password': $('form.login-form input[name=password]').val()
    };

    if(formsData.username.trim() === '' || formsData.password.trim() === '') {
        showResponseMessage('EMPTY_INPUT', 'error');
        return false;
    }

    $.ajax({
        type: 'POST',
        url: url + 'login',
        data: {
            'login': formsData,
            'csrf_token': $('meta[name=csrf_token]').attr('content')
        },
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        cache: false,
        success: function(result) {

            result = JSON.parse(result);
            if(result.success) {

                showResponseMessage(result.code, 'success');
                window.location.href = url;

            } else
                showResponseMessage(result.code, 'error');

            if(result.code === 3)
                $('div.password-question').addClass('show');

        },
        error: function(result) {

            // Unable to connect to the server or error
            result = JSON.parse(result['responseText']);
            showResponseMessage(result.code, 'error');

        }
    });

});

// Redirect to registration
$('a.register').click(function() {
    window.location.href = URI + 'register';
});

// Redirect to registration
$('a.reset-password, span.reset-password').click(function() {
    window.location.href = URI + 'lost-password';
});