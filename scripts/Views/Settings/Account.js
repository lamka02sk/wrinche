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

        // Change username and e-mail
        this.changeProfileBoxValues(profileBox);

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
                                        document.querySelector('.header-account .write-icon_circle')
                                            .style.backgroundImage = 'url(' + response.picture + ')';
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

    },

    blurEvent() {

        let input = document.querySelector('.profile-box [contenteditable]');

        input.removeAttribute('contenteditable');
        input.parentNode.querySelector('.edit-value').classList.remove('hide');

        // Save data
        const value = input.innerText.trim();
        let data = {};

        data[input.dataset.edit] = value;
        Settings.postSettings(data).then(results => {

            if(!results)
                input.innerText = input.dataset.reset;

        });

    },

    closeProfileBoxEditor(target) {

        target.blur();

        let input = target;
        input.removeEventListener('blur', this.blurEvent);

    },

    changeProfileBoxValues(profileBox) {

        Utils.registerEvents([
            [
                'click',
                profileBox,
                event => {

                    let target = event.target;

                    // Edit
                    if(target.matches('.edit-value')) {

                        let input = target.parentNode.querySelector('[data-edit]');

                        target.classList.add('hide');
                        input.setAttribute('contenteditable', '');
                        input.focus();

                        // Register blur event
                        input.addEventListener('blur', this.blurEvent);

                    }

                }
            ],
            [
                'keyup keypress',
                profileBox,
                event => {

                    let target = event.target;

                    // Edit
                    if(target.matches('[data-edit]')) {

                        if(event.type === 'keypress' && event.keyCode === 13) {
                            event.preventDefault();
                            return false;
                        }

                        if(event.type === 'keyup' && event.keyCode === 13)
                            this.closeProfileBoxEditor(target);

                    }

                }
            ]
        ]);

    }

};

module.exports = account;