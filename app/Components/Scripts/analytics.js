import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";

let analytics = {

    start: function() {

        // Save elements
        analytics.parentElement  = document.querySelector('[data-component=analytics]');
        analytics.detailsElement = analytics.parentElement.querySelector('div.component_analytics_details');
        analytics.analyticsCheck = analytics.parentElement.querySelector('[name=component_analytics]');
        analytics.detailsCheck   = analytics.parentElement.querySelector('[name=component_analytics_details]');

        // Show / Hide "detailed analytics" checkbox
        Utils.registerEvent({

            event  : 'change',
            element: analytics.analyticsCheck,

            content: function(event) {

                let classList = analytics.detailsElement.classList;

                if(!!(event.target.checked))
                    classList.remove('hide');
                else
                    classList.add('hide');

                Global.packery.reloadItems();

            }

        })

    },

    resume: function() {

        // Save current instance
        const data  = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const analytics = JSON.parse(data);

        this.analyticsCheck.checked = !!(analytics.analytics);
        Utils.triggerEvent(this.analyticsCheck, 'change');

        this.detailsCheck.checked = !!(analytics.analytics_details);

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        return {

            analytics        : !!(analytics.analyticsCheck.checked),
            analytics_details: !!(analytics.detailsCheck.checked)

        }

    }

};

module.exports = analytics;