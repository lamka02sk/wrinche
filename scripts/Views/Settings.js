import Main from "./Main";
import Global from "../Modules/Global";
import Utils from "../Modules/Utils";
import Ajax from "../Modules/Ajax";
import Router from "../Modules/Router";
import Slee from "../Modules/Slee";
import Csrf from "../Modules/Csrf";

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

    postSettings(data) {

        function execute(resolve) {

            Ajax.post(
                Router.createLink('settings/' + (Global.routeAction[1] || 'appearance') + '&csrf_token=' + Csrf.getToken()),
                data,
                (response, status) => {

                    try {

                        response = JSON.parse(response);

                        if(status !== 'success') {
                            Slee.error('ERROR', 0);
                            resolve();
                        }

                        else if(response.code !== 200) {
                            Slee.error('ERROR', response.code);
                            resolve();
                        }

                        else {
                            Slee.success('SUCCESS', 'SETTINGS_SAVED');
                            resolve(response);
                        }

                    } catch(e) {
                        Slee.error('ERROR', 0);
                        resolve();
                    }

                }
            );

        }

        return new Promise(execute);

    }

};