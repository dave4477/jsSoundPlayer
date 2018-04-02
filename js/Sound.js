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
        this.id = url; //url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("\."));

        if (!this.context) {
            this.sourceNode = buffer;
        } else {
            this.sourceNode = this.context.createBufferSource();
            this.sourceNode.buffer = buffer;
            this.gainNode = this.context.createGain();
            this.panner = this.context.createPanner();
            this.panner.pannerModel = 'equalpower';
            this.connectNodes.call(this);
        }
        this.loop = null;
        this.volume = null;
        this.sourceNode.loop = null;
        this.isPlaying = false;
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
            this.connectNodes.call(this);
            this.setVolume(this.volume);
            newSource.start();
        } else {
            this.sourceNode.play();
        }
        this.isPlaying = true;
        console.log("[AudioService] playing " +this.id+ " from " +this.url);
        this.sourceNode.addEventListener("ended", this.soundEnded.bind(this));
    };

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
        console.log("[AudioService] stopping " +this.id+ " from "+this.url);
    };

    // Connect all mixer nodes to the sourceNode.
    connectNodes() {
        this.sourceNode.connect(this.gainNode);
        this.gainNode.connect(this.panner);
        this.panner.connect(this.masterGain);
        this.masterGain.connect(this.context.destination);
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
        this.gainNode.gain.value = value;
    };

    soundEnded() {
        if (!this.loop) {
            this.isPlaying = false;
        }
    }
};