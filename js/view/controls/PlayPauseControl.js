export default class PlayPauseControl {
	constructor(sound) {
		this.sound = sound;
		this.isPaused = false;		
	}
	
	
	createControl() {
		let btn = document.createElement('button');
		btn.className = "playPause";
		
		if (this.isPaused) {
			btn.innerHTML = "Play";
		} else {
			btn.innerHTML = "Pause";
		}
		btn.onclick = () => {			
			if (!this.isPaused) {
				this.sound.pause();
				this.isPaused = true;
				btn.innerHTML = "Play";
			} else {
				this.sound.resume();
				this.isPaused = false;
				btn.innerHTML = "Pause";

			}
		}
		return btn;
	}
}