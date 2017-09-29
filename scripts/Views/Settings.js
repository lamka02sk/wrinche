import Main from "./Main";
import Global from "../Modules/Global";
import Utils from "../Modules/Utils";

export default {

    LOCALES: ['system', 'response', 'admin_settings'],
    components: [],

    initialize() {

        // Render content
        Main.createView(this.LOCALES).then(() => {

            // Switch view
            let View = require('../Views/Settings/' + Utils.capitalizeFirst(Global.routeAction[1] || 'appearance'));
            View.initialize();

        });

    },

};