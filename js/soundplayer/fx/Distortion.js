import AudioContext from './../AudioContext.js';

export default class Distortion {
	constructor() {
		this._context = AudioContext.getInstance().context;
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
	
	/**
	 * Connects this node to another node.
	 *
	 * @param {Object} node An effect node to connect to.
	 * @return {node} The previous node the new node was connected to.
	 */
	connect(node) {
		this.output.connect(node.input);
		return node;
	}

	setLevel(value) {
		this.node.curve = this._createCurve(value);
	}
}