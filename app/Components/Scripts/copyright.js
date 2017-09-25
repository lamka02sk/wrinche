import Global from "../../../scripts/Modules/Global";

let copy = {

    start() {

        // Save elements
        copy.parentElement = document.querySelector('[data-component=copyright]');
        copy.selectElement = copy.parentElement.querySelector('select');

        copy.selector = copy.createSelector();

    },

    createSelector() {

        return Global.Selector({
            element: '[name=component_copyright_selector]',
            opened : Global.packery.reloadItems,
            closed : Global.packery.reloadItems
        });

    },

    resume() {

        // Save current instance
        const data  = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const copyright = JSON.parse(data).copyright;

        let selectOptions = this.selectElement.querySelectorAll('option');

        Object.values(selectOptions).forEach(function(selectOption, index) {

            if(index !== copyright)
                selectOption.removeAttribute('selected');
            else
                selectOption.setAttribute('selected', 'true');

        });

        this.selector.destroy();
        this.selector = this.createSelector();

    },

    validate() {

        const data = copy.serialize().copyright;

        return (data > -1 && data < 6);

    },

    serialize() {

        return {

            copyright: parseInt(copy.selectElement.querySelector('[selected=true]').getAttribute('value'))

        }

    }

};

module.exports = copy;