import KnobControl from './KnobControl.js';
import LEDControl from './LEDControl.js';

export default class Generic1DialControl {
	constructor(sound, config) {
		this.shapeSlider = null;
		this.sound = sound;
		this.toggle = null;
		this.dialControls = {};
		
		for (let i = 0; i < config.dial.length; i++) {
			let minRotate = config.dial[i].minRotate || 0.1;
			let maxRotate = config.dial[i].dialMaxRotate || 0.9;
			let divisions = config.dial[i].dialDivisions || 0;
			let minRange = config.dial[i].dialMinValue || 0;
			let maxRange = config.dial[i].dialMaxValue || 1;
			
			this.dialControls[config.dial[i].name] = new KnobControl(minRotate, maxRotate, divisions, minRange, maxRange);
		}
		this.config = config || { className:"genericControl", effectName:"", effectToggle:"", knobLabelBottom:"", callback:"", valueMultiplier:1 };

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
		this.onOff = new LEDControl();
				
		const label = document.createElement("label");
		label.appendChild(this.onOff.createControl());
		
		effectToggle.appendChild(label);
		
		const knobContainer = document.createElement("div");
		knobContainer.className = "knobControlContainer";

		
		for (var i = 0; i < this.config.dial.length; i++) {
			var control = this.dialControls[this.config.dial[i].name].createControl();
			knobContainer.appendChild(control);
			if (this.config.dial[i].knobLabelBottom.length > 0) {
			
				const knobLabelBottom = document.createElement("div");
				knobLabelBottom.className = "knobLabelBottom";
				knobLabelBottom.innerHTML = this.config.dial[i].knobLabelBottom;
				control.appendChild(knobLabelBottom);
			}
		}		
		container.appendChild(effectName);
		container.appendChild(effectToggle);
		container.appendChild(knobContainer);
		
		this.addListeners();
		return container;
	}
	
	addListeners() {		

		for (let i = 0; i < this.config.dial.length; i++) {
			let dial = this.config.dial[i];
			
			this.dialControls[dial.name].dial.onchange = (e) => {
				if (this.onOff.checked) {
					this.sound[dial.callback](this.dialControls[dial.name].scaledValue * dial.valueMultiplier);
				}
			}
		}
		
		this.onOff.onchange = (e) => {
			for (let i = 0; i < this.config.dial.length; i++) {
				let dial = this.config.dial[i];

				if (e.target.checked) {
					this.sound[dial.callback](this.dialControls[dial.name].scaledValue * dial.valueMultiplier);
				} else {
					this.sound[dial.callback](0);
				}
			}
		}
	}
}