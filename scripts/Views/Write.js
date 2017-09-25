import Global from "../Modules/Global";
import Main from '../Views/Main';
import Counters from '../Modules/Counters';
import ComponentsModule from '../../app/Components/Components';
import Flatpickr from "../Modules/Flatpickr";
import Utils from "../Modules/Utils";

export default {

    LOCALES: ['system', 'admin_write', 'components', 'admin_write/' + Global.routeAction[1]],
    components: [],

    initialize() {

        // Render content
        Main.createView(this.LOCALES).then(() => {

            // Enable libraries
            this.enableLibraries();

            // Register events
            this.registerEvents();

            // Load and resume components
            this.listComponents();
            this.prepareComponents();

        });

    },

    listComponents() {

        let componentElements = document.querySelectorAll('.component-element');

        this.components = Array.from(componentElements).map(componentElement => {
            return componentElement.getAttribute('data-component');
        });

    },

    prepareComponents() {

        this.initializeComponents();

    },

    initializeComponents() {

        Global.componentsModule = new ComponentsModule(this.components.slice(0, 23));

    },

    enableLibraries() {

        // Counters
        Counters.initialize();

        // Packery
        const Packery = require('../../vendor/packery');

        Global.packery = new Packery('.content-settings', {
            itemSelector: '.component-element',
            gutter: 22
        });

        // Sortable
        let sortableElement = document.querySelector('div.content-builder-content');

        if(sortableElement) {

            // Initialize sortable

        }

        Utils.triggerEvent(document, 'resize');

        // Flatpickr
        Flatpickr.initialize();

    },

    registerEvents() {

        let contentSettings = document.querySelector('.content-settings');

        document.querySelector('.content-wrapper').addEventListener('click', event => {

            let target = event.target;

            // Open / Close Content Settings
            if(target.matches('.collapse-trigger *')) {
                contentSettings.classList.toggle('open');
                Global.packery.reloadItems();
            }

            // Add inline component
            else if(target.matches('.builder-tools .add-content')) {
                const component = target.getAttribute('data-content');
                Global.componentsModule.createComponent(component);
            }


        });

    }

};