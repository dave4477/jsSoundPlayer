export default class Distortion {
	constructor() {
	}
	
	createCurve(amount) { 
		var k = typeof amount === 'number' ? amount : 50,
		n_samples = 44100,
		curve = new Float32Array(n_samples),
		deg = Math.PI / 180,
		i = 0,
		x;
		for ( ; i < n_samples; ++i ) {
			x = i * 2 / n_samples - 1;
			// Create sigmond function.
			// (3+20)\cdot x\cdot57\cdot(3/180)/(3+20\cdot\left|x\right|)
			curve[i] = ( 3 + k ) * x * 57 * deg / ( Math.PI + k * Math.abs(x) );

		}
		return curve;
	}
}