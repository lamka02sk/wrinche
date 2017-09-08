import $ from 'jquery';
import Utils from '../Modules/Utils';
import Csrf from '../Modules/Csrf';

export default {

    post(url, data, callback) {

        Utils.showLoading();
        data['csrf_token'] = Csrf.getToken();

        $.ajax({
            url    : url,
            method : 'POST',
            data   : data,
            success: function(response) {
                callback(response, 'success');
                Utils.hideLoading();
            },
            error  : function(response) {
                callback(response, 'error');
                Utils.hideLoading();
            }
        });

    },

    get(url, success, error) {

        Utils.showLoading();
        const csrf_token = Csrf.getToken();

        $.ajax({
            url: url + '&csrf_token=' + csrf_token,
            method: 'GET',
            success: function(response) {
                success(response);
                Utils.hideLoading();
            },
            error: function(response) {
                error(response);
                Utils.hideLoading();
            }
        });

    }

};