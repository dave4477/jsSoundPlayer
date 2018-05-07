import StringUtils from './utils/StringUtils.js';
import Reverb from './fx/Reverb.js';
import Distortion from './fx/Distortion.js';

export default class Sound {

    /**
     * Sound object, initialised for every individual sound. Should only be used through the _public object.
     *
     * @function Sound
     * @param {string} url The url for the sound.
     * @param {Boolean} loop Whether the sound should loop.
     * @param {Number} volume The playback volume of the sound (do we want to hurt peoples ears).
     * @param {Object} buffer The audioBuffer. This will be null for HTML5Audio fallback.
     * @param {Object} playerSettings Settings, typically passed from the SoundPlayer: 
	 *						@property {Object} context The AudioContext.
	 *						@property {Object} masterGain The masterGain.
	 *						@property {Object} masterAnalyser The analyser for all sounds.
	 *						@property {Object} effects. Optional. The effects configuration if passed to the player.
     * @constructor
     */
    constructor (url, buffer, playerSettings) { 
		this.context = playerSettings.context;
		this.contextCreatedAt = new Date();
        this.masterGain = playerSettings.masterGain;
		this.masterAnalyser = playerSettings.masterAnalyser;
        this.url = url;
		this.id = url;	
		this.effects = playerSettings.effects;
		this.timeOffset = 0;
		this.contextCreatedAt = new Date();
		this.isStream = url === "stream";
		
		if (this.effects && this.effects["reverbs"]) {
			this.loadReverbs();		
		}
		this.distortionShaper = new Distortion();
		
		this.createNodes(buffer);
		
		this.loop = null;
        this.volume = null;
        this.isPlaying = this.isStream; 
    }

	async loadReverbs() {
		this.reverbClass = new Reverb(this.context, this.effects["reverbs"]);
		this.reverbImpulses = await this.reverbClass.loadImpulse(); 
		let active = this.reverbClass.getActiveReverb();
		this.reverb.buffer = this.reverbClass.getActiveReverb().buffer;
	}
	
	setReverbType(index) {
		this.reverb.buffer = this.reverbClass.getReverbs()[index].buffer;
	}
	
	createNodes(buffer) {
		if (!this.isStream) {
			this.sourceNode = this.context.createBufferSource();
			this.sourceNode.buffer = buffer;
		} else {
			this.sourceNode = this.context.createMediaStreamSource(buffer);
		}
		
		this.gainNode = this.context.createGain();

		this.reverbGain = this.context.createGain();
		this.reverb = this.context.createConvolver();
		
		this.distortion = this.context.createWaveShaper();
		
		this.panner = this.context.createPanner();
		this.panner.pannerModel = 'equalpower';
		
		this.bandFilters = [];
		this.bandFilters.push(this.createBiquadFilterNode("lowshelf", 60)); 	
		this.bandFilters.push(this.createBiquadFilterNode("peaking", 170));
		this.bandFilters.push(this.createBiquadFilterNode("peaking", 310));
		this.bandFilters.push(this.createBiquadFilterNode("peaking", 600));
		this.bandFilters.push(this.createBiquadFilterNode("peaking", 1000));
		this.bandFilters.push(this.createBiquadFilterNode("peaking", 3000));
		this.bandFilters.push(this.createBiquadFilterNode("peaking", 6000));
		this.bandFilters.push(this.createBiquadFilterNode("peaking", 12000));
		this.bandFilters.push(this.createBiquadFilterNode("peaking", 14000));
		this.bandFilters.push(this.createBiquadFilterNode("peaking", 16000));
				
		this.analyser = this.context.createAnalyser();
		this.analyser.fftSize = 256;
		this.analyser.smoothingTimeConstant = 0.8;
		
		this.masterCompression = this.context.createDynamicsCompressor();
		
		this.scriptNode = this.context.createScriptProcessor(2048, 1, 1);
		this.scriptNode.onaudioprocess = () => {
			// get the average for the first channel
			var array = new Uint8Array(this.analyser.frequencyBinCount);
			this.analyser.getByteFrequencyData(array);
			if (!this.isStream) {
				if (this.getCurrentTime() >= this.sourceNode.buffer.duration && this.loop) {
					this.setPositionInSeconds(0);
				}
			}

		}
		this.bufferLength = this.analyser.frequencyBinCount;
		this.dataArray = new Float32Array(this.bufferLength);
		this.connectNodes();
	}
	
	/**
	 * Used for equalizer effects.
	 */
	createBiquadFilterNode(type, frequency) {
		let biquadFilter = this.context.createBiquadFilter();
		biquadFilter.type = type;
		biquadFilter.frequency.setValueAtTime(frequency, 0);
		biquadFilter.Q.setValueAtTime(1, 0);
		biquadFilter.gain.setValueAtTime(0, 0);
		return biquadFilter;
	}
	
    /**
	 * Connect all mixer nodes to the sourceNode.
	 */ 
    connectNodes() {
		this.scriptNode.connect(this.context.destination);
        this.sourceNode.connect(this.gainNode);		
		
		
		this.gainNode.connect(this.reverbGain);
		this.reverbGain.connect(this.reverb);
		this.reverbGain.gain.setValueAtTime(0,0);

		this.gainNode.connect(this.distortion);
		
		this.equalizerNodes = this.connectFilters(this.gainNode);
		this.equalizerNodes.connect(this.panner);
		this.panner.connect(this.analyser);
		this.analyser.connect(this.masterGain);
		this.masterGain.connect(this.masterCompression);
		this.reverb.connect(this.masterCompression);
		this.distortion.connect(this.masterCompression);
        this.masterCompression.connect(this.context.destination);	
    }
	
	connectFilters(node) {
		return this.bandFilters.reduce(this.filterConnecter, node);
	}
		
	filterConnecter(prevNode, currentNode) {
		return prevNode.connect(currentNode);
	}
	
    /**
     * Re-Plays the sound for webAudio by copying the old buffer into the new one,
     * as a bufferSource can only be used once. Connect to gain nodes for volume,
     * and plays the sound. Should only be used through the the _public object.
     *
     * @module Sound
     * @function play
     */
    play(offset = 0) {
        if (this.isMuted) {
            return;
        }
        if (this.context) {
			var audioLoadStart = this.contextCreatedAt;			
			this.audioLoadOffset = (new Date() - audioLoadStart) / 1000;			
            var newSource = this.context.createBufferSource();
            newSource.buffer = this.sourceNode.buffer;
            //newSource.loop = this.loop; 
            this.sourceNode = newSource;
            this.connectNodes();
            this.setVolume(this.volume);
			this.timeOffset = offset;
            newSource.start(0, offset, this.sourceNode.buffer.duration - offset);
        } else {
            this.sourceNode.play();
        }
        this.isPlaying = true;
        console.log("[Sound] playing " +this.url, this.context.currentTime);
        this.sourceNode.addEventListener("ended", this.soundEnded.bind(this));		
    };
		
	getAnalyserData() {
		return {
			analyser: this.analyser,
			dataArray: new Float32Array(this.analyser.frequencyBinCount), 
			bufferLength: this.analyser.frequencyBinCount 
		}
	}
	
	getCurrentTime() {
		return this.context.currentTime - this.audioLoadOffset + this.timeOffset;
	}
	
	getPosition() {
		return {
			currentTime: this.getCurrentTime() % this.getDuration(), 
			totalTime: this.getDuration(),
			percent: (Number(this.getCurrentTime() % this.getDuration()) / Number(this.getDuration())) * 100
		}
	}
	
	getDuration() {
		if (!this.isStream) {
			return this.sourceNode.buffer.duration;
		} else {
			return Number.MAX_VALUE;
		}
	}
	setPositionInSeconds(value) {
		this.stop();
		this.play(value);
	}
	
	setPositionInPercent(value) {
		let newPos = (this.getDuration() * value) / 100;
		this.stop();
		this.play(newPos);
	}
    /**
     * Stops a sound.
     * @function stop
     */
    stop() {
        this.sourceNode.stop();
		this.isPlaying = false;
		console.log("[Sound] stopping " +this.url);
    };

	pause() {
		if (this.context.state === 'running') {
			this.context.suspend();
		}
	}
	
	resume() {
		if (this.context.state === 'suspended') {
			this.context.resume();
		}		
	}
	
    /**
     * Pans the sound left / right. To pan left -1, to pan right 1, and center is 0.
     * @function setPanner
     * @param {Number} value The value to pan to. Max left is -1, max right is 1, and center is 0.
     */
    setPanning(value) {
        this.panner.setPosition(value, 0, 0);
    };

	/**
	 * Sets the wetness of the reverb. The higher the value, the more reverb.
	 * Will switch on the effect with immidiately on the sound - latency. 
	 * Therefore there is no reverb on/off setting. 
	 */
	setReverbLevel(value) {
		this.reverbGain.gain.setValueAtTime(value, 0);
	}
	
	setDistortionLevel(value) {
		this.distortion.curve = this.distortionShaper.createCurve(value);
	}
	
	/**
	 * Use different types of reverbs.
	 */
	setReverbType(type) {
		var newSource = this.context.createBufferSource();
		newSource.buffer = this.reverbImpulses[type].buffer;
		this.reverb.buffer = newSource;		
	}
    /**
     * Sets the volume of an individual sound.
     * Values range from 0 (no sound) to xx, however,
     * values above 3.4 might start to distort the sound.
     * @function setVolume
     * @param {Number} value A value between 0 (no sound) and x.
     */
    setVolume(value) {
        this.gainNode.gain.setValueAtTime(value / 4, 0);
    };

    soundEnded() {
        if (!this.loop) {
            this.isPlaying = false;
        } 
    }
};