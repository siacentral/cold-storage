/* global Go */

import Vue from 'vue';
import App from './App.vue';
import store from '@/store';

Vue.config.productionTip = false;

if (WebAssembly) {
	// WebAssembly.instantiateStreaming is not currently available in Safari
	if (WebAssembly && !WebAssembly.instantiateStreaming) { // polyfill
		WebAssembly.instantiateStreaming = async(resp, importObject) => {
			const source = await (await resp).arrayBuffer();
			return WebAssembly.instantiate(source, importObject);
		};
	}

	const go = new Go();

	WebAssembly.instantiateStreaming(fetch('sia/sia.wasm'), go.importObject).then((result) => {
		go.run(result.instance);

		store.dispatch('setLoaded', true);
	});
} else
	console.log('WebAssembly is not supported in your browser');

new Vue({
	render: h => h(App),
	store
}).$mount('#app');