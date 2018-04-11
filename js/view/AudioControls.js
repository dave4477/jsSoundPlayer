export default class AudioControls {
	constructor(player) {
		this.player = player;
		this.buttonPlayPause = this.createPlayPause();
		document.body.appendChild(this.buttonPlayPause);
	}
	
	
	createPlayPause() {
		let btn = document.createElement('button');
		
		btn.innerHTML = "Play/Pause";
		btn.onclick = () => {
			if (this.player.getPlayingSounds().length) {
				this.player.stopSound(this.player.getPlayingSounds()[0].url);
			} else {
				this.player.playSound("./assets/sound1.mp3");
			}
		}
		return btn;
	}
	
	
}