let baseURI = '?route='; // While pretty URL does not work
let route = $('meta[name=route]').attr('content');
let URI = baseURI + route + '/';
let locale;

function showResponseMessage(content, type) {

    let responseBox = $('span.response-box');
    responseBox.attr('data-locale', content);
    responseBox.html(locale['response'][content]).addClass('active').addClass(type).delay(3000).queue(function() {
        $(this).removeClass('active').removeClass(type).attr('data-locale', '').dequeue();
    });

}

function pushValidMessage(element, content) {
    element = $(element);
    element.attr('data-locale', content);
    element.html(locale['validate'][content]);
}

function popValidMessage(element) {
    $(element).html('').attr('data-locale', '');
}

// Translate website
let translate = new Translate(['controls', 'system', 'resetpassword', 'validate', 'response'], 'auth');
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
    translate = new Translate(['controls', 'system', 'resetpassword', 'validate', 'response'], 'auth');
    locale = translate.getLocale();

});

function validateResetPassword(element) {

    let input = element;
    let label = input.prev();
    let output = input.next();
    let text = input.val();
    let type = input.attr('name');
    let validationResult;
    let validate = new Validator;

    if(type === 'hash')
        return true;

    validationResult = validate[type](text);
    if(typeof(validationResult) === 'string') {

        pushValidMessage(output, validationResult);
        label.removeClass('valid').addClass('error');
        return false;

    } else {

        popValidMessage(output);
        label.removeClass('error').addClass('valid');
        return true;

    }

}

// Real-time form validation
$('input').on('change keydown keypress keyup mousedown click mouseup focusout', function () {
    validateResetPassword($(this));
});

// Login Button
$('button.reset-button').click(function() {

    let url = URI;
    let formsData = {
        'hash': $('form.login-form input[name=hash]').val(),
        'password': $('form.login-form input[name=password]').val(),
        'password_repeat': $('form.login-form input[name=password_repeat]').val()
    };

    if(formsData.hash.trim() === '' || formsData.password.trim() === '' || formsData.password_repeat.trim() === '') {
        showResponseMessage('EMPTY_INPUT', 'error');
        return false;
    }

    let valid = true;
    $('div.form-input').each(function() {
        if(!validateResetPassword($(this).find('input')))
            valid = false;
    });

    if(!valid)
        return false;

    $.ajax({
        type: 'POST',
        url: url + 'reset-password',
        data: {
            'reset-password': formsData,
            'csrf_token': $('meta[name=csrf_token]').attr('content')
        },
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        cache: false,
        success: function(result) {

            result = JSON.parse(result);
            if(result.success) {
                showResponseMessage(result.code, 'success');
                window.location.href = URI + 'login';
            } else
                showResponseMessage(result.code, 'error');

        },
        error: function(result) {

            // Unable to connect to the server or error
            result = JSON.parse(result['responseText']);
            showResponseMessage(result.code, 'error');

        }
    });

});

// Redirect to registration
$('a.login-button').click(function() {
    window.location.href = URI + 'login';
});