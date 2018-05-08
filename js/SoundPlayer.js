import Loader from './Loader.js';
import Sound from './Sound.js';
import SoundInput from './SoundInput.js';
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
	constructor(config) {
		this.config = JSON.parse(config);
		this.soundInput = new SoundInput();
		this.sounds = {};
		this.context = this.isWebAudioSupported;
		this.contextCreatedAt = new Date();
		this.loader = new Loader(this.context);

		const masterGain = this.context.createGain();
		masterGain.value = 0.5;

		const masterAnalyser = this.context.createAnalyser();
		masterAnalyser.fftSize = 256;
		masterAnalyser.smoothingTimeConstant = 0.8;
		
		this.playerSettings = {context:this.context, masterGain: masterGain, masterAnalyser:masterAnalyser, effects:this.config.effects};
		this.isMuted = false;		
	}
	
	streamSoundInput(callback) {
		this.soundInput.getUserMedia().then((result) => {
			console.log("result:", result);
			this.sounds["stream"] = new Sound("stream", result, this.playerSettings); 
			callback(this.sounds["stream"]);
		}, (error) => {
			console.log("Error streaming user input:", error);
		});
	}
	/**
	 * Loads and decodes sounds from an array of URLs.
	 * @param {Array} sounds. An array of urls to a soundfile.
	 * @returns {Promise} A promise with all loaded objects of type Sound, 
	 *					  once resolved ALL sounds are loaded and decoded. .
	 */
	loadSounds(sounds) {	
		return new Promise((resolve, reject) => {
			this.loader.loadSounds(sounds).then((result) => {
				var numSounds = Object.keys(result).length;
				var decoded = 0;

				Object.keys(result).forEach(loadedSound => {
					this.context.decodeAudioData(result[loadedSound], buffer => {
						if (buffer) {
							var snd = new Sound(loadedSound, buffer, this.playerSettings);
							this.sounds[snd.id] = snd;
							this.sounds[snd.id].contextCreatedAt = this.contextCreatedAt;
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
			this.sounds[id].loop = loop; //this.sounds[id].sourceNode.loop = loop;
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
	 * Stops a currently playing sound.
	 * @method stopSound	
	 * @param {string} id
	 */
	stopSound(id) {
		if (this.sounds[id] && this.sounds[id].isPlaying) {
			this.sounds[id].stop();
		}
	};
	
	/**
	 * Pauses a currently playing sound.
	 * @method pauseSound	
	 * @param {string} id the ID of the sound, typically it's URL.
	 */
	pauseSound(id) {
		if (this.sounds[id] && this.sounds[id].context.state === 'running') {
			this.sounds[id].pause();
		}
	}

	/**
	 * Resumes a currently paused sound, starting at the position it was paused at.
	 * @method resumeSound	
	 * @param {string} id the ID of the sound, typically it's URL.
	 */	
	resumeSound(id) {
		if (this.sounds[id] && this.sounds[id].context.state === 'suspended') {
			this.sounds[id].resume();
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
		if (this.context) {
			this.playerSettings.masterGain.gain.value = 0;
		}
		this.isMuted = true;
	};

	/**
	 * Unmutes the sound and tells server about it.
	 * @method unmute
	 */
	unmute() {
		if (this.context) {
			this.playerSettings.masterGain.gain.value = 1;
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