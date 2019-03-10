import AudioContext from './../AudioContext.js';

/**
 * Creates a reverb effect using a convolver.
 * Nodes: Gain -> Convolver -> Gain
 */
export default class Reverb {
	/**
	 * @param {string} reverb The impulse url for the reverb. This should be a short impulse sound.
	 * @param {Number} value The gain value for the reverb. Default is 0.
	 */
	constructor(options) {
		
		const { feedback, delayTime } = options;
		this._context = AudioContext.getInstance().context;
		this.input = this._context.createGain();
		this.output = this._context.createGain();
		this._preAmp = this._context.createGain();
		this._master = this._context.createGain();
		this._master.gain.value = feedback;
		
		this.delay = this._context.createDelay(8);
		//this.delay.delayTime.value = delayTime;

		this.feedback = this._context.createGain();
		this.feedback.gain.value = 0.4;
		this.feedback.gain.setValueAtTime(0.4, this._context.currentTime);

		this.filter = this._createBiQuadFilterNode(); 
		this.filter.frequency.value = 1000;

		this.input.connect(this._preAmp);
		
		this.delay.connect(this.feedback);
		this.delay.connect(this._master);
		this.feedback.connect(this.filter);
		this.filter.connect(this.delay);
		this._preAmp.connect(this.delay);
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
	 * Connects this node to another node.
	 *
	 * @param {Object} node An effect node to connect to.
	 * @return {node} The previous node the new node was connected to.
	 */
	connect(node, inputIndex = 0, outputIndex = 0) {
		this.output.connect(node.input, inputIndex, outputIndex);
		return node;
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
		this.delay.delayTime.setValueAtTime(value, this._context.currentTime);
	}
}	
	