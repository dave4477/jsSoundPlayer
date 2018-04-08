import SoundPlayer from './SoundPlayer.js';
import View from './view/View.js';

class Main {
	constructor(global) {
		this.soundPlayer = new SoundPlayer();
		
		// For debug purposes.
		global.soundPlayer = this.soundPlayer;
		
		// Pre-load some sounds.
		this.soundPlayer.loadSounds(["./assets/sound1.mp3", "./assets/sound2.mp3"]).then((result) => {		
		
			// Play a sound without loading before hand. 
			this.soundPlayer.playSound("./assets/sound1.mp3", true);		

			// Log all loaded sounds to the console.
			var allSounds = this.soundPlayer.getAllSounds();
			console.log(allSounds);
			
			this.view = new View(this.soundPlayer);
		});
	}
}
var main = new Main(window);
window.onload = function() { console.log("window loaded", main); 
console.log(document.getElementsByTagName("canvas")[0]);
}