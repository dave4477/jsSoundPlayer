import AudioContext from './../AudioContext.js';

/**
 * Analyser node for analysing audio data.
 */
export default class Analyser {
	constructor() {
		this._context = AudioContext.getInstance().context;

		this.node = this._context.createAnalyser();
		this.node.fftSize = 256;
		this.node.smoothingTimeConstant = 0.8;

		this.input = this.node;
		this.output = this.node;
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
}