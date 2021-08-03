import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import rate from 'vue-rate'
import 'vue-rate/dist/vue-rate.css'
import VueSimpleAlert from "vue-simple-alert"
import Parse from 'parse'
import mapboxgl from "mapbox-gl";
import VueSanitize from "vue-sanitize";
import VueHorizontal from "vue-horizontal";
import VueClipboard from 'vue-clipboard2';

const defaultSanitizeOptions = {
  allowedTags: [
    "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
    "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
    "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
    "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
    "em", "i", "img", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
    "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
    "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr"
  ],
  disallowedTagsMode: 'discard',
  allowedAttributes: {
    a: [ 'href', 'name', 'target' ],
    // We don't currently allow img itself by default, but this
    // would make sense if we did. You could add srcset here,
    // and if you do the URL is checked for safety
    img: [ 'src', 'alt' ]
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
  // URL schemes we permit
  allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'tel' ],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
  allowProtocolRelative: true,
  enforceHtmlBoundary: false
}

Vue.config.productionTip = false
Vue.use(rate);
Vue.use(VueSimpleAlert);
Vue.use(Parse);
Vue.use(mapboxgl);
Vue.use(VueSanitize, defaultSanitizeOptions);
Vue.use(VueHorizontal);
Vue.use(VueClipboard);

Parse.initialize(process.env.VUE_APP_PARSE_APP_ID, process.env.VUE_APP_PARSE_JS_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
