import Utils from "../Modules/Utils";
import Main from '../Views/Main';

export default {

    LOCALES: ['admin_dashboard'],

    initialize() {

        // Render content
        Main.createView(this.LOCALES);

    }

};