componentsModule.modules.comments = {

    parentElement: document.querySelector('label[for=component_comments]').parentNode,

    data: {
        comments: false,
        comments_approve: false
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.comments.data;
    },

    events: [

        {
            // Show / Hide comments approve input
            event: 'change',
            element: document.querySelector('label[for=component_comments]').parentNode.querySelector('input[name=component_comments]'),
            content: function(event) {
                let value = !!(event.target.checked);
                componentsModule.modules.comments.data.comments = value;
                if(value)
                    componentsModule.modules.comments.parentElement.querySelector('div.component_comments_approve').classList.remove('hide');
                else
                    componentsModule.modules.comments.parentElement.querySelector('div.component_comments_approve').classList.add('hide');
                packery.packery().reloadItems();
            }
        },

        {
            // Comments approval
            event: 'change',
            element: document.querySelector('label[for=component_comments]').parentNode.querySelector('div.component_comments_approve'),
            content: function(event) {
                componentsModule.modules.comments.data.comments_approve = !!(event.target.checked);
            }
        }

    ]

};