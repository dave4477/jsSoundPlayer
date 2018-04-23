import AbstractSpectrum from "./AbstractSpectrum.js";

export default class Experiment extends AbstractSpectrum {
	constructor(canvas, context, player) {
		super(canvas, context, player);
		//this.graphDrawn = false;
	}
	
	drawGraph() {
		let drawLines = 500;
		let leftChannel = this.sound.sourceNode.buffer.getChannelData(0); // Float32Array describing left channel     
		let lineOpacity = this.canvas.width / leftChannel.length;      
		this.context.save();
		this.context.fillStyle = '#080808' ;
		this.context.fillRect(0,0, this.canvas.width, this.canvas.height );
		this.context.strokeStyle = '#46a0ba';
		this.context.globalCompositeOperation = 'lighter';
		this.context.translate(0, this.canvas.height / 2);
		//context.globalAlpha = 0.6 ; // lineOpacity ;
		this.context.lineWidth = 1;
		let totallength = leftChannel.length;
		let eachBlock = Math.floor(totallength / drawLines);
		let lineGap = (this.canvas.width / drawLines);

		this.context.beginPath();
		
		for (let i = 0; i <= drawLines; i++) {
			let audioBuffKey = Math.floor(eachBlock * i);
			let x = i * lineGap;
			let y = leftChannel[audioBuffKey] * this.canvas.height / 2;
			this.context.moveTo( x, y );
			this.context.lineTo( x, (y * -1) );
		}
		this.context.stroke();
		this.context.restore();	
		this.graphDrawn = true;
	}
	
	draw() {
		super.draw();

	}
	
	drawTest1() {
		super.draw();
		let currentLeft = this.sound.sourceNode.buffer.getChannelData(0);
		let currentRight = this.sound.sourceNode.buffer.getChannelData(1);
		
		//console.log("currentRight:",currentRight, currentLeft);
		console.log("currentTime:", this.sound.getCurrentTime());
		
		let audioBuffKey = Math.floor(this.sound.getCurrentTime());
		
		console.log(currentLeft[audioBuffKey] * 500);
		
		//this.drawGraph();
		//this.drawPosition(this.sound.getPosition());
	}
}