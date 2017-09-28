import Ajax from '../Modules/Ajax';
import Router from '../Modules/Router';
import Global from '../Modules/Global';

export default {

    viewHTML: null,
    LOCALES: [],

    createView(locales = []) {

        // Clear previous events
        this.clearEvents();

        return new Promise(resolve => {

            this.LOCALES = locales;
            this.fetchViewHTML(resolve);

        });

    },

    clearEvents() {

        let contentWrapper = document.querySelector('.content-wrapper');

        if(contentWrapper)
            contentWrapper.outerHTML = contentWrapper.outerHTML;

    },

    fetchViewHTML(resolve) {

        const url = Router.createLink(Global.routeAction.join('/'));

        Ajax.get(
            url,
            response => {
                this.viewHTML = response;
                this.replaceViewHTML(this);
                resolve();
            },
            response => {
                // Handle error event
                resolve();
            }
        );

    },

    replaceViewHTML(parent) {

        let contentWrapper = document.querySelector('.content-wrapper');

        contentWrapper
            ? parent.showView(contentWrapper)
            : parent.createContentWrapper(true);

    },

    createContentWrapper(show = false) {

        let contentWrapper = document.createElement('div');
        contentWrapper.classList.add('content-wrapper');

        Global.body.appendChild(contentWrapper);

        if(show)
            this.showView(contentWrapper);

    },

    showView(contentWrapper) {

        contentWrapper.innerHTML = this.viewHTML;
        this.translate();

    },

    translate() {

        Global.translate.translateLocales(this.LOCALES);

    }

};