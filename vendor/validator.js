/**
 * Validation Class for validating user input inside forms.
 * If user input is valid, returns boolean true.
 * If user input is invalid, return error codename as string.
 * @constructor
 */
function Validator() {}

/**
 * Validate username
 * Username: 4-25 characters, no spaces, only letters and numbers
 * @param inputValue
 */
Validator.prototype.username = function(inputValue) {

    if(inputValue.trim().length < 4)
        return 'USERNAME_SHORT';

    if(inputValue.trim().length > 25)
        return 'USERNAME_LONG';

    if(/\s/g.test(inputValue))
        return 'USERNAME_SPACES';

    let regex = /^([a-zA-Z0-9]+)$/;

    if(!regex.test(inputValue))
        return 'USERNAME_REGEX';

    return true;

};

/**
 * Validate e-mail
 * Email: email@example.com, no spaces
 * @param inputValue
 */
Validator.prototype.email = function(inputValue) {

    if(/\s/g.test(inputValue))
        return 'EMAIL_SPACES';

    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!regex.test(inputValue))
        return 'EMAIL_INVALID';

    return true;

};

/**
 * Validate password strength
 * Password: 6-45 characters, at least 1 number, no spaces
 * @param inputValue
 */
Validator.prototype.password = function(inputValue) {

    if(inputValue.trim().length < 8)
        return 'PASSWORD_SHORT';

    if(inputValue.trim().length > 45)
        return 'PASSWORD_LONG';

    if(/\s/g.test(inputValue))
        return 'PASSWORD_SPACES';

    if(inputValue.match(/\d/g) === null)
        return 'PASSWORD_NUMBER';

    return true;

};

/**
 * Check if both passwords match
 * @param inputValue
 */
Validator.prototype.password_repeat = function(inputValue) {

    let pass = $('input[name=password]').val();

    if(pass !== inputValue)
        return 'PASSWORD_MATCH';

    return true;

};

/**
 * Validate website name
 * Website name: 1-45 characters
 * @param inputValue
 */
Validator.prototype.name = function(inputValue) {

    if(inputValue.trim().length < 1)
        return 'NAME_SHORT';

    if(inputValue.trim().length > 45)
        return 'NAME_LONG';

    return true;

};

/**
 * Validate website description
 * Website description: 6-120 characters
 * @param inputValue
 */
Validator.prototype.description = function(inputValue) {

    if(inputValue.trim().length < 6)
        return 'DESC_SHORT';

    if(inputValue.trim().length > 120)
        return 'DESC_LONG';

    return true;

};