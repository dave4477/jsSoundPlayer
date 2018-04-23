export default class BandControls {
	constructor(container, barWidth = 40) {
		this.barWidth = barWidth;
		this.sliders = {};

		this.lBand = this.createFilterSlider("lBand", [-25,25]);
		this.mBand = this.createFilterSlider("mBand", [-25,25]);
		this.hBand = this.createFilterSlider("hBand", [-25,25]);
		this.isDragging = false;
	}
		
	createFilterSlider(id, arrRange) {
		
		const slideContainer = document.createElement("div");
		slideContainer.className = "slideContainer bandFilter";
		slideContainer.style.width = this.barWidth +"px";
		slideContainer.display = "inline-block";
		slideContainer.onmousedown = () => {
			this.isDragging = true;
		}
		slideContainer.onmouseup = () => {
			this.isDragging = false;
		}
		this.sliders[id] = document.createElement("input");
		this.sliders[id].type = "range";
		this.sliders[id].min = arrRange[0];
		this.sliders[id].max = arrRange[1];
		this.sliders[id].step = 1;
		this.sliders[id].value = 1;
		this.sliders[id].className = "slider";
		this.sliders[id].id = id;
		slideContainer.appendChild(this.sliders[id]);
				
		return slideContainer;
	}
}