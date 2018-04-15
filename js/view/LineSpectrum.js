import AbstractSpectrum from "./AbstractSpectrum.js";

export default class LineSpectrum extends AbstractSpectrum {
	constructor(canvas, context, player) {
		super(canvas, context, player);
	}
	
	draw() {
		super.draw();
		this.data.analyser.fftSize = 256;
		
		this.context.lineWidth = 2;
		this.context.strokeStyle = 'rgb(255, 255, 255)';
		this.context.beginPath();			
				
		var sliceWidth = this.canvas.width * 1 / this.data.bufferLength;
		var x = 0;
		
		for (var i = 0; i < this.data.bufferLength; i++) {
			var v = this.data.dataArray[i]; 
			var y = v + (this.canvas.height / 2);
			
			y += (this.canvas.height / 2);

			if (i === 0) {
				this.context.moveTo(x, y);
			} else {
				this.context.lineTo(x, y);
			}
			x += sliceWidth;
		}	
		this.context.lineTo(this.canvas.width, this.canvas.height / 2);
		this.context.stroke();		
	}
	
}