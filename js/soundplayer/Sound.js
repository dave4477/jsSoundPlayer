import AudioContext from './AudioContext.js';
import StringUtils from './utils/StringUtils.js';
import Gain from './fx/Gain.js';
import Analyser from './fx/Analyser.js';

/**
 * Sound object, initialised for every individual sound.
 *
 * @param {string} url The url for the sound.
 * @param {Object} buffer The audioBuffer.
 * @constructor
 */
export default class Sound {
    constructor (url, buffer) {
		// private
		this._context = AudioContext.getInstance().context;
		this._contextCreatedAt = new Date();
		this._url = url;
		this._timeOffset = 0;
		this._nodes = [];
		this._buffer = buffer;

		// public
		this.id = url;
		this.isStream = url === "stream";
		this.loop = null;
		this.volume = null;
		this.isPlaying = this.isStream;
		this._createNodes(buffer);
    }

	/**
	 * Creates 3 default required nodes.
	 * A Gain node, a scriptProcessor node and an analyserNode.
	 *
	 * @param {Object} buffer The audio buffer to create the audiosource from.
	 */
	_createNodes(buffer) {
		this.preAmp = new Gain();
		this.analyserNode = new Analyser();

		if (!this.isStream) {
			this.sourceNode = this._context.createBufferSource();
			this.sourceNode.buffer = buffer;
		} else {
			this.sourceNode = this._context.createMediaStreamSource(buffer);
		}
		this.analyserNode = new Analyser();
		this.scriptNode = this._context.createScriptProcessor(2048, 1, 1);
		this.scriptNode.onaudioprocess = () => {
			// get the average for the first channel
			var array = new Uint8Array(this.analyserNode.node.frequencyBinCount);
			this.analyserNode.node.getByteFrequencyData(array);
			if (!this.isStream) {
				if (this.getCurrentTime() >= this.sourceNode.buffer.duration && this.loop) {
					this.setPositionInSeconds(0);
				}
			}
		}
		this.bufferLength = this.analyserNode.frequencyBinCount;
		this.dataArray = new Float32Array(this.bufferLength);
		
		if (this.isStream) {
			this._connectNodes();
		}
	}

	/**
	 * Returns a node that was manually added by name.
	 *
	 * @param {string} name The name of the node that was added.
	 * @return {Object} The node if it was found, otherwise null.
	 */
	getNodeByName(name) {
		for (let i = 0; i < this._nodes.length; i++) {
			if (this._nodes[i].name === name) {
				return this._nodes[i];
			}
		}
		return null;
	}

	/**
	 * Adds a node, like reverb, gain etc.
	 *
	 * @param {string} name The name for the node.
	 * @param {Object} value The actual node.
	 *
	 */
	addNode(name, value) {
		this._nodes.push({name:name, value:value});
		return this;
	}	
	
    /**
	 * Connect all mixer nodes to the sourceNode.
	 */
    _connectNodes() {
		this.sourceNode.connect(this.preAmp.input);

		if (this._nodes.length) {
			this._connectNodeReducer(this.preAmp);
			this._nodes[this._nodes.length-1].value.output.connect(this.analyserNode.input);
		} else {
			this.preAmp.output.connect(this.analyserNode.input);
		}
        this.analyserNode.output.connect(this._context.destination);
		this.scriptNode.connect(this._context.destination);
	}

	_connectNodeReducer(node) {
		return this._nodes.reduce(this._nodeConnecter.bind(this), node);
	}

	_nodeConnecter(prev, curr) {
		prev = prev.output ? prev : prev.value;
		curr = curr.input ? curr : curr.value;
		return prev.connect(curr);
	}

	/**
	 * Streams a sound, should be called after adding nodes.
	 */
	stream() {
		this.preAmp.output.disconnect(this.analyserNode.input);
		this._connectNodes();
	}
	
    /**
     * (Re) Plays the sound for webAudio by copying the old buffer into the new one,
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
        if (this._context) {
			var audioLoadStart = this._contextCreatedAt;
			this.audioLoadOffset = (new Date() - audioLoadStart) / 1000;
            var newSource = this._context.createBufferSource();
            newSource.buffer = this.sourceNode.buffer;
            this.sourceNode = newSource;
			this._connectNodes();
            this.setVolume(this.volume);
			this._timeOffset = offset;
            newSource.start(0, offset, this.sourceNode.buffer.duration - offset);

        } else {
            this.sourceNode.play();
        }
        this.isPlaying = true;
        console.log("[Sound] playing " +this._url, this._context.currentTime);
        this.sourceNode.addEventListener("ended", this.soundEnded.bind(this));
    };

	getAnalyserData() {
		return {
			analyser: this.analyserNode.node,
			dataArray: new Float32Array(this.analyserNode.node.frequencyBinCount),
			bufferLength: this.analyserNode.node.frequencyBinCount
		}
	}

	getCurrentTime() {
		return this._context.currentTime - this.audioLoadOffset + this._timeOffset;
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
		console.log("[Sound] stopping " +this._url);
    };

	pause() {
		if (this._context.state === 'running') {
			this._context.suspend();
		}
	}

	resume() {
		if (this._context.state === 'suspended') {
			this._context.resume();
		}
	}

    /**
     * Pans the sound left / right. To pan left -1, to pan right 1, and center is 0.
     * @function setPanner
     * @param {Number} value The value to pan to. Max left is -1, max right is 1, and center is 0.
     */
    setPanning(value) {
		this.getNodeByName("panner").value.setPosition(value);
    };

	/**
	 * Sets the wetness of the reverb. The higher the value, the more reverb.
	 * Will switch on the effect with immidiately on the sound - latency.
	 * Therefore there is no reverb on/off setting.
	 */
	setReverbLevel(value, time) {
		this.getNodeByName("reverb").value.setLevel(value, time);
	}

	setDistortionLevel(value) {
		this.getNodeByName("distortion").value.setLevel(value);
	}

	detune(value) {
		this.sourceNode.detune.value = value;
	}

    /**
     * Sets the volume of an individual sound.
     * Values range from 0 (no sound) to xx, however,
     * values above 3.4 might start to distort the sound.
     * @function setVolume
     * @param {Number} value A value between 0 (no sound) and x.
     */
    setVolume(value) {
        this.preAmp.setLevel(value);
		this.volume = value;
    };

    soundEnded() {
        if (!this.loop) {
            this.isPlaying = false;
        }
    }
};