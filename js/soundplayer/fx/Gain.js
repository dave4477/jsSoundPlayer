import AudioContext from './../AudioContext.js';

export default class Gain {
	constructor() {
		this._context = AudioContext.getInstance().context;
		this.node = this._context.createGain();
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

	setLevel(value) {
		this.node.gain.setValueAtTime(value / 4, 0);
	}

	setVolume(value) {
		this.setLevel(value);
	}
}