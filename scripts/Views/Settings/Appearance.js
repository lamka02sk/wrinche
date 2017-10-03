import Global from "../../Modules/Global";
import Utils from "../../Modules/Utils";
import Settings from "../Settings";

let appearance = {

    selector: null,

    initialize() {

        // Translate current route
        Global.translate.addTranslation('admin_settings/appearance');

        // Initialize Selectors
        this.initializeSelector();

        // Save all
        Utils.registerEvent([
            'click',
            document.querySelector('.save-button'),
            this.saveAllSettings
        ]);

    },

    initializeSelector(destroy = false) {

        if(destroy)
            this.selector.destroy();

        this.selector = new Global.Selector({
            element: '.content-subcontent select',
            selected: this.changeSettings
        });

    },

    changeSettings(instance, option) {

        const reference = instance.dataset.reference;

        let data = {};
        data[reference] = option;

        Settings.postSettings(data);

        if(reference === 'language') {
            Global.translate.switchLanguage(option);
            appearance.initializeSelector(true);
        }

    },

    saveAllSettings() {

        let selectors = document.querySelectorAll('.content-subcontent .selector-element');
        let data = {};

        selectors.forEach(
            selector => data[selector.dataset.reference] = selector.querySelector('.selector-selected').dataset.item
        );

        Settings.postSettings(data);

    }

};

module.exports = appearance;