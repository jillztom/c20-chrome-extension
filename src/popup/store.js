import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: 0,
        base: 'USD'
    },
    mutations: {
        setToken: function (state, data) {
            state.token = data;
        },
        clearToken: function (state) {
            state.token = 0;
        },
        setBase: function(state, data) {
          state.base = data;
        },
        clearBase: function (state) {
          state.base = 'USD';
        }
    }
})