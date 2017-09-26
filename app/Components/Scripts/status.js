import Global from "../../../scripts/Modules/Global";

let status = {

    start() {

        // Save elements
        status.parentElement = document.querySelector('[data-component=status]');
        status.selectElement = status.parentElement.querySelector('select');

        status.selector = status.createSelector();

    },

    createSelector() {

        return new Global.Selector({
            element: 'select[name=component_status]',
            opened : Global.packery.reloadItems,
            closed : Global.packery.reloadItems
        });

    },

    resume() {

        // Save current instance
        const data  = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const status = JSON.parse(data).status;

        let selectOptions = this.selectElement.querySelectorAll('option');

        Object.values(selectOptions).forEach(function(selectOption, index) {

            if(index !== status)
                selectOption.removeAttribute('selected');
            else
                selectOption.setAttribute('selected', 'true');

        });

        this.selector.destroy();
        this.selector = this.createSelector();

    },

    validate() {

        const data = status.serialize().status;

        return (data > -1 && data < 4);

    },

    serialize() {

        return {

            status: parseInt(status.selectElement.querySelector('[selected=true]').getAttribute('value'))

        }

    }

};

module.exports = status;