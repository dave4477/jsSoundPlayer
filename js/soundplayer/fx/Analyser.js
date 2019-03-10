import AbstractAudioNode from './AbstractAudioNode.js';

/**
 * Analyser node for analysing audio data.
 */
export default class Analyser extends AbstractAudioNode {
	constructor() {
		super();
		
		this.node = this._context.createAnalyser();
		this.node.fftSize = 256;
		this.node.smoothingTimeConstant = 0.8;

		this.input = this.node;
		this.output = this.node;
	}
}