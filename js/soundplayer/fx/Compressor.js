import AudioContext from './../AudioContext.js';

export default class Compressor {
	constructor() {
		this._context = AudioContext.getInstance().context;
		this._node = this._context.createDynamicsCompressor();
		this.input = this._node;
		this.output = this._node;
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