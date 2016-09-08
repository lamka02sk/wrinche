$(document).ready(function() {

    // Get locale
    var locale = [];
    var language = $('html').attr('lang');
    $.ajax({
        type: "GET",
        url: "app/Data/Locale/" + language + "/install.json",
        success: function(result) {
            locale = result;
        }
    });

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
    $('button.next-step').click(function() {
        var formsToValidate = [2,3,4];
        var formElement = $(this).parent().parent();
        var formId = formElement.data('id');
        var isValid = true;
        var nextForm = +formId + 1;
        if(jQuery.inArray(formId, formsToValidate) !== -1) {
            // Validate Form

        }
        if(!isValid) {
            return false;
        }
        // If everything OK
        // Serialize Form
        // Serialize Selects
        var selectsData = [];
        var selects = $(this).prev().find('.form-input').each(function() {
            var formName = $(this).find('label').attr('for');
            selectsData[formName] = $(this).find('.fs-dropdown-item_selected').data('value');
        });
        // Serialize Inputs
        var inputsData = [$(this).prev().serialize()];
        // Save data from form to variable
        var formData = [];
        formData['selects'] = selectsData;
        formData['inputs'] = inputsData;
        formsData[formId] = formData;
        // Next form
        if(formId === 4) {
            // Post data to server

        } else {
            // Show next form
            $('div.install-form').removeClass('active');
            $('div.install-form[data-id=' + nextForm + ']').addClass('active');
        }
    });

});