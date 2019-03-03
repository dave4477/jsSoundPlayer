export default class VolumeControl {
	constructor(sound) {
		this.volumeSlider = null;
		this.sound = sound;
	}
	
	createControl() {
		return this.volumeSlider = this.createVolumeSlider();
	}
	
	createVolumeSlider() {
		let container = document.createElement("div");
		container.className = "volumeControl";
				
		let labelText = document.createTextNode("Volume");
		
		container.appendChild(labelText);
		
		this.volumeSlider = document.createElement("input");
		this.volumeSlider.type = "range";
		this.volumeSlider.min = 0;
		this.volumeSlider.max = 1;
		this.volumeSlider.step = 0.1;
		this.volumeSlider.value = 1;
		this.volumeSlider.className = "slider";
		this.volumeSlider.id = "volumeSlider";
		
		
		container.appendChild(this.volumeSlider);
		
		this.addListeners();
		return container;
	}

	addListeners() {
		this.volumeSlider.onchange = (e) => {
			this.sound.setVolume(e.target.value);
		}
	}
}