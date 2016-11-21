/*
 * Functions to validate form fields.
 */
var validate = {

    /**
     * Validate username
     * Username: 4-25 characters, no spaces, only letters and numbers
     * @param inputValue
     */
    'username': function(inputValue) {

        if(inputValue.trim().length < 4) {
            return 'USERNAME_SHORT';
        }

        if(inputValue.trim().length > 25) {
            return 'USERNAME_LONG';
        }

        if(/\s/g.test(inputValue)) {
            return 'USERNAME_SPACES';
        }

        var regex = /^([a-zA-Z0-9]+)$/;

        if(!regex.test(inputValue)) {
            return 'USERNAME_REGEX';
        }

        return true;

    },

    /**
     * Validate e-mail
     * Email: email@example.com, no spaces
     * @param inputValue
     */
    'mail': function(inputValue) {

        if(/\s/g.test(inputValue)) {
            return 'EMAIL_SPACES';
        }

        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!regex.test(inputValue)) {
            return 'EMAIL_INVALID';
        }

        return true;

    },

    /**
     * Validate password strength
     * Password: 6-45 characters, at least 1 number, no spaces
     * @param inputValue
     */
    'password': function(inputValue) {

        if(inputValue.trim().length < 8) {
            return 'PASSWORD_SHORT';
        }

        if(inputValue.trim().length > 45) {
            return 'PASSWORD_LONG';
        }

        if(/\s/g.test(inputValue)) {
            return 'PASSWORD_SPACES';
        }

        if(inputValue.match(/\d/g) === null) {
            return 'PASSWORD_NUMBER';
        }

        return true;

    },

    /**
     * Check if both passwords match
     * @param inputValue
     */
    'match': function(inputValue) {

        var pass = $('input[name=password]').val();

        if(pass !== inputValue) {
            return 'PASSWORD_MATCH';
        }

        return true;

    },

    /**
     * Validate website name
     * Website name: 1-45 characters
     * @param inputValue
     */
    'name': function(inputValue) {

        if(inputValue.trim().length < 1) {
            return 'NAME_SHORT';
        }

        if(inputValue.trim().length > 45) {
            return 'NAME_LONG';
        }

        return true;

    },

    /**
     * Validate website description
     * Website description: 6-120 characters
     * @param inputValue
     */
    'description': function(inputValue) {

        if(inputValue.trim().length < 6) {
            return 'DESC_SHORT';
        }

        if(inputValue.trim().length > 120) {
            return 'DESC_LONG';
        }

        return true;

    }

};

/**
 * Push error message inside form to indicate invalid field content
 * @param element
 * @param content
 */
function pushMessage(element, content) {

    // Remove "Valid" identifier from label element and add "Error" identifier
    element.parent().find('label').removeClass('valid').addClass('error');

    // Push error message with given content
    element.parent().find('p.message').text(content).addClass('active');

}

/**
 * Remove error message from form and clear message content
 * @param element
 */
function removeMessage(element) {

    // Remove "Error" identifier from label element and add "Valid" identifier
    element.parent().find('label').removeClass('error').addClass('valid');

    // Hide error message and remove its content
    element.parent().find('p.message').removeClass('active').text('');

}

/**
 * Process form input validation and return result
 * @param element
 * @param locale
 * @return {boolean}
 */
function processValidation(element, locale) {

    var formId = element.parent().parent().parent().parent().data('id');
    var inputName = element.attr('name');
    var inputValue = element.val();

    // If it's Account form
    if(formId === 2) {

        // Call the right function
        var validationResult = validate[inputName](inputValue);

        if(typeof(validationResult) === 'string') {

            // Push error message and return validation result
            pushMessage(element, locale[validationResult]);
            return false;

        } else {

            // Remove error message and return validation result
            removeMessage(element);
            return true;

        }

    } else {

        var inputType = element.attr('type');

        // If it's checkbox input
        if(inputType === 'checkbox' && element.attr('name') === 'eula') {

            if(!element.prop('checked')) {

                // Push error message and return validation result
                pushMessage(element, locale['EULA_CHECK']);
                return false;

            } else {

                // Remove error message and return validation result
                removeMessage(element);
                return true;

            }

        }

        // Process Website name validation
        if(inputName === 'name') {

            validationResult = validate['name'](inputValue);

            if(typeof(validationResult) === 'string') {

                // Push error message and return validation result
                pushMessage(element, locale[validationResult]);
                return false;

            } else {

                // Remove error message and return validation result
                removeMessage(element);
                return true;

            }

        }

        // Process Website description validation
        if(inputName === 'description') {

            validationResult = validate['description'](inputValue);

            if(typeof(validationResult) === 'string') {

                // Push error message and return validation result
                pushMessage(element, locale[validationResult]);
                return false;

            } else {

                // Remove error message and return validation result
                removeMessage(element);
                return true;

            }

        }

        // Check if element is empty
        if(inputValue && inputValue.trim()) {

            // Remove error message and return validation result
            removeMessage(element);
            return true;

        } else {

            // Push error message and return validation result
            pushMessage(element, locale['INPUT_EMPTY']);
            return false;

        }

    }

}

/**
 * Initialize form validation
 * @param formId
 * @param locale
 * @return {boolean}
 */
function validateForm(formId, locale) {

    var valid = true;

    // Validate each form input
    $('div.install-form[data-id=' + formId + '] div.form-input').each(function() {

        // Check if it isn't select
        if(!$(this).hasClass('form-select')) {

            var element = $(this).find('input');

            // Process validation
            if(!processValidation(element, locale)) {
                valid = false;
            }

        }

    });

    return valid;

}

/**
 * Get files from server through AJAX
 * @param url
 */
function getJson(url) {

    return JSON.parse(
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            global: false,
            async: false,
            success: function(data) {
                return data;
            }
        }).responseText);
    
}

/**
 * Check DB connection and show message
 * @param locale
 */
function checkConnection(locale) {

    // Define form variables
    var host, name, user, pass;

    // Serialize form data
    host = $('input[name=dbhost]').val();
    name = $('input[name=dbname]').val();
    user = $('input[name=dbuser]').val();
    pass = $('input[name=dbpass]').val();

    $.ajax({
        type: 'POST',
        url: 'dbTest.php',
        data: {
            'dbhost': host,
            'dbname': name,
            'dbuser': user,
            'dbpass': pass,
            'csrf_token': $('meta[name=csrf_token]').attr('content')
        },
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        cache: false,
        async: false,
        success: function(result) {

            // Check if success or fail
            if(result === 'true') {

                // Show success message
                $('p.connection-message').removeClass('fail').addClass('success').text(locale['CONNECTION_SUCCESS']);

            } else {

                // Show fail message
                $('p.connection-message').removeClass('success').addClass('fail').text(locale['CONNECTION_ERROR']);

            }

        },
        error: function() {

            // Show fail message
            $('p.connection-message').removeClass('success').addClass('fail').text(locale['SERVER_ERROR']);

        }
    });

}

/*
 * When Document Ready
 */
var locale;

$(document).ready(function() {

    // Get and set locale
    var language = $('html').attr('lang');
    locale = getJson("app/Data/Locale/" + language + "/install.json");

    // Translate website
    changeLanguage(language, 'install', locale);

    // Intro animation
    $('div.intro').addClass('animate');

    $('button.proceed-install').delay(500).queue(function() {

        // Animate install button
        $(this).addClass('animate').dequeue();

    }).click(function() {

        // Hide intro
        $('div.intro').addClass('hide').removeClass('animate');

        // Show installer
        $('div.installer').addClass('animate');

    });

    // Make the "Next" buttons work
    var formsData = [];

    $('button.next-step').click(function() {

        var formsToValidate = [2,3,4];                      // First form doesn't need JS validation
        var formElement = $(this).parent().parent();
        var formId = formElement.data('id');
        var nextForm = +formId + 1;

        // Serialize and save form data
        formsData[formId] = $(this).prev().serializeArray();

        // Validate form
        if(jQuery.inArray(formId, formsToValidate) !== -1) {

            // Run validation and die if not valid
            if(!validateForm(formId, locale)) {
                return false;
            }

        }

        /* Only if form is valid */

        // Check database connection if DB form
        if(formId === 3) {

            checkConnection(locale);

            // Stop function if connection failed
            if($('p.connection-message').hasClass('fail')) {
                return false;
            }

        }

        // Show next form or run installation
        if(formId !== 4) {

            // Show next form
            $('div.install-form').removeClass('active');
            $('div.install-form[data-id=' + nextForm + ']').addClass('active');

            // Modify Installation navigation
            $('.menu-box ol li').removeClass('active');
            $('.menu-box ol li[data-id=' + formId + ']').addClass('done');
            $('.menu-box ol li[data-id=' + nextForm + ']').addClass('active');

        } else {

            // Hide last form
            $('div.installer').removeClass('animate');

            // Show installing element
            $('div.installing').addClass('show');

            // Send data to server for install
            $.ajax({
                type: 'POST',
                url: 'index.php',
                data: {
                    'installer': formsData,
                    'csrf_token': $('meta[name=csrf_token]').attr('content')
                },
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                cache: false,
                async: true,
                success: function(result) {

                    result = JSON.parse(result);

                    // Hide installation message
                    $('div.installing').removeClass('show').addClass('hide');

                    // Check installation
                    if(result['success'] !== true) {

                        // Show install-error message
                        $('div.install-error').addClass('show');

                    } else {

                        // Show success message
                        $('div.installed').addClass('show');
                        $('p[data-locale=DONE_ADMIN]').append(': ' + result['admin']);

                    }

                },
                error: function() {

                    // Hide installation message
                    $('div.installing').removeClass('show').addClass('hide');

                    // Show install-error message
                    $('div.install-error').addClass('show');

                }
            });

            // Purge user form inputs
            formsData = [];

        }

    });

    // Real-time form validation
    $('input').on('change keydown keypress keyup mousedown click mouseup focusout', function() {

        if($(this).is('checkbox')) {
            return;
        }

        // Initialize input validation
        var element = $(this);
        processValidation(element, locale);

    });

    // Check DB connection
    $('button.test-connection').click(function() {

        // Check DB connection
        checkConnection(locale);

    });

    // Click checkboxes
    $('label.checkbox').click(function() {

        // Save the clicked input element
        var input = $(this).parent().find("input");

        // Toggle checkbox :checked property
        if(input.is(":checked")) {
            input.prop("checked", false);
        } else {
            input.prop("checked", true);
        }

    });

    // Change language on selector click
    $('#selector_language .selector-options .selector-option').click(function() {

        var currentLanguage = $('html').attr("lang");
        var language = $(this).data('value');

        if(currentLanguage === language) {
            return;
        }

        var lc ="ENGLISH";
        if(language === 'sk') {
            lc = "SLOVAK";
        }

        $(this).parent().parent().find('.selector-selected').attr('data-locale', lc);
        locale = changeLanguage(language, 'install');

    });

    // Change theme on selector click
    $('#selector_theme .selector-options .selector-option').click(function() {

        var theme = $(this).data('value');

        if(currentTheme === theme) {
            return;
        }

        changeTheme(theme, 'installation');

        currentTheme = theme;

    });

    // Try again button
    $('button.try-again').click(function() {

        // Remove all post installation overlays
        $('div.installing, div.installed, div.install-error').removeClass('show');

        // Reset all forms
        $('div.install-form').removeClass('active');

        // Show first form
        $('div.install-form[data-id=1]').addClass('active');

        // Show welcome overlay
        $('div.intro').removeClass('hide').addClass('animate');

        // Reset menu
        $('div.menu-box ol li').removeClass();
        $('div.menu-box ol li[data-id=1]').addClass('active');

    });

    // Day / Night Theme Auto Switch
    var currentTheme = 'light';
    var date = new Date();
    if((date.getHours() >= 18) || (date.getHours() < 8)) {

        // Switch theme to Dark
        changeTheme('dark', 'installation');
        currentTheme = 'dark';

        // Toggle selector value
        document.querySelector("button[data-value=dark]").click();

    }

});