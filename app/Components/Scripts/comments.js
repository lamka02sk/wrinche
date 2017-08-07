componentsModule.modules.comments = {

    start: function() {

        // Save elements
        let current           = componentsModule.modules.comments;
        current.parentElement = document.querySelector('[data-component=comments]');
        current.commentsCheck = current.parentElement.querySelector('[name=component_comments]');
        current.approveBox    = current.parentElement.querySelector('.component_comments_approve');
        current.approveCheck  = current.approveBox.querySelector('input');

        // Events
        componentsModule.initializeEvent({

            event  : 'change',
            element: current.commentsCheck,
            content: function() {

                if(!!(current.commentsCheck.checked))
                    current.approveBox.classList.remove('hide');
                else
                    current.approveBox.classList.add('hide');

                reloadPackery();

            }

        });

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.comments;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const comments = JSON.parse(data);

        current.commentsCheck.checked = !!(comments.comments);
        triggerEvent(current.commentsCheck, 'change');

        current.approveCheck.checked = (comments.comments_approve);

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        let current = componentsModule.modules.comments;

        return {

            comments        : !!(current.commentsCheck.checked),
            comments_approve: !!(current.approveCheck.checked)

        }

    }

};