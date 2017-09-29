import Global from '../Modules/Global';
import History from '../Modules/History';

const routes = require('../Config/routes.yaml');

export default class Router {

    constructor() {

        this.route = Global.route;
        this.parseLocation();
        this.views = {};

        History.initialize(this);
        this.findRoute();

    }

    saveActions(action) {

        let actions = action.toString().split('/').filter((item) => {
            if(item.trim() !== '')
                return item.trim();
        });

        if(actions.length < 1)
            actions.push('dashboard');

        Global.routeAction = actions;

    }

    changeLocation(link, push = true, target = false) {

        if(target === 'blank') {

            const url = Router.createLink(link);
            window.open(url, '_blank');

            return true;

        }

        this.saveActions(link);
        this.findRoute(push);

    }

    static getHash() {
        return window.location.hash;
    }

    static createLink(action, route = false) {

        route = route ? '/' + route : Global.route;
        return Global.routePrefix + route + '/' + action;

    }

    parseLocation() {

        const location = window.location.href;
        const locationParts = location.split(this.route);

        Global.routePrefix = locationParts[0];
        const action = locationParts[1];

        this.saveActions(action);

    }

    findRoute(push = true) {

        if(!routes[Global.routeAction[0]]) {
            this.changeLocation(404);
            return false;
        }

        if(push)
            History.push(Global.routeAction);

        this.executeRoute();

    }

    executeRoute() {

        let View = require('../Views/' + routes[Global.routeAction[0]] + '.js').default;
        View.initialize(this);

    }

};