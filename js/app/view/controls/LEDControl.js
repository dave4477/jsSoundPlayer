export default class LEDControl {
	
	constructor() {

		this._checked = false;
		this._ledContainer = document.createElement("div");
		this._ledContainer.className = "ledContainer";
		this._ledOff = document.createElement("div");
		this._ledOn = document.createElement("div");
		this._ledOn.style.display = "none";
		this._ledContainer.onclick = (e) => {
			this._checked = !this._checked;
			if (this._checked) {
				this._ledOff.style.display = "none";
				this._ledOn.style.display = "";
			} else {
				this._ledOff.style.display = "";
				this._ledOn.style.display = "none";
			}
			this.onchange({target:this});
		}
	}
	
	onchange(e) {
		
	}
	
	createControl() {
		this._ledOff.className = "ledOff";
		this._ledOn.className = "ledOn";
		this._ledContainer.appendChild(this._ledOn);
		this._ledContainer.appendChild(this._ledOff);
		return this._ledContainer;
	}
	
	get checked() {
		return this._checked;
	}

	addListeners() {
		this.volumeSlider.onchange = (e) => {
			this.sound.setVolume(e.target.value);
		}
	}
}