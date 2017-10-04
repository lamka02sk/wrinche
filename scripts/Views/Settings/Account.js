import Global from "../../Modules/Global";
import Settings from "../Settings";
import Utils from "../../Modules/Utils";
import $ from 'jquery';
import Router from "../../Modules/Router";
import Csrf from "../../Modules/Csrf";
import Slee from "../../Modules/Slee";

let account = {

    initialize() {

        // Translate current route
        Global.translate.addTranslation('admin_settings/account');

        // Initialize Selector
        this.initializeSelector();

        // Register events
        this.createEvents();

    },

    initializeSelector(destroy = false) {

        if(destroy)
            this.selector.destroy();

        this.selector = new Global.Selector({
            element: '.content-subcontent select',
            selected: this.changeSettings
        });

    },

    changeSettings(instance, option) {

        const reference = instance.dataset.reference;

        let data = {};
        data[reference] = option;

        Settings.postSettings(data);

    },

    createEvents() {

        // Profile box events
        this.createProfileBoxEvents();

    },

    createProfileBoxEvents() {

        let profileBox = document.querySelector('.profile-box');
        let pictureBox = profileBox.querySelector('.profile-picture-wrapper');

        // Change profile picture
        this.changeProfilePicture(pictureBox);

    },

    changeProfilePicture(element) {

        Utils.registerEvent([
            'click',
            element.querySelector('.profile-picture-edit'),
            () => {

                let input = document.createElement('input');
                input.type = 'file';
                input.accept = "image/*";

                Utils.registerEvent([
                    'input',
                    input,
                    () => {

                        let file = new FormData();
                        file.append('picture', input.files[0]);

                        $.ajax({
                            method: "POST",
                            url: Router.createLink('settings/account&csrf_token=' + Csrf.getToken()),
                            data: file,
                            cache: false,
                            processData: false,
                            contentType: false,
                            success: response => {

                                try {

                                    response = JSON.parse(response);

                                    if(response.picture) {
                                        element.querySelector('img').src = response.picture;
                                        Slee.success('SUCCESS', 'SETTINGS_SAVED');
                                    } else
                                        Slee.error('ERROR', response.code);

                                } catch(e) {
                                    Slee.error('ERROR', 0);
                                }

                            }
                        });

                    }
                ]);

                input.click();

            }
        ]);

    }

};

module.exports = account;