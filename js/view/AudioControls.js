import ScrubberControl from './ScrubberControl.js';
import BandControls from './BandControls.js';

export default class AudioControls {
	constructor(controlWidth, player) {
		this.player = player;
		this.isPaused = false;
		this.width = controlWidth;
		this.container = this.createControlContainer(); 
		this.buttonPlayPause = this.createPlayPause();
		this.scrubberControl = new ScrubberControl();
		this.bandControls = new BandControls();
		document.body.appendChild(this.container);
		this.container.appendChild(this.buttonPlayPause);
		this.container.appendChild(this.scrubberControl.createBar());
		
		this.container.appendChild(this.bandControls.lBand);
		this.container.appendChild(this.bandControls.mBand);
		this.container.appendChild(this.bandControls.hBand);
		
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
				this.player.resumeSound(this.player.getPlayingSounds()[0].url);
				this.isPaused = false;
				btn.innerHTML = "Pause";

			}
		}
		return btn;
	}
	
	
	
	
}