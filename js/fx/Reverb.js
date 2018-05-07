import Loader from './../Loader.js';

export default class Reverb {
	constructor(context, reverbs) {
		this.context = context;
		this.reverbsConfig = reverbs;
		this.loader = new Loader(this.context);
		this.reverbUrls = [];
		this.reverbs = [];
		
		Object.keys(this.reverbsConfig).forEach(reverbObj => {
			this.reverbUrls.push(this.reverbsConfig[reverbObj].url);
		});
	}
	
	loadImpulse() {
		return new Promise((resolve, reject) => {
			this.loader.loadSounds(this.reverbUrls).then((reverbSound) => {
				var numReverbs = this.reverbUrls.length;
				var decodedReverbs = 0;
				Object.keys(reverbSound).forEach(revSound => {
					this.context.decodeAudioData(reverbSound[revSound], buffer => {
						this.reverbs.push({buffer:buffer, url:revSound});
						decodedReverbs ++;
						if (decodedReverbs === numReverbs) {
							resolve(this.reverbs);
						}
					});
				});
			});
		}, (error)=>{
			console.warn("Error loading reverb!");
			reject();
		});
	}

	/**
	 * @method getActiveReverb
	 * @return {Object} The reverb marked active in the configuration passed to the soundplayer. Returns null if none is found.
	 */
	getActiveReverb() {
		let active = null;
		Object.keys(this.reverbsConfig).forEach(reverbObj => {
			if (this.reverbsConfig[reverbObj].active) {
				active = this.reverbsConfig[reverbObj];
			}
		});
		if (active) {
			for (let i = 0; i < this.reverbs.length; i++)  {
				if (this.reverbs[i].url === active.url) {
					return this.reverbs[i];
				}
			}
		}
		return null;
	}
	
	/**
	 * @method getReverbs
	 * @return {Array} All reverbs that were loaded.
	 */
	getReverbs() {
		return this.reverbs;
	}
}