import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		loaded: false
	},
	mutations: {
		setLoaded(state, loaded) {
			state.loaded = loaded;
		}
	},
	actions: {
		setLoaded(context, loaded) {
			context.commit('setLoaded', loaded);
		}
	}
});

export default store;