import AbstractAudioNode from './AbstractAudioNode.js';

export default class Distortion extends AbstractAudioNode {
	constructor() {
		
		super();
		
		this.node = this._context.createWaveShaper();
		this.input = this.node;
		this.output = this.node;
	}

	_createCurve(amount) {
		var k = typeof amount === 'number' ? amount : 50;
		var n_samples = 22050;
		var curve = new Float32Array(n_samples);
		var deg = Math.PI / 180;
		var i = 0;
		var x;
		for (i = 0; i < n_samples; ++i ) {
			x = i * 2 / n_samples - 1;
			// Create sigmond function.
			// (3+20)\cdot x\cdot57\cdot(3/180)/(3+20\cdot\left|x\right|)
			curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
		}
		return curve;
	}

	setLevel(value) {
		this.node.curve = this._createCurve(value);
	}
}