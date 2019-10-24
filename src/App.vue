<template>
	<div id="app">
		<div class="logo">
			<sia-central />
		</div>
		<div class="content">
			<transition name="fade" mode="out-in" appear>
				<div class="modal-panel" v-if="step === 0" key="start">
					<h2>Sia Cold Storage Wallet</h2>
					<p>This tool will create a new unique wallet seed and addresses to use for cold
						storage of Siacoins. For additional security, once the app has fully loaded
						you can disconnect from the internet. This will ensure that your seed cannot
						leave your computer.</p>
					<p>This is a proof-of-concept development for Sia in js via WebAssembly. Please use the official cold storage
						app. <a target="_blank" href="https://gitlab.com/NebulousLabs/sia-coldstorage">gitlab.com/NebulousLabs/sia-coldstorage</a></p>
					<div class="buttons">
						<button class="btn btn-inline btn-success" @click="step = 1" :disabled="!loaded">Next</button>
					</div>
				</div>
				<div class="modal-panel" v-else-if="step === 1" key="disconnect">
					<h2>Disconnect your internet</h2>
					<p>The app has fully loaded you can now disconnect your internet for additional
						security. This ensures that your seed and addresses cannot leave your
						computer.</p>
					<p>This is a proof-of-concept development for Sia in js via WebAssembly. Please use the official cold storage
						app. <a target="_blank" href="https://gitlab.com/NebulousLabs/sia-coldstorage">gitlab.com/NebulousLabs/sia-coldstorage</a></p>
					<div class="buttons">
						<button class="btn btn-inline btn-success" @click="onGenerateSeed" :disabled="!loaded || generating">Generate Seed</button>
					</div>
				</div>
				<div class="modal-panel address-panel" v-else-if="step === 2" :key="seed">
					<div class="modal-content">
						<p>A unique seed and {{ this.addresses.length }} addresses have been generated for you.</p>
						<h4>Seed</h4>
						<div class="control">
							<input type="text" :value="seed" readonly />
						</div>
						<h4>Addresses</h4>
						<div class="control" v-for="address in addresses" :key="address">
							<input type="text" :value="address" readonly />
						</div>
					</div>
					<div class="buttons">
						<button class="btn btn-inline btn-success" @click="onGenerateSeed" :disabled="!loaded">Generate Another</button>
					</div>
				</div>
			</transition>
		</div>
		<div>
			<p>This project is available on GitHub: <a target="_blank" href="https://github.com/siacentral/cold-storage">Frontend</a> | <a target="_blank" href="https://github.com/siacentral/sia-lite-wasm">Sia WebAssembly</a></p>
		</div>
	</div>
</template>

<script>
/* global sia */
import { mapState } from 'vuex';
import SiaCentral from '@/assets/siacentral.svg';

export default {
	components: {
		SiaCentral
	},
	data() {
		return {
			generating: false,
			step: 0,
			seed: '',
			addresses: []
		};
	},
	computed: {
		...mapState(['loaded'])
	},
	methods: {
		onGenerateSeed() {
			try {
				this.seed = sia.generateSeed();
				this.addresses = sia.generateAddresses(this.seed, 0, 10);
			} catch (ex) {
				console.error(ex.message);
			} finally {
				this.step = 2;
			}
		}
	},
	watch: {
		loaded() {

		}
	}
};
</script>

<style lang="stylus">
@require "./styles/global";

#app {
	display: grid;
	grid-template-rows: auto minmax(0, 1fr) auto;
	grid-gap: 15px;
	width: 100%;
	height: 100%;
	padding: 15px;
	align-items: center;
	justify-items: center;
}

.content {
	display: flex;
	width: 100%;
	height: 100%;
	align-content: center;
	justify-content: center;
}

.modal-panel {
	background: bg-dark-accent;
	width: 100%;
	max-width: 600px;
	max-height: 100%;
	margin: auto;
	padding: 15px;
	border-radius: 8px;
	box-shadow: 0 2px 11px rgba(0, 0, 0, 0.2);
	overflow: hidden;
}

.address-panel {
	display: grid;
	grid-template-rows: minmax(0, 1fr) auto;
	padding: 0 0 15px;
	grid-gap: 15px;

	.modal-content {
		height: 100%;
		overflow: hidden auto;
		padding: 15px 15px 0;
	}
}

.logo {
	svg {
		display: block;
		max-width: 100px;
		margin: auto;
	}
}

.buttons {
	text-align: center;
}
</style>
