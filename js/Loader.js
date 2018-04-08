/**
 * The Loader class is responsible for loading audio files.
 * Once all audio files are loaded we fulfill the promise
 * which is returned to the soundPlayer.
 */
export default class Loader {
	constructor(context) {
		this.isWebAudioSupported = context;
		this.numSounds = 0;
		this.sounds = {};
	}

	/**
	 * Loads a bunch of sounds.
	 * @param {string} url The url for the sound to load.
	 */
	loadSounds(sounds) {
		return new Promise((resolve, reject) => {
			this.numSounds = sounds.length;
			sounds.forEach(url => {
				this.loadSound(url, resolve, reject);
			});	
		});
	}

	loadSound(url, resolve, reject) {	
		/*
		let audio = new Audio();
		audio.src = url;
		audio.controls = true;
		audio.onload = (e) => {
			this.soundLoaded(url, request, resolve);
		}
		audio.onerror = (e) => {
			this.throwLoadError(url);
			this.soundLoaded(url, request, resolve);
		}
		
		document.body.appendChild(audio);
		*/
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = "arraybuffer";
		request.onreadystatechange = ((request) => {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status !== Loader.HTTP_STATUS_OK) {
					this.throwLoadError(url);
				}
				this.soundLoaded(url, request, resolve);
			}
		}).bind(undefined, request);
		request.send();
	}
	
	soundLoaded(url, request, resolve) {		
		this.sounds[url] = request.response;
		if (Object.keys(this.sounds).length === this.numSounds) {
			resolve(this.sounds);
			this.sounds = {};
		}
	}
	
	throwLoadError(url) {
		console.warn("Could not load sound with url:", url);
		this.sounds[url] = null;
	}
}
Loader.HTTP_STATUS_OK = 200;