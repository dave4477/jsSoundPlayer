import AbstractAudioNode from './AbstractAudioNode.js';

export default class Compressor extends AbstractAudioNode {
	constructor() {
		
		super();
		
		this._node = this._context.createDynamicsCompressor();
		this.input = this._node;
		this.output = this._node;
	}
}