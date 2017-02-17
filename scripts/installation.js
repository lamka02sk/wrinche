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
function popMessage(element) {

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

    let formId = element.parent().parent().parent().parent().data('id');
    let inputName = element.attr('name');
    let inputValue = element.val();
    let validationResult;
    let validate = new Validator;

    // If it's Account form
    if(formId === 2) {

        // Call the right function
        validationResult = validate[inputName](inputValue);

        if(typeof(validationResult) === 'string') {

            // Push error message and return validation result
            pushMessage(element, locale['validate'][validationResult]);
            return false;

        } else {

            // Remove error message and return validation result
            popMessage(element);
            return true;

        }

    } else {

        let inputType = element.attr('type');

        // If it's checkbox input
        if(inputType === 'checkbox' && element.attr('name') === 'eula') {

            if(!element.prop('checked')) {

                // Push error message and return validation result
                pushMessage(element, locale['validate']['EULA_CHECK']);
                return false;

            } else {

                // Remove error message and return validation result
                popMessage(element);
                return true;

            }

        }

        // Process Website name validation
        if(inputName === 'name') {

            validationResult = validate['name'](inputValue);

            if(typeof(validationResult) === 'string') {

                // Push error message and return validation result
                pushMessage(element, locale['validate'][validationResult]);
                return false;

            } else {

                // Remove error message and return validation result
                popMessage(element);
                return true;

            }

        }

        // Process Website description validation
        if(inputName === 'description') {

            validationResult = validate['description'](inputValue);

            if(typeof(validationResult) === 'string') {

                // Push error message and return validation result
                pushMessage(element, locale['validate'][validationResult]);
                return false;

            } else {

                // Remove error message and return validation result
                popMessage(element);
                return true;

            }

        }

        // Check if element is empty
        if(inputValue && inputValue.trim()) {

            // Remove error message and return validation result
            popMessage(element);
            return true;

        } else {

            // Push error message and return validation result
            pushMessage(element, locale['validate']['INPUT_EMPTY']);
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

    let valid = true;

    // Validate each form input
    $('div.install-form[data-id=' + formId + '] div.form-input').each(function() {

        // Check if it isn't select
        if(!$(this).hasClass('form-select')) {

            let element = $(this).find('input');

            // Process validation
            if(!processValidation(element, locale))
                valid = false;

        }

    });

    return valid;

}

/**
 * Check DB connection and show message
 * @param locale
 */
function checkConnection(locale) {

    // Define form variables
    let host, name, user, pass;

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
                $('p.connection-message').removeClass('fail').addClass('success').text(locale['install']['CONNECTION_SUCCESS']);

            } else {

                // Show fail message
                $('p.connection-message').removeClass('success').addClass('fail').text(locale['install']['CONNECTION_ERROR']);

            }

        },
        error: function() {

            // Show fail message
            $('p.connection-message').removeClass('success').addClass('fail').text(locale['install']['SERVER_ERROR']);

        }
    });

}

/*
 * When Document Ready
 */
let locale;

$(document).ready(function() {

    // Translate website
    let translate = new Translate(['controls', 'system', 'validate', 'install'], 'install');
    locale = translate.getLocale();

    // Change language option to match reality
    let language = translate.getLanguage();
    $('button.selector-option[data-value=' + language + ']').click();

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
    let formsData = [];

    $('button.next-step').click(function() {

        let formsToValidate = [2,3,4];                      // First form doesn't need JS validation
        let formElement = $(this).parent().parent();
        let formId = formElement.data('id');
        let nextForm = +formId + 1;

        // Serialize and save form data
        formsData[formId] = $(this).prev().serializeArray();

        // Validate form
        if(jQuery.inArray(formId, formsToValidate) !== -1) {

            // Run validation and die if not valid
            if(!validateForm(formId, locale))
                return false;

        }

        /* Only if form is valid */

        // Check database connection if DB form
        if(formId === 3) {

            checkConnection(locale);

            // Stop function if connection failed
            if($('p.connection-message').hasClass('fail'))
                return false;

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
                        $('p[data-locale=DONE_ADMIN]').append(' ' + result['admin']);

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

        if($(this).is('checkbox'))
            return false;

        // Initialize input validation
        let element = $(this);
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
        let input = $(this).parent().find("input");

        // Toggle checkbox :checked property
        if(input.is(":checked"))
            input.prop("checked", false);
        else
            input.prop("checked", true);

    });

    // Change language on selector click
    $('#selector_language .selector-options .selector-option').click(function() {

        let currentLanguage = $('html').attr("lang");
        let language = $(this).data('value');

        if(currentLanguage === language)
            return false;

        let lc ="ENGLISH";
        if(language === 'sk')
            lc = "SLOVAK";

        $(this).parent().parent().find('.selector-selected').attr('data-locale', lc);

        // Translate website
        localStorage.setItem('locale_install', language);
        let translate = new Translate(['controls', 'system', 'install', 'validate'], 'install');
        locale = translate.getLocale();

    });

    // Change theme on selector click
    $('#selector_theme .selector-options .selector-option').click(function() {

        let theme = $(this).data('value');

        if(currentTheme === theme)
            return false;

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
    let currentTheme = 'light';
    let date = new Date();
    if((date.getHours() >= 18) || (date.getHours() < 8)) {

        // Switch theme to Dark
        changeTheme('dark', 'installation');
        currentTheme = 'dark';

        // Toggle selector value
        document.querySelector("button[data-value=dark]").click();

    }

});