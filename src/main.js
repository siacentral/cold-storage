/* global Go */

import Vue from 'vue';
import App from './App.vue';
import store from '@/store';

Vue.config.productionTip = false;

async function loadWASM() {
	try {
		if (!WebAssembly || !WebAssembly.instantiateStreaming)
			throw new Error('WebAssembly is not supported, please update your browser');

		const go = new Go(),
			result = await WebAssembly.instantiateStreaming(fetch('sia/sia.wasm'), go.importObject);

		go.run(result.instance);
		store.dispatch('setLoaded', true);
	} catch (ex) {
		store.dispatch('setError', ex.message);
	}
}

loadWASM();

new Vue({
	render: h => h(App),
	store
}).$mount('#app');