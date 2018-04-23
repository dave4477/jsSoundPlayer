import AbstractSpectrum from "./AbstractSpectrum.js";

export default class BarSpectrum extends AbstractSpectrum {
	constructor(canvas, context, player) {
		super(canvas, context, player);

	}
	
	draw() {
		super.draw();

		this.data.analyser.fftSize = 256;

		const barWidth = (this.canvas.width / this.data.bufferLength) * 2;
		let posX = 0;

		for (let i = 0; i < this.data.bufferLength; i++) {
			const barHeight = (this.data.dataArray[i] + 140) * 2;
			this.context.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 50, 50)';
			this.context.fillRect(posX, this.canvas.height - barHeight / 2, barWidth, barHeight / 2);
			posX += barWidth + 0.5;
		}		
	}
}