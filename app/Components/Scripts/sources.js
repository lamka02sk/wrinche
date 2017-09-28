import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";

let sources = {

    start() {

        // Save elements
        sources.parentElement   = document.querySelector('[data-component=sources]');
        sources.nameInput       = sources.parentElement.querySelector('[name=component_sources_add_name]');
        sources.valueInput      = sources.parentElement.querySelector('[name=component_sources_add_source]');
        sources.addButton       = sources.parentElement.querySelector('.sources-add');
        sources.itemsList       = sources.parentElement.querySelector('.sources-list');
        sources.templateElement = sources.parentElement.querySelector('#template_component_sources_item').childNodes[0];

        // Events
        Utils.registerEvents([

            {
                // Enter to add source
                event  : 'keyup',
                element: sources.valueInput,
                content(event) {

                    if(!event.keyCode || event.keyCode !== 13)
                        return true;

                    sources.addButton.click();

                }
            },

            {
                // Delegate click events
                event  : 'click',
                element: sources.parentElement,
                content(event) {

                    let target = event.target;

                    // Add source
                    if(target === sources.addButton)
                        sources.addSource();

                    // Edit source
                    else if(target.matches('.source-edit')) {

                        let parent = target.parentNode;

                        sources.nameInput.value  = parent.childNodes[0].innerText.trim();
                        sources.valueInput.value = parent.childNodes[1].innerText.trim();
                        sources.nameInput.focus();

                        sources.itemsList.removeChild(parent);

                        Global.packery.reloadItems();

                    }

                    // Remove source
                    else if(target.matches('.source-remove')) {

                        sources.nameInput.value  = '';
                        sources.valueInput.value = '';
                        sources.nameInput.focus();

                        sources.itemsList.removeChild(target.parentNode);

                        Global.packery.reloadItems();

                    }

                }
            }

        ]);

    },

    addSource(source) {

        // Save current
        let currentSources = sources.itemsList.childNodes;

        let sourceNames = Object.values(currentSources).map(function(sourceElement) {
            return sourceElement.childNodes[0].innerText.trim();
        });

        const sourceName = source ? source[0] : sources.nameInput.value.trim();

        if(~sourceNames.indexOf(sourceName)) {
            sources.nameInput.value = '';
            if(!source)
                sources.nameInput.focus();
            return true;
        }

        const sourceValue = source ? source[1] : sources.valueInput.value.trim();

        if(sourceName === '' || sourceValue === '') {
            if(!source)
                sources.nameInput.focus();
            return true;
        }

        let template                   = sources.templateElement.cloneNode(true);
        template.children[0].innerText = sourceName;
        template.children[1].innerText = sourceValue;

        sources.nameInput.value  = '';
        sources.valueInput.value = '';

        if(!source)
            sources.nameInput.focus();

        sources.itemsList.insertBefore(template, sources.itemsList.childNodes[0]);
        Global.packery.reloadItems();

    },

    resume() {

        // Save current instance
        const data  = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const sources = JSON.parse(data).sources;

        if(sources === null)
            return true;

        sources.forEach(function(source) {

            this.addSource(source);

        });

        Global.packery.reloadItems();

    },

    validate() {

        return true;

    },

    serialize() {

        let sourceItems = this.itemsList.childNodes;

        let sources = Object.values(sourceItems).reverse().map(function(sourceItem) {

            return [
                sourceItem.childNodes[0].innerText.trim(),
                sourceItem.childNodes[1].innerText.trim()
            ]

        });

        return {

            sources: sources

        }

    }

};

module.exports = sources;