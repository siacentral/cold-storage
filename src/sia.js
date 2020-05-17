/* global Go, sia */

async function load() {
	let siaModule, result, go;

	if (WebAssembly.compileStreaming)
		siaModule = await WebAssembly.compileStreaming(fetch(`/sia/sia.wasm`));
	else {
		const resp = await fetch('/sia/sia.wasm'),
			buf = await resp.arrayBuffer();

		siaModule = await WebAssembly.compile(buf);
	}

	go = new Go();
	result = await WebAssembly.instantiate(siaModule, go.importObject);

	go.run(result);
}

const loaded = load();

export async function waitForLoad() {
	await loaded;
}

export function generateSeed() {
	return loaded.then(() => new Promise((resolve, reject) => {
		sia.generateSeed('sia', (err, seed) => {
			if (err)
				return reject(err);

			resolve(seed);
		});
	}));
}

export function generateAddresses(seed, i, n) {
	return loaded.then(() => new Promise((resolve, reject) => {
		sia.generateAddresses(seed, i, n, (err, addresses) => {
			if (err)
				return reject(err);

			resolve(addresses);
		});
	}));
}