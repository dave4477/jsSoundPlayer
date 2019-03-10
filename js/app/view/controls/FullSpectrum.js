export default class FullSpectrum {
	constructor(canvas, context, buffer) {
		this.canvas = canvas;
		this.context = context;
		this.buffer = buffer;
		this.graphDrawn = false;
	}
	
	drawGraph() {
		let drawLines = 1500;
		let leftChannel = this.buffer.getChannelData(0); // Float32Array describing left channel     
		let lineOpacity = this.canvas.width / leftChannel.length;      
		this.context.save();
		this.context.fillStyle = '#080808' ;
		this.context.fillRect(0,0, this.canvas.width, this.canvas.height );
		this.context.strokeStyle = '#46a0ba';
		this.context.globalCompositeOperation = 'lighter';
		this.context.translate(0, this.canvas.height / 2);
		this.context.lineWidth = 1;
		let totallength = leftChannel.length;
		let eachBlock = Math.floor(totallength / drawLines);
		let lineGap = (this.canvas.width / drawLines);

		this.context.beginPath();
		
		for (let i = 0; i <= drawLines; i++) {
			let audioBuffKey = Math.floor(eachBlock * i);
			let x = i * lineGap;
			let y = leftChannel[audioBuffKey] * this.canvas.height;
			this.context.moveTo( x, y );
			this.context.lineTo( x, (y * -1) );
		}
		this.context.stroke();
		this.context.restore();	
		this.graphDrawn = true;
	}
	
	draw() {
		this.drawGraph();
	}
}