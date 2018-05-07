import KnobControl from './KnobControl.js';

export default class Generic1DialControl {
	constructor(sound, config) {
		this.shapeSlider = null;
		this.sound = sound;
		this.toggle = null;
		this.knobControl = new KnobControl();
		this.config = config || { className:"genericControl", effectName:"", effectToggle:"", knobLabelBottom:"", callback:"", valueMultiplier:1 };
		this.isDragging = false;
		this.mouseX = 0;
		this.mouseY = 0;
	}
	
	createControl() {
		return this.toggle = this.createToggle();
	}
	
	createToggle() {
		const container = document.createElement("div");
		container.className = this.config.className; 
		
		const effectName = document.createElement("div");
		effectName.className = "effectName";
		if (this.config.effectName.length > 0) { effectName.innerHTML = this.config.effectName; }	
		
		const effectToggle = document.createElement("div");
		effectToggle.className = "effectToggle";		
		this.onOff = document.createElement("input");		
		this.onOff.type = "checkbox";		
		const label = document.createElement("label");
		label.appendChild(this.onOff);

		if (this.config.effectToggle.length > 0) {
			const labelText = document.createTextNode(this.config.effectToggle);
			label.appendChild(labelText);
		}
		effectToggle.appendChild(label);
		
		const knobContainer = document.createElement("div");
		knobContainer.className = "knobControlContainer";
		knobContainer.appendChild(this.knobControl.createControl());
		
		container.appendChild(effectName);
		container.appendChild(effectToggle);
		container.appendChild(knobContainer);
		if (this.config.knobLabelBottom.length > 0) {
			const knobLabelBottom = document.createElement("div");
			knobLabelBottom.className = "knobLabelBottom";
			knobLabelBottom.innerHTML = this.config.knobLabelBottom;
			container.appendChild(knobLabelBottom);
		}

		this.addListeners();
		return container;
	}
	
	addListeners() {		
		var func = this.config.callback;

		this.onOff.onchange = (e) => {
			if (e.target.checked) {
				this.sound[func](this.knobControl.scaledValue * this.config.valueMultiplier);
			} else {
				this.sound[func](0);
			}
		}
		this.knobControl.dial.onchange = (e) => {
			if (this.onOff.checked) {
				this.sound[func](this.knobControl.scaledValue * this.config.valueMultiplier);
			}
		}		
	}
}