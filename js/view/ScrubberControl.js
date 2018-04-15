export default class ScrubberControl {
	constructor(container, barWidth) {
		this.barWidth = barWidth;
		this.slider = null;
		this.isDragging = false;
	}
	
	setValue(value) {
		if (!this.isDragging) {
			this.slider.value = value;
		}
	}
	
	createBar() {
		const slideContainer = document.createElement("div");
		slideContainer.className = "slideContainer";
		slideContainer.style.width = this.barWidth +"px";
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
		return slideContainer;
	}
}