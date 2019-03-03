import SoundPlayer from './../soundplayer/SoundPlayer.js';
import View from './view/View.js';

import Gain from './../soundplayer/fx/Gain.js';
import Reverb from './../soundplayer/fx/Reverb.js';
import Distortion from './../soundplayer/fx/Distortion.js';
import Panner from './../soundplayer/fx/Panner.js';
import BandpassFilters from './../soundplayer/fx/BandpassFilters.js';
import Compressor from './../soundplayer/fx/Compressor.js';

/**
 * Main entry point to start everything. 
 * Here we initialize the soundPlayer, load the sounds
 * and play the sound when loaded.
 *
 * We also create the views here.
 */
class Main {
	constructor(global) {
		this.soundPlayer = new SoundPlayer();		
		
		// For debugging purposes.
		global.soundPlayer = this.soundPlayer;
		
		this.loadSounds();
		//this.streamSoundInput();
	}
	
	streamSoundInput() {
		this.soundPlayer.streamSoundInput((sound) => {
			this.view = new View(this.soundPlayer, 480, 260);				

		});
	}
	
	async loadSounds() {
		const url = "./assets/sound3.mp3";
		let result = await this.soundPlayer.loadSounds([url]); 
		
		// Add some sound effects through the Sound API.
		result[url].addNode("distortion", new Distortion())
			.addNode("bandFilters", new BandpassFilters())
			.addNode("panner", new Panner())
			.addNode("reverb", new Reverb("./assets/soundeffects/reverb1.wav"))
			.addNode("masterGain", new Gain())
			.addNode("compressor", new Compressor());		
		
		this.soundPlayer.playSound("./assets/sound3.mp3", true);
		this.view = new View(this.soundPlayer, 480, 260);		
	}
}
var main = new Main(window);