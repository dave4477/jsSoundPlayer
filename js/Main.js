import SoundPlayer from './SoundPlayer.js';
import View from './view/View.js';

/**
 * Configuration that can be optionally passed to the soundPlayer.
 */
const config = {
	effects:{
		reverbs:[
			{type:"reverb", url:"./js/soundeffects/reverb1.wav", active:true, buffer:null},
			{type:"reverb", url:"./js/soundeffects/reverb3.wav", active:false, buffer:null}
		],
		distortion:null
	}
}

/**
 * Main entry point to start everything. 
 * Here we initialize the soundPlayer, load the sounds
 * and play the sound when loaded.
 *
 * We also create the views here.
 */
class Main {
	constructor(global, playerConfig) {
		this.soundPlayer = new SoundPlayer(playerConfig);		
		
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
		let result = await this.soundPlayer.loadSounds(["./assets/sound3.mp3"]); 
		this.soundPlayer.playSound("./assets/sound3.mp3", true);
		this.view = new View(this.soundPlayer, 480, 260);		
	}
}
var main = new Main(window, JSON.stringify(config));