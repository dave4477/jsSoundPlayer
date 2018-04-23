import SoundPlayer from './SoundPlayer.js';
import View from './view/View.js';

class Main {
	constructor(global) {
		this.soundPlayer = new SoundPlayer();		
		
		// For debugging purposes.
		global.soundPlayer = this.soundPlayer;
		this.loadSounds();
	}
	
	async loadSounds() {
		let result = await this.soundPlayer.loadSounds(["./assets/sound3.mp3"]); 		
		//this.soundPlayer.playSound("./assets/sound4.mp3", true);		
		this.soundPlayer.playSound("./assets/sound3.mp3", true);
		this.view = new View(this.soundPlayer, 480, 260);		
	}
}
var main = new Main(window);