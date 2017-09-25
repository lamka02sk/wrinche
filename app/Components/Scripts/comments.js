import Global from "../../../scripts/Modules/Global";
import Utils from "../../../scripts/Modules/Utils";

let comments = {

    start() {

        // Save elements
        comments.parentElement = document.querySelector('[data-component=comments]');
        comments.commentsCheck = comments.parentElement.querySelector('[name=component_comments]');
        comments.approveBox    = comments.parentElement.querySelector('.component_comments_approve');
        comments.approveCheck  = comments.approveBox.querySelector('input');

        // Events
        Utils.registerEvent({

            event  : 'change',
            element: comments.commentsCheck,
            content() {

                if(!!(comments.commentsCheck.checked))
                    comments.approveBox.classList.remove('hide');
                else
                    comments.approveBox.classList.add('hide');

                Global.packery.reloadItems();

            }

        });

    },

    resume() {

        // Save current instance
        const data  = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const comments = JSON.parse(data);

        this.commentsCheck.checked = !!(comments.comments);
        Utils.triggerEvent(this.commentsCheck, 'change');

        this.approveCheck.checked = (comments.comments_approve);

    },

    validate() {

        return true;

    },

    serialize() {

        return {

            comments        : !!(comments.commentsCheck.checked),
            comments_approve: !!(comments.approveCheck.checked)

        }

    }

};

module.exports = comments;