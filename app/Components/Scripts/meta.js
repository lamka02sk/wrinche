componentsModule.modules.meta = {

    start: function() {

        // Save elements
        let current           = componentsModule.modules.meta;
        current.parentElement = document.querySelector('[data-component=meta]');
        current.customCheck   = current.parentElement.querySelector('[name=component_meta_manually]');
        current.customBox     = current.parentElement.querySelector('.component_meta_custom');
        current.keyInput      = current.parentElement.querySelector('[name=component_meta_keywords]');
        current.descInput     = current.parentElement.querySelector('[name=component_meta_description]');
        current.robotsSelect  = current.parentElement.querySelector('[name=component_meta_robots]');

        current.customCheck.checked = false;

        // Selector
        current.selector = current.createSelector();

        // Events
        componentsModule.initializeEvent({

            event  : 'change',
            element: current.customCheck,
            content: function() {

                if(current.customCheck.checked)
                    current.customBox.classList.remove('hide');
                else
                    current.customBox.classList.add('hide');

                reloadPackery();

            }

        });

    },

    createSelector: function() {

        return new Selector({
            selector: '[name=component_meta_robots]',
            onOpen  : reloadPackery,
            onClose : reloadPackery
        });

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.meta;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const meta = JSON.parse(data);

        current.customCheck.checked = !!(meta.meta);
        triggerEvent(current.customCheck, 'change');

        current.keyInput.value  = meta.meta_keywords.trim();
        current.descInput.value = meta.meta_description.trim();

        let selectOptions = current.robotsSelect.querySelectorAll('option');

        Object.values(selectOptions).forEach(function(selectOption, index) {

            if(index !== meta.meta_robots)
                selectOption.removeAttribute('selected');
            else
                selectOption.setAttribute('selected', 'true');

        });

        current.selector.destroy();
        current.selector = current.createSelector();

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        let current = componentsModule.modules.meta;

        return {

            meta            : !!(current.customCheck.checked),
            meta_keywords   : current.keyInput.value.trim(),
            meta_description: current.descInput.value.trim(),
            meta_robots     : parseInt(current.robotsSelect.querySelector('[selected=true]').getAttribute('value'))

        }

    }

};