export default class ReverbControls {
	constructor(sound) {
		this.reverbOnOff = null;
		this.reverbSlider = null;
		this.sound = sound;

	}
	
	createControl() {
		return this.toggleReverb = this.createToggle();
	}
	
	createToggle() {
		let container = document.createElement("div");
		container.className = "reverbControl";

		let label = document.createElement("label");
		
		this.reverbOnOff = document.createElement("input");		
		this.reverbOnOff.type = "checkbox";
		
		let labelText = document.createTextNode("Reverb");
		
		label.appendChild(this.reverbOnOff);
		label.appendChild(labelText);
		
		this.reverbSlider = document.createElement("input");
		this.reverbSlider.type = "range";
		this.reverbSlider.min = 0;
		this.reverbSlider.max = 1;
		this.reverbSlider.step = 0.1;
		this.reverbSlider.value = 0.5;
		this.reverbSlider.className = "slider";
		this.reverbSlider.id = "reverbSlider";
		
		
		container.appendChild(label);
		container.appendChild(this.reverbSlider);
		
		this.addListeners();
		return container;
	}

	addListeners() {
		this.reverbOnOff.onchange = (e) => {
		if (e.target.checked) {
			this.sound.setReverbLevel(this.reverbSlider.value);
		} else {
			this.sound.setReverbLevel(0);
		}
	}
		this.reverbSlider.onchange = (e) => {
			if (this.reverbOnOff.checked) {
				this.sound.setReverbLevel(e.target.value);
			}
		}
	}
}