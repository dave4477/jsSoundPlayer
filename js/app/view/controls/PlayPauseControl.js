export default class PlayPauseControl {
	constructor(sound) {
		this.sound = sound;
		this.isPaused = true;		
	}
	
	
	createControl() {
		let btn = document.createElement('button');
		btn.className = "playPause";
		
		if (this.isPaused) {
			btn.className = "playPause play";
			//btn.innerHTML = "Play";
		} else {
			btn.className = "playPause pause";
			//btn.innerHTML = "Pause";
		}
		btn.onclick = () => {			
			if (!this.isPaused) {
				this.sound.pause();
				this.isPaused = true;
				btn.className = "playPause play";
			} else {
				this.sound.resume();
				this.isPaused = false;
				btn.className = "playPause pause";


			}
		}
		return btn;
	}
}