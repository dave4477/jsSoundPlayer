import AbstractSpectrum from "./AbstractSpectrum.js";

export default class SineSpectrum extends AbstractSpectrum {
	constructor(canvas, context, player) {
		super(canvas, context, player);
		this.middle = this.canvas.height / 2;
	}
	
	draw() {
		super.draw();

		const MAX = 2;
		const WIDTH = this.canvas.width;
		const HEIGHT = this.canvas.height;
		
		this.data.analyser.fftSize = 1024;
		let bufferLength = this.data.analyser.fftSize;

		let dataArray = new Uint8Array(bufferLength);
		this.data.analyser.getByteTimeDomainData(dataArray);

		this.context.lineWidth = 2;
		this.context.strokeStyle = 'rgb(255, 255, 255)';

		this.context.beginPath();

		var sliceWidth = WIDTH * 1.0 / bufferLength;
		var x = 0;

		for(var i = 0; i < bufferLength; i++) {
			var v = dataArray[i] / 128.0;
			if (v > MAX) {
				v = MAX;
			}
			v *= -1;
			v += 1;
			v *= 40;
			var y = (HEIGHT / 2) + v; 

			if(i === 0) {
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