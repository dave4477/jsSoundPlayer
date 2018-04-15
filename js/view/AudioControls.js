import ScrubberControl from './ScrubberControl.js';

export default class AudioControls {
	constructor(controlWidth, player) {
		this.player = player;
		this.isPaused = false;
		this.width = controlWidth;
		this.container = this.createControlContainer(); 
		this.buttonPlayPause = this.createPlayPause();
		this.scrubberControl = new ScrubberControl();
		document.body.appendChild(this.container);
		this.container.appendChild(this.buttonPlayPause);
		this.container.appendChild(this.scrubberControl.createBar());

	}
	
	createControlContainer() {
		const container = document.createElement("div");
		container.className = "audioControls";
		container.style.width = this.width;
		return container;
	}
	
	createPlayPause() {
		let btn = document.createElement('button');
		btn.className = "playPause";
		
		if (this.isPaused) {
			btn.innerHTML = "Play";
		} else {
			btn.innerHTML = "Pause";
		}
		btn.onclick = () => {			
			if (!this.isPaused) {
				this.player.pauseSound(this.player.getPlayingSounds()[0].url);
				this.isPaused = true;
				btn.innerHTML = "Play";
			} else {
				this.player.resumeSound("./assets/sound1.mp3");
				this.isPaused = false;
				btn.innerHTML = "Pause";

			}
		}
		return btn;
	}
	
	
	
	
}