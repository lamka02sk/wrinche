componentsModule.modules.revisions = {

    start: function() {

        // Save elements
        let current = componentsModule.modules.revisions;
        current.parentElement = document.querySelector('[data-component=revisions]');
        current.textInput = current.parentElement.querySelector('textarea');
        current.listElement = current.parentElement.querySelector('.revisions-list');
        current.templateElement = current.parentElement.querySelector('#template_component_revisions_item').childNodes[0];

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.revisions;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const revisions = JSON.parse(data).revision;

        if(revisions === null)
            return true;

        revisions.forEach(function(revision) {

            let template = current.templateElement.cloneNode(true);
            template.childNodes[0].innerText = revision.created_at;
            template.childNodes[1].innerText = revision.description;

            current.listElement.appendChild(template);

        });

        current.listElement.scrollTop = current.listElement.scrollHeight;

        reloadPackery();

    },

    validate: function() {

        const data = componentsModule.modules.revisions.serialize().revision;

        return (data.length < 251);

    },

    serialize: function() {

        return {

            revision: componentsModule.modules.revisions.textInput.value.trim()

        }

    }

};