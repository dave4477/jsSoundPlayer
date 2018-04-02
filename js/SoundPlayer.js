import Loader from './Loader.js';
import Sound from './Sound.js';

export default class SoundPlayer {
	constructor() {
		this.sounds = {};
		this.context = this.isWebAudioSupported;
		this.loader = new Loader(this.context);
		this.masterGain = this.context.createGain();
		this.isMuted = false;
	}
	
	/**
	 * Loads sounds from an array of urls.
	 */
	loadSounds(sounds) {
		
		return new Promise((resolve, reject) => {		
			this.loader.loadSounds(sounds).then((result) => {
				let numSounds = Object.keys(result).length;
				let decoded = 0;
				Object.keys(result).forEach(loadedSound => {
					this.context.decodeAudioData(result[loadedSound], buffer => {
						if (buffer) {
							let snd = new Sound(loadedSound, buffer, this.context, this.masterGain);
							this.sounds[snd.id] = snd;
							decoded ++;
							if (decoded === numSounds) {
								resolve(this.sounds);
							}
						}
					});
				});	
			}, (error) => {
				console.warn("There was an error loading one or more sounds:", error);
			});
		});

	}


	/**
	 * Returns the context if webaudio is supported.
	 */
	get isWebAudioSupported() {
		try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			this.context = new AudioContext();

		} catch(e) {
			this.context = null;
		}
		return this.context;
	}
	
	
	

	/**
	 * Will start playing the sound requested by id.
	 * If the sound was already loaded, we play it from cache if autoStart is true,
	 * otherwise we will load the sound first and then play it if autoStart is true.
	 *
	 * @function playSound.
	 * @param {string} id The id or url from where to load the sound.
	 * @param {boolean} loop Whether to loop the playback. Default is false.
	 * @param {number} volume The amount of damage we want to cause to ears. 0 for no sound, 1 for normal volume. Default is 1.
	 * @param {boolean} autoStart Automatically starts playing when <code>true</code>. Default is true.
	 */
	playSound(id, loop, volume, autoStart) {
		// Set default values.
		var loop = loop || false;
		var volume = (volume !== null && volume !== undefined) ? volume : 1;
		var autoStart = autoStart || true;

		if (this.sounds[id]) {
			this.sounds[id].loop = this.sounds[id].sourceNode.loop = loop;
			this.sounds[id].volume = volume;

			if (autoStart) {
				this.sounds[id].play();
			}
			return;
		}
		// The sound was not loaded before, so we throw a warning.
		console.warn("[AudioService] The sound " +id+ " was not loaded.");
	};

	/**
	 * Callback from the componentService. This will decode the loaded buffer.
	 * @function onLoaded
	 * @param {string} id The id of the sound.
	 * @param {ArrayBuffer} response The loaded arraybuffer.
	 * @param {AudioElement} htmlAudio This is only used for browsers that do not support WebAudio.
	 */
	onLoaded(id, response, htmlAudio) {
		var snd;
		if (!htmlAudio) {
			_context.decodeAudioData(response, function (buffer) {
				if (buffer) {
					snd = new Sound(id, buffer, _context, _masterGain);
					this.sounds[snd.id] = snd;
				}
			});
		} else {
			htmlAudio.loop = false;
			snd = new Sound(id, htmlAudio, _context, _masterGain);
			this.sounds[snd.id] = snd;
		}
	};

	/**
	 * @module AudioService
	 * @function isMuted
	 * @returns {boolean} Returns true when the sound is muted, otherwise true.
	 */
	isMuted() {
		return _isMuted;
	};

	/**
	 * Stops a loaded / playing sound.
	 * @function stopSound
	 * @param {string} id
	 */
	stopSound(id) {
		if (this.sounds[id] && this.sounds[id].isPlaying) {
			this.sounds[id].stop();
		}
	};

	/**
	 * toggle sound to opposite of current state.
	 * @function toggleSound
	 * @method toggleSound
	 */
	toggleSound() {
		if (_isMuted) {
			this.unmute();
		} else {
			this.mute();
		}
	};

	/**
	 * Mutes the sound and tells server about it.
	 * @function mute
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
	 * @function unmute
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
	 * @function getAllSounds
	 * @returns {Array} All loaded sound instances.
	 */
	getAllSounds() {
		return this.sounds;
	};

	/**
	 * Returns a sound by it's id.
	 * The id is typically the filename without file extention.
	 * @param {string} id The id for the loaded sound to fetch.
	 * @return {Sound} An instance of Sound with all it's properties and methods.
	 */
	getSoundById(id) {
		return this.sounds[id];
	};

	/**
	 * Returns an array of all currently playing sounds.
	 * @function getPlayingSounds
	 * @returns {Array} All sounds instances that are currently playing.
	 */
	getPlayingSounds() {
		var playingSounds = [];
		Object.keys(this.sounds).forEach(function(key){
			if (this.sounds[key].isPlaying) {
				playingSounds.push(this.sounds[key]);
			}
		});
		return playingSounds;
	};

}