import AbstractAudioNode from './AbstractAudioNode.js';

export default class Distortion extends AbstractAudioNode {
	constructor() {
		
		super();
		
		this.input = this._context.createGain();
		this.node = this._context.createWaveShaper();
		this.output = this._context.createGain();
		this._feedBack = this._context.createGain();
		this._tone = this._context.createBiquadFilter();
		this._tone.type = "lowpass";
		this._tone.frequency.setValueAtTime(3000, 0);
		this._tone.Q.setValueAtTime(1, 0);

		
		this.input.connect(this.node);		
		this.node.connect(this._tone);
		this._tone.connect(this._feedBack);
		this._feedBack.connect(this.output);
		this.input.connect(this.output);
	}

	_createCurve(amount) {
		const k = typeof amount === 'number' ? amount : 0;
		const n_samples = 22050;
		const curve = new Float32Array(n_samples);
		const deg = Math.PI / 180;
		let x;
		for (let i = 0; i < n_samples; i++ ) {
			x = i * 2 / n_samples - 1;
			// Create sigmond function.
			// (3+20)\cdot x\cdot57\cdot(3/180)/(3+20\cdot\left|x\right|)
			curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
		}
		return curve;
	}

	setLevel(value) {
		console.log("value:", value);
		this.node.curve = this._createCurve(value);
	}
	
	setTone(value) {
		this._tone.frequency.value = 2000 + value;
	}
	setFeedback(value) {
		this._feedBack.gain.value = value; //setValueAtTime(value, 0);
	}
}