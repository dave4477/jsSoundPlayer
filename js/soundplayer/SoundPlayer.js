import Loader from './Loader.js';
import Sound from './Sound.js';
import SoundInput from './SoundInput.js';
import AudioContext from './AudioContext.js';

/**
 * Main SoundPlayer class used for controlling sounds.
 * To control just 1 specific loaded, you can grab the Sound instance
 * from here and control that sound through the Sound API.
 *
 * The SoundPlayer currently supports wav, mp3 and ogg format.
 * Additional functionality is volume control for each sound, panning
 * and some equalizer / FX.
 */
export default class SoundPlayer {
	constructor() {
		this._soundInput = new SoundInput();
		this._sounds = {};
		this._context = AudioContext.getInstance().context;
		this._loader = new Loader(this._context);

		this.isMuted = false;
	}

	streamSoundInput(callback) {
		this._soundInput.getUserMedia().then((result) => {
			console.log("result:", result);
			this._sounds["stream"] = new Sound("stream", result);
			callback(this._sounds["stream"]);
		}, (error) => {
			console.log("Error streaming user input:", error);
		});
	}

	/**
	 * Loads and decodes sounds from an array of URLs.
	 * @param {Array} sounds. An array of urls to a soundfile.
	 * @returns {Promise} A promise with all loaded objects of type Sound,
	 *					  once resolved ALL sounds are loaded and decoded.
	 */
	loadSounds(sounds) {
		return new Promise((resolve, reject) => {
			this._loader.loadFiles(sounds).then((result) => {
				var numSounds = Object.keys(result).length;
				var decoded = 0;

				Object.keys(result).forEach(loadedSound => {
					this._context.decodeAudioData(result[loadedSound], buffer => {
						if (buffer) {
							var snd = new Sound(loadedSound, buffer);
							this._sounds[snd.id] = snd;
							decoded ++;
							if (decoded === numSounds) {
								resolve(this._sounds);
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
		if (this._sounds[id]) {
			this._sounds[id].loop = loop; //this._sounds[id].sourceNode.loop = loop;
			this._sounds[id].volume = volume;

			if (autoStart) {
				this._sounds[id].play();
			}
			return;
		} else {
			this.loadSounds([id]).then((result) => {
				this.playSound(id, loop, volume, autoStart);
			});
		}
	};

	/**
	 * Stops a currently playing sound.
	 * @method stopSound
	 * @param {string} id
	 */
	stopSound(id) {
		if (this._sounds[id] && this._sounds[id].isPlaying) {
			this._sounds[id].stop();
		}
	};

	/**
	 * Pauses a currently playing sound.
	 * @method pauseSound
	 * @param {string} id the ID of the sound, typically it's URL.
	 */
	pauseSound(id) {
		if (this._sounds[id] && this._sounds[id].context.state === 'running') {
			this._sounds[id].pause();
		}
	}

	/**
	 * Resumes a currently paused sound, starting at the position it was paused at.
	 * @method resumeSound
	 * @param {string} id the ID of the sound, typically it's URL.
	 */
	resumeSound(id) {
		if (this._sounds[id] && this._sounds[id].context.state === 'suspended') {
			this._sounds[id].resume();
		}
	}

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
		this.isMuted = true;
	};

	/**
	 * Unmutes the sound and tells server about it.
	 * @method unmute
	 */
	unmute() {
		this.isMuted = false;
	};

	/**
	 * Returns all sounds that were loaded.
	 * @method getAllSounds
	 * @returns {Array} All loaded sound instances.
	 */
	getAllSounds() {
		return this._sounds;
	};

	/**
	 * Returns a sound by it's id.
	 * The id is typically the filename without file extension.
	 * @param {string} id The id for the loaded sound to fetch.
	 * @return {Sound} An instance of Sound with all it's properties and methods.
	 */
	getSoundById(id) {
		return this._sounds[id];
	};

	/**
	 * Returns an array of all currently playing sounds.
	 * @method getPlayingSounds
	 * @returns {Array} All sounds instances that are currently playing.
	 */
	getPlayingSounds() {
		var playingSounds = [];
		Object.keys(this._sounds).forEach((key) =>{
			if (this._sounds[key].isPlaying) {
				playingSounds.push(this._sounds[key]);
			}
		});
		return playingSounds;
	};
}