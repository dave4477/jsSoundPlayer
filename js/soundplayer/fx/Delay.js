import AbstractAudioNode from './AbstractAudioNode.js';

/**
 * Creates a digital delay effect using delay, gain and biquadFilter.
 */
export default class Reverb extends AbstractAudioNode {
	/**
	 * @param {Object} options.
	 */
	constructor(options) {
		super();
		
		const { feedback, delayTime, maxDelayTime } = options;

		this.input = this._context.createGain();
		this.output = this._context.createGain();
		this._preAmp = this._context.createGain();
		this._master = this._context.createGain();
		this._master.gain.value = feedback;
		
		this._delay = this._context.createDelay(maxDelayTime);

		this._feedback = this._context.createGain();
		this._feedback.gain.value = 0.4;
		this._feedback.gain.setValueAtTime(0.4, this._context.currentTime);

		this._filter = this._createBiQuadFilterNode(); 
		this._filter.frequency.value = 1000;

		this.input.connect(this._preAmp);
		
		this._delay.connect(this._feedback);
		this._delay.connect(this._master);
		this._feedback.connect(this._filter);
		this._filter.connect(this._delay);
		this._preAmp.connect(this._delay);
		this._master.connect(this.output);
		this._preAmp.connect(this.output);
	}

	_createBiQuadFilterNode() {		
		let biquadFilter = this._context.createBiquadFilter();
		biquadFilter.type = "lowpass";
		biquadFilter.frequency.setValueAtTime(1000, this._context.currentTime);
		return biquadFilter;
	}

	/**
	 * Sets the wetness level for the reverb.
	 * @param {Number} value. A value between 0 and 1.
	 */
	setLevel(value, time = 0) {
	}	
	
	setFeedBack(value, time = 0) {
		console.log("feedback:", value);
		this._master.gain.setValueAtTime(value, this._context.currentTime + time);
	}
	
	setDelayTime(value) {
		console.log("delayTime:", value);
		this._delay.delayTime.setValueAtTime(value, this._context.currentTime);
	}
}	
	