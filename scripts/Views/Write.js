import Global from "../Modules/Global";
import Main from '../Views/Main';
import Counters from '../Modules/Counters';
import ComponentsModule from '../../app/Components/Components';
import Flatpickr from "../Modules/Flatpickr";
import Utils from "../Modules/Utils";
import Sortable from 'sortablejs';

export default {

    LOCALES: ['system', 'response', 'admin_write', 'components', 'admin_write/' + Global.routeAction[1]],
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

        Global.componentsModule = new ComponentsModule(this.components);

    },

    enableLibraries() {

        // Counters
        Counters.initialize();

        // Packery
        //const Packery = require('../../vendor/packery');
        /*Global.packery = new Packery('.content-settings', {
            itemSelector: '.component-element',
            gutter: 22
        });*/

        // Until Packery is broken
        Global.packery = {};
        Global.packery.reloadItems = () => {};

        // Sortable
        let sortableElement = document.querySelector('div.content-builder-content');

        if(sortableElement) {

            Sortable.create(sortableElement, {
                sort     : true,
                animation: 200,
                scroll   : true,
                draggable: '.component-element',
                handle   : '.component-inline-drag',
                onChoose : function() {
                    let elements = document.querySelectorAll('div.component-placeholder');
                    elements.forEach(function(element) {
                        element.classList.remove('hide');
                    });
                },
                onStart  : function(event) {
                    let identifier = event.item.attributes['data-id'].value;
                    if(CKEDITOR.instances['editor_' + identifier])
                        CKEDITOR.instances['editor_' + identifier].destroy();
                },
                onEnd    : function(event) {
                    let element    = event.item;
                    let identifier = element.attributes['data-id'].value;
                    let component  = element.attributes['data-component'].value;
                    if(component in Global.componentsModule.modules) {
                        if('reload' in Global.componentsModule.modules[component])
                            Global.componentsModule.modules[component].reload(identifier);
                    }
                    let elements = document.querySelectorAll('div.component-placeholder');
                    elements.forEach(function(element) {
                        element.classList.add('hide');
                    });
                }
            });

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