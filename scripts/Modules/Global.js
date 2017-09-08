export default {

    body: document.body,
    html: this.body.parentNode,

    baseURI: '?route=',
    route: document.querySelector('meta[name=route]').getAttribute('content'),
    URI: this.baseURI + this.route + '/'

};