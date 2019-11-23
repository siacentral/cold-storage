import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		loaded: false,
		error: null
	},
	mutations: {
		setLoaded(state, loaded) {
			state.loaded = loaded;
		},
		setError(state, error) {
			state.error = error;
		}
	},
	actions: {
		setLoaded(context, loaded) {
			context.commit('setLoaded', loaded);
		},
		setError(context, error) {
			context.commit('setError', error);
		}
	}
});

export default store;