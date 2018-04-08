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
        this.masterGain = masterGain;
        this.url = url;
		this.id = url;
		this.audio = document.createElement("audio");
		this.audio.crossOrigin = "anonymous";
		this.source = this.context.createMediaElementSource(this.audio);
		
		this.duration = 0;
		this.currentTime = 0;
		
		this.createNodes(buffer);
        
        this.loop = null;
        this.volume = null;
        this.sourceNode.loop = null;
        this.isPlaying = false;
    }

	createNodes(buffer) {
		this.sourceNode = this.context.createBufferSource();
		this.sourceNode.buffer = buffer;
		this.gainNode = this.context.createGain();
		this.panner = this.context.createPanner();
		this.panner.pannerModel = 'equalpower';
		this.analyser = this.context.createAnalyser();
		this.analyser.fftSize = 256;
		this.bufferLength = this.analyser.frequencyBinCount;
		this.dataArray = new Float32Array(this.bufferLength);
		this.connectNodes();
	}
    /**
	 * Connect all mixer nodes to the sourceNode.
	 */
   // Connect all the nodes in the correct way
    // (Note, source is created and connected later)
    //
    //                <source>
    //                    |
    //                    |_____________
    //                    |             \
    //                <preamp>          |
    //                    |             | <-- Optional bypass
    //           [...biquadFilters]     |
    //                    |_____________/
    //                    |
    //    (split using createChannelSplitter)
    //                    |
    //                   / \
    //                  /   \
    //          <leftGain><rightGain>
    //                  \   /
    //                   \ /
    //                    |
    //     (merge using createChannelMerger)
    //                    |
    //               <chanMerge>
    //                    |
    //                    |\
    //                    | <analyser>
    //                  <gain>
    //                    |
    //              <destination>
	 
    connectNodes() {
        this.sourceNode.connect(this.gainNode);
        this.gainNode.connect(this.panner);
		this.panner.connect(this.analyser);
        this.analyser.connect(this.masterGain);
        this.masterGain.connect(this.context.destination);
    }

    /**
     * Re-Plays the sound for webAudio by copying the old buffer into the new one,
     * as a bufferSource can only be used once. Connect to gain nodes for volume,
     * and plays the sound. Should only be used through the the _public object.
     *
     * @module AudioService
     * @function play
     */
    play() {
        if (this.isMuted) {
            return;
        }
        if (this.context) {
            var newSource = this.context.createBufferSource();
            newSource.buffer = this.sourceNode.buffer;
            newSource.loop = this.sourceNode.loop;
            this.sourceNode = newSource;
            this.connectNodes();
            this.setVolume(this.volume);
            newSource.start();
        } else {
            this.sourceNode.play();
        }
        this.isPlaying = true;
        console.log("[AudioService] playing " +this.url);
        this.sourceNode.addEventListener("ended", this.soundEnded.bind(this));		
    };
	
	updateTime(dt) {
		//window.requestAnimationFrame(this.updateTime.bind(this));

		this.currentTime = StringUtils.formatTime(this.context.currentTime);
		this.duration = StringUtils.formatTime(this.sourceNode.buffer.duration);
		this.analyser.getFloatFrequencyData(this.dataArray);
	}
	
	getAnalyserData() {
		return {
			analyser: this.analyser,
			dataArray: this.dataArray,
			bufferLength: this.bufferLength
		}
	}
	
	getPosition() {
		return {
			currentTIme: this.currentTime,
			totalTime: this.duration
		}
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
        console.log("[AudioService] stopping " +this.url);
    };


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
        this.gainNode.gain.value = value;
    };

    soundEnded() {
		this.currentTime = 0;
        if (!this.loop) {
            this.isPlaying = false;
        }
    }
};