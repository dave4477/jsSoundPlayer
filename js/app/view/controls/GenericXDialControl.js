import KnobControl from './KnobControl.js';
import LEDControl from './LEDControl.js';

export default class GenericXDialControl {
	constructor(sound, config) {
		this.shapeSlider = null;
		this.container = null;
		this.sound = sound;
		this.toggle = null;
		this.dialControls = {};
		
		for (let i = 0; i < config.dial.length; i++) {
			const { dialMinRotate, dialMaxRotate, divisions, dialMinValue, dialMaxValue, defaultSetting } = config.dial[i];
			this.dialControls[config.dial[i].name] = new KnobControl(0.1, 0.9, divisions, dialMinValue, dialMaxValue, defaultSetting);
		}
			console.log(this.dialControls);

		this.config = config || { className:"genericControl", effectName:"", effectToggle:"", knobLabelBottom:"", callback:"", valueMultiplier:1 };

	}
	
	createControl() {
		return this.toggle = this.createToggle();
	}
		
	createToggle() {
		this.container = document.createElement("div");
		this.container.className = this.config.className; 
		
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

		
		for (let i = 0; i < this.config.dial.length; i++) {
			const control = this.dialControls[this.config.dial[i].name].createControl();
			knobContainer.appendChild(control);
			if (this.config.dial[i].knobLabelBottom.length > 0) {
			
				const knobLabelBottom = document.createElement("div");
				knobLabelBottom.className = "knobLabelBottom";
				knobLabelBottom.innerHTML = this.config.dial[i].knobLabelBottom;
				control.appendChild(knobLabelBottom);
			}
		}		
		this.container.appendChild(effectName);
		this.container.appendChild(effectToggle);
		this.container.appendChild(knobContainer);
		
		this.addListeners();
		return this.container;
	}
	
	addListeners() {		
		const node = this.config.node && this.sound.getNodeByName(this.config.node).value || this.sound;
		
		for (let i = 0; i < this.config.dial.length; i++) {
			let dial = this.config.dial[i];
			
			this.dialControls[dial.name].dial.onchange = (e) => {
				if (this.onOff.checked) {
					node[dial.callback](this.dialControls[dial.name].scaledValue * dial.valueMultiplier);
				}
			}
		}
		
		this.onOff.onchange = (e) => {
			for (let i = 0; i < this.config.dial.length; i++) {
				let dial = this.config.dial[i];

				if (e.target.checked) {
					node[dial.callback](this.dialControls[dial.name].scaledValue * dial.valueMultiplier);
				} else {
					node[dial.callback](0);
				}
			}
		}
	}
}