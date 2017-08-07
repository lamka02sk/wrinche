componentsModule.modules.copyright = {

    start: function() {

        // Save elements
        let current           = componentsModule.modules.copyright;
        current.parentElement = document.querySelector('[data-component=copyright]');
        current.selectElement = current.parentElement.querySelector('select');

        current.selector = current.createSelector();

    },

    createSelector: function() {

        return new Selector({
            selector: '[name=component_copyright_selector]',
            onOpen  : reloadPackery,
            onClose : reloadPackery
        });

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.copyright;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const copyright = JSON.parse(data).copyright;

        let selectOptions = current.selectElement.querySelectorAll('option');

        Object.values(selectOptions).forEach(function(selectOption, index) {

            if(index !== copyright)
                selectOption.removeAttribute('selected');
            else
                selectOption.setAttribute('selected', 'true');

        });

        current.selector.destroy();
        current.selector = current.createSelector();

    },

    validate: function() {

        const data = componentsModule.modules.copyright.serialize().copyright;

        return (data > -1 && data < 6);

    },

    serialize: function() {

        return {

            copyright: parseInt(componentsModule.modules.copyright.selectElement.querySelector('[selected=true]').getAttribute('value'))

        }

    }

};