import Global from "./Global";

export default {

    Slee: null,

    prepare() {

        this.Slee = require('slee');

        // Setup Slee
        this.Slee.prepare({
            animation: 'ease'
        });

    },

    error(title, description) {

        title = Global.translate.locale['response'][title];
        description = Global.translate.locale['response'][description];

        this.Slee.error({
            title: title,
            description: description,
            picture: 'assets/icons/close_white.svg'
        });

    },

    success(title, description) {

        title = Global.translate.locale['response'][title];
        description = Global.translate.locale['response'][description];

        this.Slee.success({
            title: title,
            description: description,
            picture: 'assets/icons/success_black.svg'
        });

    },

    info() {



    }

};