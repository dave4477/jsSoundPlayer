import SoundPlayer from './SoundPlayer.js';

class Main {
	constructor(global) {
		this.soundPlayer = new SoundPlayer();
		this.soundPlayer.loadSounds(["./assets/sound1.mp3", "./assets/sound2.mp3"]).then((result) => {
			Object.keys(result).forEach(loadedSound => {
				console.log("loadedSound:", loadedSound);
				this.soundPlayer.playSound(loadedSound);
			});
		});
		global.soundPlayer = this.soundPlayer;
	}
}

var main = new Main(window);