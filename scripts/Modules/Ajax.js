import $ from 'jquery';
import Utils from '../Modules/Utils';
import Csrf from '../Modules/Csrf';
import Router from "./Router";

export default {

    post(url, data, callback, async = true) {

        Utils.showLoading();

        if(!data['csrf_token'])
            data['csrf_token'] = Csrf.getToken();

        $.ajax({
            url         : url,
            method      : 'POST',
            data        : data,
            async       : async,
            success: response => {
                callback(response, 'success');
                Utils.hideLoading();
            },
            error  : response => {
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
            success: response => {
                success(response);
                Utils.hideLoading();
            },
            error: response => {
                error(response);
                Utils.hideLoading();
            }
        });

    },

    getFile(url, translate = true) {

        Utils.showLoading(translate);

        return $.ajax({
            type: 'GET',
            url: url,
            global: false,
            async: false,
            cache: true,
            success: data => {
                Utils.hideLoading();
                return data;
            },
            error: () => Utils.hideLoading()
        }).responseText;

    },

    getJSON(url, translate = true) {

        Utils.showLoading(translate);

        return JSON.parse(
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                global: false,
                async: false,
                cache: true,
                success: data => {
                    Utils.hideLoading();
                    return data;
                },
                error: () => Utils.hideLoading()
            }).responseText);

    },

    api(endpoint, method, data = {}) {

        if(method.toLowerCase() === 'post')
            return this.apiPost(endpoint, data);
        else
            return this.apiGet(endpoint);

    },

    apiGet(endpoint) {

        const url = Router.createLink('api/' + endpoint);
        return new Promise(resolve => {
            this.get(
                url,
                response => {
                    resolve(response, 'success');
                },
                error => {
                    resolve(error, 'error');
                }
            )
        });

    },

    apiPost(endpoint, data) {

        data = { api: data };
        const url = Router.createLink('api/' + endpoint);

        return new Promise(resolve => {
            this.post(
                url,
                data,
                (response, status) => {
                    resolve(response, status);
                }
            )
        });

    }

};