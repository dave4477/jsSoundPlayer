export default class ScrubberControl {
	constructor(sound) {
		this.slider = null;
		this.isDragging = false;
		this.sound = sound;
	}
	
	setValue(value) {
		if (!this.isDragging) {
			this.slider.value = value;
		}
	}
	
	createControl() {
		const slideContainer = document.createElement("div");
		slideContainer.className = "slideContainer";
		slideContainer.display = "inline-block";
		slideContainer.onmousedown = () => {
			this.isDragging = true;
		}
		slideContainer.onmouseup = () => {
			this.isDragging = false;
		}
		this.slider = document.createElement("input");
		this.slider.type = "range";
		this.slider.min = 0;
		this.slider.max = 100;
		this.slider.value = 0;
		this.slider.className = "slider";
		this.slider.id = "myRange";
		slideContainer.appendChild(this.slider);
		this.addListeners();
		return slideContainer;
	}
	
	addListeners() {
		this.slider.onchange = (e) => {
			this.sound.setPositionInPercent(e.target.value);
		}		
	}
}