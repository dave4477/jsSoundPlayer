export default class KnobControl {
	
	/**
	 * @constructor
	 * @param {Number} minRotate The minimum the dial can rotate to.
	 * @param {Number} maxRotate The maximum rotation the dial can rotate to.
	 * @param {Number} minRange The minimum clamped value to return in scaledValue against rotated value.  
	 * @param {Number} maxRange The maximum clamped value to return in scaledValue against the rotated value.
	 * @param {Number} defaultValue The default scaledValue that will be returned in the onchange event. Should be between minRange and maxRange. 
	 */
	constructor(minRotate = 0.1, maxRotate = 0.9, divisions = 0, minRange = 0, maxRange = 1, defaultValue = 0.1) {
		this.min = minRotate;
		this.max = maxRotate;
		this.minRange = minRange;
		this.maxRange = maxRange;
		this.divisions = divisions;
		this.lastRotation = 0;
		this.scaledValue = defaultValue;
		this.value = this.scaledValueToValue();
		this.previousAngle = 0;
		this.previousValue = 0;
		this.isDragging = false;
		this.dial = null;
		this.dialContainer = this.createDial();
		this.addListeners();
	}

	scaledValueToValue() {
		var percent = (this.scaledValue - this.minRange) / (this.maxRange - this.minRange) * 100;
		this.value = ( this.min + this.max) * (percent / 100);
	}
	
	createDial() {
		let dialContainer = document.createElement("div");
		dialContainer.className = "dialKnobContainer";
		
		this.dial = document.createElement("div");
		this.dial.className = "dial";		
		
		this.scaledValueToValue();
		
		this.dial.style.transform = "rotate(" +this.value * 360+ "deg)";
		dialContainer.appendChild(this.dial);

		return dialContainer;
	}
	
	createControl() {
		return this.dialContainer;
	}
	
	getOffset() {
		let elPos = this.dial.getBoundingClientRect();
		return {
			left: elPos.left + window.scrollLeft,
			top: elPos.top + window.scrollTop
		}
	}
	
	getCenter() {
		var rect = this.dial.getBoundingClientRect();
		return [
			rect.left + (rect.right - rect.left) / 2,
			rect.top + (rect.bottom - rect.top) / 2		
			];
	}

	floatOrDefault(x, def) {
		x = parseFloat(x);
		return isNaN(x) ? def : x;
	}
	 
	convertRange( value, r1, r2 ) { 
	    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];	
	}
	
	/**
	 * @private
	 * Returns the angle in radians.
	 */
	getAngle(e) {
		const center = this.getCenter();
			
		// Mouse position.
		let mousePos = [e.clientX, e.clientY];

		// Or finger touch position.
		if (e.targetTouches && e.targetTouches[0]) {
			mousePos = [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
		}

		let rad = Math.atan2(mousePos[1] - center[1], mousePos[0] - center[0]);
		rad += Math.PI / 2;

		return rad;				
	}
	
	mouseDown(e) {
		document.body.onselectstart = () => { return false; }		
		this.isDragging = true;
		this.previousAngle = this.getAngle(e);
		this.previousValue = this.value;
	}

	mouseMove(e) {
		if (this.isDragging) {
			const rad = this.getAngle(e);		
			const newAngle = rad;
			const oldAngle = this.previousAngle;
			this.previousAngle = newAngle;

			let deltaAngle = newAngle - oldAngle;
			if (deltaAngle < 0) {
				// Because this is a circle
				deltaAngle += Math.PI * 2;
			}
			if (deltaAngle > Math.PI) {
				// Converting from 0..360 to -180..180.
				deltaAngle -= Math.PI * 2;
			}

			const deltaValue = deltaAngle / Math.PI / 2;
			const newProposedValue = this.value + deltaValue;
			
			this.value = newProposedValue;
			
			this.updateValue();
			
			this.scaledValue = this.convertRange( this.value, [ this.min, this.max ], [ this.minRange, this.maxRange ] );
			this.dial.style.transform = "rotate(" +this.value * 360+ "deg)";
			this.dial.dispatchEvent(new Event('change'));
		}
	}
			
	mouseUp(e) {
		this.isDragging = false;
	}
	
	updateValue() {
		if (Number.isFinite(this.divisions) && this.divisions >= 2) {
			this.value = Math.round(this.value * this.divisions) / this.divisions;
		}

		// Clamping to the defined min..max range.
		if (Number.isFinite(this.max) && this.value > this.max) {
			this.value = this.max;
		}
		if (Number.isFinite(this.min) && this.value < this.min) {
			this.value = this.min;
		}

		if (this.isDragging) {
			this.previousValue = this.value;
		}		
	}
	
	addListeners() {
		this.mouseDownHandler = e => this.mouseDown(e);
		this.mouseMoveHandler = e => this.mouseMove(e);
		this.mouseUpHandler = e => this.mouseUp(e);
		this.dial.addEventListener('mousedown', this.mouseDownHandler); 
		window.addEventListener('mousemove', this.mouseMoveHandler);
		window.addEventListener('mouseup', this.mouseUpHandler);
	}	
	
	/**
	 * @private
	 * Converts radians to degrees.
	 */ 
	angleToDegrees(angle) {
		return angle * (180 / Math.PI);		
	}

	/**
	 * @private
	 * Converts degrees to radians.
	 */ 
	degreesToAngle(deg) {
		return deg * Math.PI / 180;
	}
}
