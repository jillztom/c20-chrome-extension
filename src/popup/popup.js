import Vue from 'vue';
import App from './App.vue';
window.axios = require('axios');
import store from './store.js';


new Vue({
  el: '#app',
  
  store: store,
  render: h => h(App)
});
