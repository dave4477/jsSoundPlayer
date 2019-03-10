import AbstractAudioNode from './AbstractAudioNode.js';

export default class Panner extends AbstractAudioNode {
	constructor() {
		
		super();
		
		this.node = this._context.createPanner();
		this.node.pannerModel = 'equalpower';
		this.input = this.node;
		this.output = this.node;
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