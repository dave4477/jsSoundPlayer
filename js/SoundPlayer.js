import Loader from './Loader.js';
import Sound from './Sound.js';

/**
 * Main SoundPlayer class used for controlling sounds. 
 * The SoundPlayer currently supports wav, mp3 and ogg format.
 * Additional functionality is volume control for each sound, panning
 * and some equalizer / FX.
 */
export default class SoundPlayer {
	constructor() {
		this.sounds = {};
		this.context = this.isWebAudioSupported;
		this.loader = new Loader(this.context);
		this.masterGain = this.context.createGain();
		this.isMuted = false;
	}
	
	/**
	 * Loads sounds from an array of URLs.
	 * @param {Array} sounds. An array of urls to a soundfile.
	 * @returns A promise which is resolved if all sounds are loaded, otherwise rejected.
	 */
	loadSounds(sounds) {	
		return new Promise((resolve, reject) => {		
			this.loader.loadSounds(sounds).then((result) => {
				var numSounds = Object.keys(result).length;
				var decoded = 0;
				Object.keys(result).forEach(loadedSound => {
					this.context.decodeAudioData(result[loadedSound], buffer => {
						if (buffer) {
							var snd = new Sound(loadedSound, buffer, this.context, this.masterGain);
							this.sounds[snd.id] = snd;
							decoded ++;
							if (decoded === numSounds) {
								resolve(this.sounds);
							}
						}
					}, (error) => {
						// Give a warning, but still continue to decode the rest.
						console.warn("Error decoding audio file " +loadedSound+ ". Is this a valid audio file?");
						decoded ++;
					});
				});	
			}, (error) => {
				console.warn("There was an error loading one or more sounds:", error);
			});
		});
	}

	/**
	 * Returns the context if webAudio is supported.
	 */
	get isWebAudioSupported() {
		try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			this.context = new AudioContext();

		} catch(e) {
			console.warn("WebAudio is not supported");
			this.context = null;
		}
		return this.context;
	}
	
	/**
	 * Will start playing the sound requested by id.
	 * If the sound was already loaded, we play it from cache if autoStart is true,
	 * otherwise we will load the sound first and then play it if autoStart is true.
	 *
	 * @method playSound.
	 * @param {string} id The id or url from where to load the sound.
	 * @param {boolean} loop Whether to loop the playback. Default is false.
	 * @param {number} volume The amount of damage we want to cause to ears. 0 for no sound, 1 for normal volume. Default is 1.
	 * @param {boolean} autoStart Automatically starts playing when <code>true</code>. Default is true.
	 */
	playSound(id, loop = false, volume = 1, autoStart = true) {
		if (this.sounds[id]) {
			this.sounds[id].loop = this.sounds[id].sourceNode.loop = loop;
			this.sounds[id].volume = volume;
			this.sounds[id].autoStart = autoStart;

			if (autoStart) {
				this.sounds[id].play();
			}
			return;
		} else {
			this.loadSounds([id]).then((result) => {
				this.playSound(id, loop, volume, autoStart);
			});
		}
	};

	/**
	 * Stops a loaded / playing sound.
	 * @method stopSound
	 * @param {string} id
	 */
	stopSound(id) {
		if (this.sounds[id] && this.sounds[id].isPlaying) {
			this.sounds[id].stop();
		}
	};

	/**
	 * toggle sound to opposite of current state.
	 * @method toggleSound
	 */
	toggleSound() {
		if (this.isMuted) {
			this.unmute();
		} else {
			this.mute();
		}
	};

	/**
	 * Mutes the sound and tells server about it.
	 * @method mute
	 */
	mute() {
		if (this.context) {
			this.masterGain.gain.value = 0;
		} else {
			// IE11 fallback.
			Object.keys(this.sounds).forEach(function(key){
				this.sounds[key].sourceNode.pause();
			});
		}
		this.isMuted = true;
	};

	/**
	 * Unmutes the sound and tells server about it.
	 * @method unmute
	 */
	unmute() {
		if (this.context) {
			this.masterGain.gain.value = 1;
		} else {
			// IE11 fallback.
			Object.keys(this.sounds).forEach(function(key){
				this.sounds[key].sourceNode.play();
			});
		}
		this.isMuted = false;
	};

	/**
	 * Returns all sounds that were loaded.
	 * @method getAllSounds
	 * @returns {Array} All loaded sound instances.
	 */
	getAllSounds() {
		return this.sounds;
	};

	/**
	 * Returns a sound by it's id.
	 * The id is typically the filename without file extension.
	 * @param {string} id The id for the loaded sound to fetch.
	 * @return {Sound} An instance of Sound with all it's properties and methods.
	 */
	getSoundById(id) {
		return this.sounds[id];
	};

	/**
	 * Returns an array of all currently playing sounds.
	 * @method getPlayingSounds
	 * @returns {Array} All sounds instances that are currently playing.
	 */
	getPlayingSounds() {
		var playingSounds = [];
		Object.keys(this.sounds).forEach((key) =>{
			if (this.sounds[key].isPlaying) {
				playingSounds.push(this.sounds[key]);
			}
		});
		return playingSounds;
	};
}