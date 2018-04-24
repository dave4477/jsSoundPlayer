export default class BandControls {
	constructor(barWidth = 40, player) {
		this.barWidth = barWidth;
		this.sound = player.getPlayingSounds()[0];
		this.sliders = {};
		this.containers = [];
		this.mainContainer = document.createElement("div");
		this.mainContainer.className = "bandFilters";
		
		var bandFilters = player.getPlayingSounds()[0].bandFilters;
		for (let i = 0; i < bandFilters.length; i++) {
			this.containers.push(this.createFilterSlider("band-" +i, [-25,25], i));
			this.mainContainer.appendChild(this.containers[i]);
		}
		this.isDragging = false;
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
			this.sound.bandFilters[index].gain.value = e.target.value;
		}
		slideContainer.appendChild(this.sliders[id]);
				
		return slideContainer;
	}
}