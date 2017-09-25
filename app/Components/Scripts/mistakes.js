import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";

let mistakes = {

    start: function() {

        // Save elements
        mistakes.parentElement = document.querySelector('[data-component=mistakes]');
        mistakes.enableCheck   = mistakes.parentElement.querySelector('[name=component_mistakes]');
        mistakes.notifyBox     = mistakes.parentElement.querySelector('.component_mistakes_notify');
        mistakes.notifyCheck   = mistakes.notifyBox.querySelector('[name=component_mistakes_notify]');
        mistakes.emailBox      = mistakes.notifyBox.querySelector('div');
        mistakes.emailCheck    = mistakes.emailBox.querySelector('input');

        // Delegate change event
        Utils.registerEvent({

            event  : 'change',
            element: mistakes.parentElement,
            content: function(event) {

                let target = event.target;

                // Show notifications settings
                if(target === mistakes.enableCheck) {

                    if(!!(target.checked))
                        mistakes.notifyBox.classList.remove('hide');
                    else
                        mistakes.notifyBox.classList.add('hide');

                    Global.packery.reloadItems();

                }

                // Show email notifications settings
                else if(target === mistakes.notifyCheck) {

                    if(!!(target.checked))
                        mistakes.emailBox.classList.remove('hide');
                    else
                        mistakes.emailBox.classList.add('hide');

                    Global.packery.reloadItems();

                }

            }

        });

    },

    resume: function() {

        // Save current instance
        const data  = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const mistakes = JSON.parse(data);

        this.enableCheck.checked = !!(mistakes.mistakes);
        Utils.triggerEvent(this.enableCheck, 'change');

        this.emailCheck.checked = !!(mistakes.mistakes_email);

        this.notifyCheck.checked = !!(mistakes.mistakes_notify);
        Utils.triggerEvent(this.notifyCheck, 'change');

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        return {

            mistakes       : !!(mistakes.enableCheck.checked),
            mistakes_notify: !!(mistakes.notifyCheck.checked),
            mistakes_email : !!(mistakes.emailCheck.checked)

        }

    }

};

module.exports = mistakes;