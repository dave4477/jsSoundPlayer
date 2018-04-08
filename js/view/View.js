import Sound from './../Sound.js';

export default class View {
	constructor(player) {
		console.log("new view");

		this.canvas = null;
		this.canvasContext = null;
		
		this.player = player;
		this.createCanvas();
		
	}
	createCanvas() {
		//Create 2D canvas
		this.canvas = document.createElement('canvas');
		this.canvas.style.position = 'absolute';
		this.canvas.style.top = 0;
		this.canvas.style.left = 0;
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		
		console.log(this.canvas);
		document.body.appendChild(this.canvas);
		
		this.canvasContext = this.canvas.getContext('2d');
		this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);		
		window.requestAnimationFrame(this.update.bind(this));
		
	}
	
	update(dt) {
		window.requestAnimationFrame(this.update.bind(this));
		let snd = this.player.getPlayingSounds()[0];
		let dat = snd.getAnalyserData();
		dat.analyser.getFloatFrequencyData(dat.dataArray);

			
		this.canvasContext.fillStyle = 'rgb(0, 0, 0)';
		this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

		//Draw spectrum
		const barWidth = (this.canvas.width / dat.bufferLength) * 2.5;
		let posX = 0;
		for (let i = 0; i < dat.bufferLength; i++) {
			const barHeight = (dat.dataArray[i] + 140) * 2;
			this.canvasContext.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 50, 50)';
			this.canvasContext.fillRect(posX, this.canvas.height - barHeight / 2, barWidth, barHeight / 2);
			posX += barWidth + 1;
		}		
	}
}