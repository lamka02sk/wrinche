export default {

    initialize() {

        window.onpopstate = event => {



        };

    },

    push(route) {
        history.pushState({}, '', route);
    },

    replace(route) {
        history.replaceState({}, '', route);
    }

}