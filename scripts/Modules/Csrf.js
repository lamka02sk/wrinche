import Ajax from '../Modules/Ajax';
import Global from '../Modules/Global';

export default {

    _tokenElement: document.querySelector('meta[name=csrf_token]'),
    _csrfToken: undefined,

    constructor() {

        this._csrfToken = this._tokenElement.getAttribute('content');
        this.register();

    },

    register() {

        setInterval(() => {

            Ajax.get(
                Global.baseURI + 'api/system.auth.refresh.token',
                (response) => {
                    this._csrfToken = response.data;
                    this._tokenElement.setAttribute('content', this._csrfToken);
                },
                () => {
                    confirmAction(
                        // TODO: translate.locale.response['ACTION_CONFIRM_RELOAD_PAGE'],
                        '',
                        () => window.location.reload()
                    );
                }
            );

        }, 1200000);

    },

    getToken() {

        return this._csrfToken;

    }

};