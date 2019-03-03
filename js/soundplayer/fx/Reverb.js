import Loader from './../Loader.js';
import AudioContext from './../AudioContext.js';

/**
 * Creates a reverb effect using a convolver.
 * Nodes: Gain -> Convolver -> Gain
 */
export default class Reverb {
	/**
	 * @param {string} reverb The impulse url for the reverb. This should be a short impulse sound.
	 * @param {Number} value The gain value for the reverb. Default is 0.
	 */
	constructor(reverb, value = 0) {
		this._reverbUrl = reverb;
		this._context = AudioContext.getInstance().context;
		this._loader = new Loader(this._context);
		this._reverbs = [];

		this._preAmp = this._context.createGain();
		this._reverbAmp = this._context.createGain();
		this._reverb = this._context.createConvolver();
		this._master = this._context.createGain();

		this._preAmp.connect(this._reverbAmp);
		this._reverbAmp.connect(this._reverb);
		this._reverb.connect(this._master);
		this._preAmp.connect(this._master);

		this.input = this._preAmp;
		this.output = this._master;
		this.setLevel(0);
		this._loadReverbs();
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

	async _loadReverbs() {
		await this.loadImpulse();
		this._reverb.buffer = this._reverbs[0].buffer;
	}

	loadImpulse() {
		return new Promise((resolve, reject) => {
			this._loader.loadFiles([this._reverbUrl]).then((reverbSound) => {
				this._context.decodeAudioData(reverbSound[this._reverbUrl], buffer => {
					this._reverbs.push({buffer:buffer, url:this._reverbUrl});
					resolve(this._reverbs);
				});
			});
		}, (error)=>{
			console.warn("Error loading reverb!");
			reject();
		});
	}

	getActiveReverb() {
		return this._reverbs[0];
	}

	/**
	 * Sets the wetness level for the reverb.
	 * @param {Number} value. A value between 0 and 1.
	 */
	setLevel(value, time = 0) {
		this._reverbAmp.gain.setValueAtTime(value, time);
	}
}