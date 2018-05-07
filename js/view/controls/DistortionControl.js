import KnobControl from './KnobControl.js';

export default class DistortionControls {
	constructor(sound) {
		this.distortionOnOff = null;
		this.shapeSlider = null;
		this.sound = sound;
		this.knobControl = new KnobControl();
		
		this.isDragging = false;
		this.mouseX = 0;
		this.mouseY = 0;
		

	}
	
	createControl() {
		return this.toggleDistortion = this.createToggle();
	}
	
	createToggle() {
		let container = document.createElement("div");
		container.className = "distortionControl";

		let label = document.createElement("label");
		
		this.distortionOnOff = document.createElement("input");		
		this.distortionOnOff.type = "checkbox";
		
		let labelText = document.createTextNode("Distortion");
		
		label.appendChild(this.distortionOnOff);
		label.appendChild(labelText);
				
		container.appendChild(label);
		//container.appendChild(this.shapeSlider);			
		container.appendChild(this.knobControl.createControl());
		this.addListeners();
		return container;
	}
	
	addListeners() {
		this.distortionOnOff.onchange = (e) => {
			if (e.target.checked) {
				this.sound.setDistortionLevel(this.knobControl.scaledValue);
			} else {
				this.sound.setDistortionLevel(0);
			}
		}
		
		this.knobControl.dial.onchange = (e) => {
			this.sound.setDistortionLevel(this.knobControl.scaledValue * 100);
		}		
	}
}