import Global from '../Modules/Global';

export default {

    initialize(router) {

        window.onpopstate = event => {
            const link = event.state.link;
            router.changeLocation(link, false);
        };

    },

    createURL(route) {
        return Global.routePrefix + Global.route + '/' + route.join('/');
    },

    push(route) {
        history.pushState({ link: route }, '', this.createURL(route));
    },

    replace(route) {
        history.replaceState({ link: route }, '', this.createURL(route));
    }

}