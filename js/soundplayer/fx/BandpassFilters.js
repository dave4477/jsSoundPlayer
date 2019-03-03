import AudioContext from './../AudioContext.js';
import Gain from './../fx/Gain.js';

export default class BandpassFilters {
	constructor() {
		this._context = AudioContext.getInstance().context;
		this.bandFilters = [];
		this.input = this._createBiquadFilterNode("lowshelf", 600); 
		this.bandFilters.push(this._createBiquadFilterNode("peaking", 170));
		this.bandFilters.push(this._createBiquadFilterNode("peaking", 310));
		this.bandFilters.push(this._createBiquadFilterNode("peaking", 600));
		this.bandFilters.push(this._createBiquadFilterNode("peaking", 1000));
		this.bandFilters.push(this._createBiquadFilterNode("peaking", 3000));
		this.bandFilters.push(this._createBiquadFilterNode("peaking", 6000));
		this.bandFilters.push(this._createBiquadFilterNode("peaking", 12000));
		this.bandFilters.push(this._createBiquadFilterNode("peaking", 14000));
		this.bandFilters.push(this._createBiquadFilterNode("peaking", 16000));
		this._connectFilters(this.input);
		this.bandFilters.unshift(this.input);
		this.output = this.bandFilters[this.bandFilters.length-1];
		this.node = this.input;
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

	_createBiquadFilterNode(type, frequency) {
		let biquadFilter = this._context.createBiquadFilter();
		biquadFilter.type = type;
		biquadFilter.frequency.setValueAtTime(frequency, 0);
		biquadFilter.Q.setValueAtTime(1, 0);
		biquadFilter.gain.setValueAtTime(0, 0);
		return biquadFilter;
	}

	_filterConnecter(prevNode, currentNode) {
		return prevNode.connect(currentNode);
	}

	_connectFilters(node) {
		return this.bandFilters.reduce(this._filterConnecter, node);
	}
}