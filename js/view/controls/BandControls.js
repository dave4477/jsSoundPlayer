export default class BandControls {
	constructor(sound) {
		this.barWidth = 40;
		this.sound = sound;
		this.sliders = {};
		this.containers = [];

	}
	
	createControl() {
		this.mainContainer = document.createElement("div");
		this.mainContainer.className = "bandFilters";
		
		var bandFilters = this.sound.bandFilters;
		for (let i = 0; i < bandFilters.length; i++) {
			this.containers.push(this.createFilterSlider("band-" +i, [-25,25], i));
			this.mainContainer.appendChild(this.containers[i]);
		}
		this.isDragging = false;
		return this.mainContainer;
	}
		
	createFilterSlider(id, arrRange, index) {
		
		const slideContainer = document.createElement("div");
		slideContainer.className = "slideContainer bandFilter";
		slideContainer.style.width = this.barWidth +"px";
		slideContainer.display = "flex";
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
		this.sliders[id].onchange = (e) => {
			this.sound.bandFilters[index].gain.setValueAtTime(e.target.value, 0);
		}
		slideContainer.appendChild(this.sliders[id]);
				
		return slideContainer;
	}
}