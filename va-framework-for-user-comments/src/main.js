// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import Vuex from 'vuex';

Vue.use(Vuex);
Vue.use(Vuetify)

Vue.config.productionTip = false

const store = new Vuex.Store({
    // EVENT HANDLER
    state: {
        text : 'Event Bus',

        selectionViewChanged : true,
        contendViewChanged : true,
        sentimentViewChanged : true,
        indicatorViewChanged : true,
        resultViewChanged : true,
    }
});

//
// VUE MAIN
//
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  store
})


