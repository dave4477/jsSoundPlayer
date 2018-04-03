import SoundPlayer from './SoundPlayer.js';

class Main {
	constructor(global) {
		this.soundPlayer = new SoundPlayer();
		
		// For debug purposes.
		global.soundPlayer = this.soundPlayer;
		
		// Pre-load some sounds.
		this.soundPlayer.loadSounds(["./assets/sound1.mp3", "./assets/Koala.jpg", "./assets/sound2.mp3"]).then((result) => {		
		
			// Play a sound without loading before hand. 
			this.soundPlayer.playSound("./assets/sound3.mp3", true);		

			// Log all loaded sounds to the console.
			var allSounds = this.soundPlayer.getAllSounds();
			console.log(allSounds);
		});
	}
}
var main = new Main(window);