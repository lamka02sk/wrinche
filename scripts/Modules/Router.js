import Global from '../Modules/Global';

const routes = require('../Config/routes.yaml');

export default class {

    constructor() {

        this.route = Global.route;
        this.parseLocation();

        this.prefix = Global.routePrefix;
        this.action = Global.routeAction;

        this.findRoute();

    }

    changeLocation(link) {



    }

    getHash() {
        return window.location.hash;
    }

    createLink(action, route = false) {

        route = (route) ? '/' + route : this.route;
        return Global.routePrefix + route + '/' + action;

    }

    parseLocation() {

        const location = window.location.href;
        const locationParts = location.split(this.route);

        Global.routePrefix = locationParts[0];
        const action = locationParts[1];

        let actions = action.split('/').filter((item) => {
            if(item.trim() !== '')
                return item.trim();
        });

        if(actions.length < 1)
            actions.push('dashboard');

        Global.routeAction = actions;

    }

    findRoute() {

        if(routes.indexOf(this.action[0]) === -1) {
            this.changeLocation(404);
            return false;
        }



    }

    executeRoute() {



    }

};