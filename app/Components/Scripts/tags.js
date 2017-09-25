import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";

let tags = {

    start() {

        // Save elements
        tags.parentElement = document.querySelector('[data-component=tags]');
        tags.inputElement = tags.parentElement.querySelector('input');
        tags.listElement = tags.parentElement.querySelector('.tags-list');
        tags.templateElement = tags.parentElement.querySelector('#template_component_tags_item').childNodes[0];

        // Events
        Utils.registerEvents([

            {
                // Delegate click event
                event: 'click',
                element: tags.parentElement,
                content(event) {

                    // Remove tag
                    if(event.target.matches('.tag-remove')) {

                        tags.listElement.removeChild(event.target.parentNode);
                        Global.packery.reloadItems();

                    }

                }
            },

            {
                // Add tags
                event: 'keyup',
                element: tags.inputElement,
                content(event) {

                    if(!event.keyCode || event.keyCode !== 13)
                        return true;

                    tags.addTag();

                }
            }

        ]);

    },

    resume() {

        // Save current instance
        const data  = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const tags = JSON.parse(data).tags;

        if(tags === null)
            return true;

        this.addTag(tags.join(','));

    },

    addTag(list) {

        const tags = list || this.inputElement.value.trim();

        if(!Utils.validateTags(tags))
            return true;

        const tagList = tags.split(',');

        tagList.map(tag => {

            tag = tag.trim();
            const currentTags = this.serialize().tags;

            if(~currentTags.indexOf(tag))
                return true;

            let template = this.templateElement.cloneNode(true);
            template.innerHTML = '#' + tag + template.innerHTML;

            this.inputElement.value = '';
            this.listElement.appendChild(template);

            Global.packery.reloadItems();

        });

    },

    validate() {

        const tags = tags.serialize().tags;

        return Utils.validateTags(tags);

    },

    serialize() {

        const tagElements = tags.listElement.childNodes;

        let tagList = Array.from(tagElements).map(function(tagElement) {

            return tagElement.innerText.trim().replace('#', '');

        });

        return {

            tags: tagList

        }

    }

};

module.exports = tags;