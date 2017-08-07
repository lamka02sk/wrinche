componentsModule.modules.status = {

    start: function() {

        // Save elements
        let current           = componentsModule.modules.status;
        current.parentElement = document.querySelector('[data-component=status]');
        current.selectElement = current.parentElement.querySelector('select');

        current.selector = current.createSelector();

    },

    createSelector: function() {

        return new Selector({
            selector: 'select[name=component_status]',
            onOpen  : reloadPackery,
            onClose : reloadPackery
        });

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.status;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const status = JSON.parse(data).status;

        let selectOptions = current.selectElement.querySelectorAll('option');

        Object.values(selectOptions).forEach(function(selectOption, index) {

            if(index !== status)
                selectOption.removeAttribute('selected');
            else
                selectOption.setAttribute('selected', 'true');

        });

        current.selector.destroy();
        current.selector = current.createSelector();

    },

    validate: function() {

        const data = componentsModule.modules.status.serialize().status;

        return (data > -1 && data < 4);

    },

    serialize: function() {

        return {

            status: parseInt(componentsModule.modules.status.selectElement.querySelector('[selected=true]').getAttribute('value'))

        }

    }

};