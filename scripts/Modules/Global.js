import Closer from '../Modules/Closer';

export default {

    body: document.body,
    html: this.body.parentNode,
    anchorBox: $('div.anchor-hover'),

    baseURI: '?route=',
    route: document.querySelector('meta[name=route]').getAttribute('content'),
    URI: this.baseURI + this.route + '/',

    routePrefix: null,
    routeAction: null,

    translate: null,
    closer: new Closer,

};