export default class AbstractSpectrum {
	constructor(canvas, context, player) {
		this.canvas = canvas;
		this.context = context;
		this.player = player;
		this.sound = this.player.getPlayingSounds()[0];
		this.data = null;
	}
	
	clearCanvas(color = 'rgb(0, 0, 0)') {
		this.context.fillStyle = color;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

	}
	
	draw() {
		this.data = this.sound.getAnalyserData();
		this.data.analyser.getFloatFrequencyData(this.data.dataArray);
		this.clearCanvas();
	}
	
}