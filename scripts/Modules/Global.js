import Closer from '../Modules/Closer';
import $ from 'jquery';

const baseURI = '?route=';
const route = document.querySelector('meta[name=route]').getAttribute('content');

export default {

    body: document.body,
    html: document.body.parentNode,
    $html: $('html'),
    nav: document.querySelector('nav'),
    anchorBox: $('div.anchor-hover'),

    baseURI: baseURI,
    route: route,
    URI: baseURI + route + '/',

    routePrefix: null,
    routeAction: null,

    translate: null,
    closer: new Closer,
    router: null,

};