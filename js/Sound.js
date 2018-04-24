import StringUtils from './utils/StringUtils.js';

export default class Sound {

    /**
     * Sound object, initialised for every individual sound. Should only be used through the _public object.
     *
     * @function Sound
     * @param {string} url The url for the sound.
     * @param {Boolean} loop Whether the sound should loop.
     * @param {Number} volume The playback volume of the sound (do we want to hurt peoples ears).
     * @param {Object} buffer The audioBuffer. This will be null for HTML5Audio fallback.
     * @param {Object} audioctx The AudioContext if webaudio is supported.
     * @param {Object} masterGain The masterGain from the AudioService for volume.
     * @constructor
     */
    constructor (url, buffer, audioctx, masterGain) {
		this.context = audioctx;
		this.contextCreatedAt = new Date();
        this.masterGain = masterGain;
        this.url = url;
		this.id = url;	
		this.timeOffset = 0;
		this.contextCreatedAt = new Date();

		this.createNodes(buffer);
		
        this.loop = null;
        this.volume = null;
        this.sourceNode.loop = null;
        this.isPlaying = false;
    }

	createNodes(buffer) {
		this.sourceNode = this.context.createBufferSource();
		this.sourceNode.buffer = buffer;
		this.splitter = this.context.createChannelSplitter(2);
		this.merger = this.context.createChannelMerger(2);
		this.gainNode = this.context.createGain();
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
		//this.bandFilters.push(this.createBiquadFilterNode("highshelf", 32000));
				
		this.analyser = this.context.createAnalyser();
		this.analyser.fftSize = 256;
		this.analyser.smoothingTimeConstant = 0.8;
		
		this.scriptNode = this.context.createScriptProcessor(2048, 1, 1);
		this.scriptNode.onaudioprocess = () => {

			// get the average for the first channel
			var array = new Uint8Array(this.analyser.frequencyBinCount);
			this.analyser.getByteFrequencyData(array);

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
		biquadFilter.frequency.value = frequency;
		biquadFilter.Q.value = 1;
		biquadFilter.gain.value = 0;
		return biquadFilter;
	}
    /**
	 * Connect all mixer nodes to the sourceNode.
	 */ 
    connectNodes() {
		this.scriptNode.connect(this.context.destination);
        this.sourceNode.connect(this.gainNode);		
		
		this.equalizerNodes = this.connectFilters(this.gainNode);
		
		this.equalizerNodes.connect(this.panner);
		this.panner.connect(this.analyser);
		this.analyser.connect(this.masterGain);
        this.masterGain.connect(this.context.destination);	
    }
	
	connectFilters(node) {
		return this.bandFilters.reduce(this.filterConnecter, this.gainNode);
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
            newSource.loop = this.sourceNode.loop;
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
			currentTime: this.getCurrentTime() % this.sourceNode.buffer.duration, 
			totalTime: this.sourceNode.buffer.duration,
			percent: (Number(this.getCurrentTime() % this.sourceNode.buffer.duration) / Number(this.sourceNode.buffer.duration)) * 100
		}
	}
	
	setPositionInSeconds(value) {
		this.stop();
		this.start(value);
	}
	
	setPositionInPercent(value) {
		let newPos = (this.sourceNode.buffer.duration * value) / 100;
		this.stop();
		this.play(newPos);
	}
    /**
     * Stops a sound.
     * @function stop
     */
    stop() {
        if (!this.context) {
            this.sourceNode.pause();
            this.sourceNode.currentTime = 0.0;
        } else {
            this.sourceNode.stop();
        }
        this.isPlaying = false;
        console.log("[Sound] stopping " +this.url);
    };

	pause() {
		console.log("calling pause:", this.context.state);
		if (this.context.state === 'running') {
			this.context.suspend();
		}
	}
	
	resume() {
		console.log("calling resume:", this.context.state);

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
     * Sets the volume of an individual sound.
     * Values range from 0 (no sound) to xx, however,
     * values above 3.4 might start to distort the sound.
     * @function setVolume
     * @param {Number} value A value between 0 (no sound) and x.
     */
    setVolume(value) {
        this.gainNode.gain.value = value / 4;
    };

    soundEnded() {
		console.log("sound ended!")
        if (!this.loop) {
            this.isPlaying = false;
        } 
    }
};