var validate = {
    'username': function(inputValue) {
        if(inputValue.length < 4) {
            return 'USERNAME_SHORT';
        }
        if(inputValue.length > 25) {
            return 'USERNAME_LONG';
        }
        if(/\s/g.test(inputValue)) {
            return 'USERNAME_SPACES';
        }
        return true;
    },
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
    'password': function(inputValue) {
        if(inputValue.length < 6) {
            return 'PASSWORD_SHORT';
        }
        if(inputValue.length > 45) {
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
    'match': function(inputValue) {
        var pass = $('input[name=password]').val();
        if(pass !== inputValue) {
            return 'PASSWORD_MATCH';
        }
        return true;
    }
};

function processValidation(element, locale) {
    var formId = element.parent().parent().parent().parent().data('id');
    if(formId === 2) {
        // Call the right function
        var inputName = element.attr('name');
        var inputValue = element.val();
        var validationResult = validate[inputName](inputValue);
        if(typeof(validationResult) === 'string') {
            // Invalid - push warning
            element.parent().find('label').removeClass('valid').addClass('error');
            // Clear and push message
            element.parent().find('p.message').text(locale[validationResult]).addClass('active');
            return false;
        } else {
            // Valid - push info
            element.parent().find('label').removeClass('error').addClass('valid');
            // Clear and hide message
            element.parent().find('p.message').removeClass('active').html('');
            return true;
        }
    } else {
        // Check if anything is empty

    }
}

function validateForm(formId, locale) {
    var valid = true;
    $('div.install-form[data-id=' + formId + '] div.form-input').each(function() {
        var element = $(this).find('input');
        var result = processValidation(element, locale);
        if(!result) {
            valid = false;
            return valid;
        }
    });
    return valid;
}

function getJson(url) {
    return JSON.parse($.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        global: false,
        async: false,
        success: function (data) {
            return data;
        }
    }).responseText);
}

$(document).ready(function() {

    // Get locale
    var language = $('html').attr('lang');
    var locale = getJson("app/Data/Locale/" + language + "/install.json");

    // Formstone - Dropdown
    $('select').dropdown();

    // Animate intro
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

    // Next button
    var formsData = [];
    var isValid = true;
    $('button.next-step').click(function() {
        var formsToValidate = [2,3,4];
        var formElement = $(this).parent().parent();
        var formId = formElement.data('id');
        var nextForm = +formId + 1;
        // Serialize Form
        // Serialize Selects
        var selectsData = [];
        var selects = $(this).prev().find('.form-input').each(function() {
            var formName = $(this).find('label').attr('for');
            selectsData[formName] = $(this).find('.fs-dropdown-item_selected').data('value');
        });
        // Serialize Inputs
        var inputsData = $(this).prev().serializeArray();
        // Save data from form to variable
        var formData = [];
        formData['selects'] = selectsData;
        formData['inputs'] = inputsData;
        formsData[formId] = formData;
        // Validate if needed
        if(jQuery.inArray(formId, formsToValidate) !== -1) {
            // Validate Form
            isValid = validateForm(formId, locale);
        }
        if(!isValid) {
            return false;
        }
        // If everything OK
        // Next form
        if(formId === 4) {
            // Post data to server

        } else {
            // Show next form
            $('div.install-form').removeClass('active');
            $('div.install-form[data-id=' + nextForm + ']').addClass('active');
            // "Scrollspy" kappa
            $('.menu-box ol li').removeClass('active');
            $('.menu-box ol li[data-id=' + formId + ']').addClass('done');
            $('.menu-box ol li[data-id=' + nextForm + ']').addClass('active');
        }
    });

    // Real-time form validation
    $('input').focusout(function() {
        var element = $(this);
        processValidation(element, locale);
    }).on('change keydown keypress keyup mousedown click mouseup', function() {
        var element = $(this);
        processValidation(element, locale);
    });

});