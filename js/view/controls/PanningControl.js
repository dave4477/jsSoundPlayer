export default class PanningControl {
	constructor(sound) {
		this.panningSlider = null;
		this.sound = sound;
	}
	
	createControl() {
		return this.panningSlider = this.createSlider();
	}
	
	createSlider() {
		let container = document.createElement("div");
		container.className = "panningControl";
				
		let labelText = document.createTextNode("Panning");
		container.appendChild(labelText);
		
		this.panningSlider = document.createElement("input");
		this.panningSlider.type = "range";
		this.panningSlider.min = -1;
		this.panningSlider.max = 1;
		this.panningSlider.step = 0.1;
		this.panningSlider.value = 0;
		this.panningSlider.className = "slider";
		this.panningSlider.id = "panningSlider";
		
		container.appendChild(this.panningSlider);
		
		this.addListeners();
		return container;
	}

	addListeners() {
		this.panningSlider.onchange = (e) => {
			this.sound.setPanning(e.target.value);
		}
	}
}