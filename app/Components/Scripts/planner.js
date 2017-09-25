import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";

let planner = {

    start() {

        // Save elements
        planner.parentElement = document.querySelector('[data-component=planner');
        planner.customPublish = planner.parentElement.querySelector('.component_planner_publish_custom');
        planner.notifyBox     = planner.parentElement.querySelector('.component_planner_notify_email');

        planner.publishAuto   = planner.parentElement.querySelector('[name=component_planner_publish]');
        planner.publishInput  = planner.parentElement.querySelector('[name=component_planner_publish_datetime]');
        planner.expiryInput   = planner.parentElement.querySelector('[name=component_planner_publish_expiry]');
        planner.plannerNotify = planner.parentElement.querySelector('[name=component_planner_notify]');
        planner.notifyEmail   = planner.parentElement.querySelector('[name=component_planner_notify_email]');

        // Events
        Utils.registerEvents([

            {
                // Delegate change events
                event  : 'change',
                element: planner.parentElement,
                content(event) {

                    let target = event.target;

                    // Auto-publication change
                    if(target === planner.publishAuto) {

                        if(target.checked)
                            planner.customPublish.classList.add('hide');
                        else
                            planner.customPublish.classList.remove('hide');

                        Global.packery.reloadItems();

                    }

                    // Notification change
                    else if(target === planner.plannerNotify) {

                        if(target.checked)
                            planner.notifyBox.classList.remove('hide');
                        else
                            planner.notifyBox.classList.add('hide');

                        Global.packery.reloadItems();

                    }

                }
            },

            {
                // Delegate click events
                event  : 'click',
                element: planner.parentElement,
                content(event) {

                    // Clear input
                    if(event.target.matches('.clear-input')) {

                        event.target.parentNode.querySelector('input').value = '';

                    }

                }
            }

        ]);

    },

    resume() {

        // Save current instance
        const data = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const planner = JSON.parse(data);

        if(planner === null)
            return true;

        this.publishAuto.checked = !(planner.planner);
        Utils.triggerEvent(this.publishAuto, 'change');

        this.publishInput.value = planner.planner_date;
        this.expiryInput.value  = planner.planner_expiry;

        this.plannerNotify.checked = !!(planner.planner_notify);
        Utils.triggerEvent(this.plannerNotify, 'change');

        this.notifyEmail.checked = !!(planner.planner_notify_email);

    },

    validate() {

        return true;

    },

    serialize() {

        return {

            planner             : !(planner.publishAuto.checked),
            planner_date        : planner.publishInput.value.trim(),
            planner_expiry      : planner.expiryInput.value.trim(),
            planner_notify      : !!(planner.plannerNotify.checked),
            planner_notify_email: !!(planner.notifyEmail.checked)

        }

    }

};

module.exports = planner;