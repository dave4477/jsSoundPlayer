import AbstractAudioNode from './AbstractAudioNode.js';

export default class Gain extends AbstractAudioNode {
	constructor() {
		super();
		this.node = this._context.createGain();
		this.input = this.node;
		this.output = this.node;
	}

	setLevel(value) {
		this.node.gain.setValueAtTime(value / 4, 0);
	}

	setVolume(value) {
		this.setLevel(value);
	}
}