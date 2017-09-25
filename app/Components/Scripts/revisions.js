import Global from "../../../scripts/Modules/Global";

let revisions = {

    start() {

        // Save elements
        revisions.parentElement = document.querySelector('[data-component=revisions]');
        revisions.textInput = revisions.parentElement.querySelector('textarea');
        revisions.listElement = revisions.parentElement.querySelector('.revisions-list');
        revisions.templateElement = revisions.parentElement.querySelector('#template_component_revisions_item').childNodes[0];

    },

    resume() {

        // Save current instance
        const data = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const revisions = JSON.parse(data).revision;

        if(revisions === null)
            return true;

        revisions.forEach(revision => {

            let template = this.templateElement.cloneNode(true);
            template.childNodes[0].innerText = revision.created_at;
            template.childNodes[1].innerText = revision.description;

            this.listElement.appendChild(template);

        });

        this.listElement.scrollTop = this.listElement.scrollHeight;

        Global.packery.reloadItems();

    },

    validate() {

        const data = revisions.serialize().revision;

        return (data.length < 251);

    },

    serialize() {

        return {

            revision: revisions.textInput.value.trim()

        }

    }

};

module.exports = revisions;