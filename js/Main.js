import SoundPlayer from './SoundPlayer.js';

class Main {
	constructor() {
		this.soundPlayer = new SoundPlayer();
		
		// Pre-load some sounds.
		this.soundPlayer.loadSounds(["./assets/sound1.mp3", "./assets/sound2.mp3"]).then((result) => {		
		
			// Play a sound without loading before hand. 
			this.soundPlayer.playSound("./assets/sound3.mp3", true);		

			// Get all loaded sounds.
			var allSounds = this.soundPlayer.getAllSounds();
			console.log(allSounds);
		});
	}
}

var main = new Main();