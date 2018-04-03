import SoundPlayer from './SoundPlayer.js';

class Main {
	constructor() {
		this.soundPlayer = new SoundPlayer();
		this.soundPlayer.loadSounds(["./assets/sound1.mp3", "./assets/sound2.mp3"]).then((result) => {
			Object.keys(result).forEach(loadedSound => {
				console.log("loadedSound:", loadedSound);
				this.soundPlayer.playSound(loadedSound);	
			});
			
			this.soundPlayer.playSound("./assets/sound3.mp3");		
		});
	}
}

var main = new Main();