export default class Distortion {
	constructor() {
	}
	
	createCurve(amount) { // function to make curve shape for distortion/wave shaper node to use
		var k = typeof amount === 'number' ? amount : 50,
		n_samples = 44100,
		curve = new Float32Array(n_samples),
		deg = Math.PI / 180,
		i = 0,
		x;
		for ( ; i < n_samples; ++i ) {
			x = i * 2 / n_samples - 1;
			curve[i] = ( 3 + k ) * x * 10 * deg / ( Math.PI + k * Math.abs(x) );
		}
		return curve;
	}
}