import AudioContext from './../AudioContext.js';

export default class Panner {
	constructor() {
		this._context = AudioContext.getInstance().context;
		this.node = this._context.createPanner();
		this.node.pannerModel = 'equalpower';
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

    /**
     * Pans the sound left / right. To pan left -1, to pan right 1, and center is 0.
     * @function setPanner
     * @param {Number} value The value to pan to. Max left is -1, max right is 1, and center is 0.
     */
	setPosition(value) {
		this.node.setPosition(value, 0, 0);
	}
}