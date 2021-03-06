<template>
	<div id="app">
		<div class="content">
			<transition name="fade" mode="out-in" appear>
				<div class="modal-panel" v-if="step === 0" key="start">
					<h2>Sia Cold Storage Wallet</h2>
					<p>This tool will create a new unique wallet seed and addresses to use for cold
						storage of Siacoins. For additional security, once the app has fully loaded
						you can disconnect from the internet. This will ensure that your seed cannot
						leave your computer.</p>
					<p>This is a proof-of-concept development for interacting with Sia in js through
						WebAssembly.</p>
					<div class="buttons">
						<transition name="fade" mode="out-in" appear>
							<button class="btn btn-inline btn-success" @click="step = 1" :disabled="!loaded">Next</button>
						</transition>
					</div>
				</div>
				<div class="modal-panel" v-else-if="step === 1" key="disconnect">
					<h2>Disconnect your internet</h2>
					<p>The app has fully loaded you can now disconnect your internet for additional
						security. This ensures that your seed and addresses cannot leave your
						computer.</p>
					<p>This is a proof-of-concept development for interacting with Sia in js through
						WebAssembly.</p>
					<div class="buttons">
						<button class="btn btn-inline btn-success" @click="onGenerateSeed" :disabled="!loaded || generating">Generate Seed</button>
					</div>
				</div>
				<div class="modal-panel address-panel" v-else-if="step === 2" :key="seed">
					<div class="modal-content">
						<p>A unique seed and {{ this.addresses.length }} addresses have been generated for you.</p>
						<h4>Seed</h4>
						<p class="seed">{{seed}}</p>
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
		<logos />
		<div>
			<p>This demo is available on GitHub: <a target="_blank" href="https://github.com/siacentral/cold-storage">Frontend</a> | <a target="_blank" href="https://github.com/siacentral/sia-lite-wasm">Sia WebAssembly</a></p>
		</div>
	</div>
</template>

<script>
import Logos from '@/components/Logos';
import { waitForLoad, generateSeed, generateAddresses } from '@/sia.js';

export default {
	components: {
		Logos
	},
	data() {
		return {
			generating: false,
			step: 0,
			seed: '',
			loaded: false,
			addresses: []
		};
	},
	async mounted() {
		waitForLoad();
		this.loaded = true;
	},
	methods: {
		async onGenerateSeed() {
			try {
				const seed = await generateSeed(),
					addresses = await generateAddresses(seed, 0, 10);

				this.seed = seed;
				this.addresses = addresses.map(a => a.address);
			} catch (ex) {
				console.error(ex.message);
			} finally {
				this.step = 2;
			}
		}
	}
};
</script>

<style lang="stylus">
@require "./styles/global";

#app {
	display: grid;
	grid-template-rows: minmax(0, 1fr) repeat(2, auto);
	grid-gap: 15px;
	width: 100%;
	height: 100%;
	padding: 15px;
	align-items: center;
	justify-items: center;
}

.seed {
	font-size: 1.2rem;
    border: 1px solid dark-gray;
    padding: 8px;
    border-radius: 4px;
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
		overflow-x: hidden;
		overflow-y: auto;
		padding: 15px 15px 0;
	}
}

.buttons {
	text-align: center;
}
</style>
