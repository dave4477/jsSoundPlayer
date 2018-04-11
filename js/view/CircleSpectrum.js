import AbstractSpectrum from "./AbstractSpectrum.js";

/**
 * Draws the sound spectrum in circles.
 * For this it uses bufferLength and and the dataArray.
 */
export default class CircleSpectrum extends AbstractSpectrum {
	constructor(canvas, context, player) {
		super(canvas, context, player);
		this.middle = this.canvas.height / 2;
	}
	
	draw() {
		super.draw();
		
		this.context.lineWidth = 2;
		this.context.strokeStyle = 'rgb(255, 0, 0)';
		let spacing = (this.canvas.width / this.data.bufferLength);
		let colourChange = 255 / this.data.bufferLength;
		
		let posX = 0;
		for (let i = 0; i < this.data.bufferLength; i++) {
			let radius = Math.abs((this.data.dataArray[i] + 100));
			let colourChange = 255 / this.data.bufferLength;
			
			this.context.strokeStyle = 'rgb(255,' +(i * 2)+ ',0';
			this.context.beginPath();
			this.context.arc(posX,this.middle,radius,0,2*Math.PI);
			this.context.stroke();
			
			posX += spacing;
		}		
	}
}