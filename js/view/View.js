import Sound from './../Sound.js';

export default class View {
	constructor(player) {
		this.visualType = 3;
		
		this.player = player;
		this.createCanvas(400, 200);
		
	}
	createCanvas(w = window.innerWidth, h = window.innerHeight) {
		//Create 2D canvas
		this.canvas = document.createElement('canvas');
		this.canvas.style.position = 'absolute';
		this.canvas.style.top = 0;
		this.canvas.style.left = 0;
		this.canvas.width = w;
		this.canvas.height = h;
		this.canvas.onmousedown = () => {
			this.visualType ++;
			if (this.visualType > 3) {
				this.visualType = 1;
			}
		}
		
		document.body.appendChild(this.canvas);
		
		this.canvasContext = this.canvas.getContext('2d');
		this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);		
		window.requestAnimationFrame(() => this.update());
		
	}

	clearCanvas(color = 'rgb(0, 0, 0)') {
		this.canvasContext.fillStyle = color; //'rgb(0, 0, 0)';
		this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

	}
	
	update(dt) {
		window.requestAnimationFrame(() => this.update());
		
		if (this.visualType === 0) return;
		
		var snd = this.player.getPlayingSounds()[0];
		var dat = snd.getAnalyserData();
		dat.analyser.getFloatFrequencyData(dat.dataArray);

		this.clearCanvas();

		if (this.visualType === 1) {	
			const barWidth = (this.canvas.width / dat.bufferLength) * 2.5;
			let posX = 0;
			for (let i = 0; i < dat.bufferLength; i++) {
				const barHeight = (dat.dataArray[i] + 140) * 2;
				this.canvasContext.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 50, 50)';
				this.canvasContext.fillRect(posX, this.canvas.height - barHeight / 2, barWidth, barHeight / 2);
				posX += barWidth + 0.5;
			}		
		} else if (this.visualType === 2) {
			
			this.canvasContext.lineWidth = 2;
			this.canvasContext.strokeStyle = 'rgb(255, 255, 255)';
			this.canvasContext.beginPath();			
					
			var sliceWidth = this.canvas.width * 1 / dat.bufferLength;
			var x = 0;
			
			for (var i = 0; i < dat.bufferLength; i++) {
				var v = dat.dataArray[i]; 
				var y = v + (this.canvas.height / 2);
				
				y += (this.canvas.height / 2);

				if (i === 0) {
					this.canvasContext.moveTo(x, y);
				} else {
					this.canvasContext.lineTo(x, y);
				}
				x += sliceWidth;
			}	
			this.canvasContext.lineTo(this.canvas.width, this.canvas.height / 2);
			this.canvasContext.stroke();		

		} else if (this.visualType === 3) {
			var drawLines = 500;
			var leftChannel = snd.sourceNode.buffer.getChannelData(0); // Float32Array describing left channel     
			var lineOpacity = this.canvas.width / leftChannel.length;      
			this.canvasContext.save();
			this.canvasContext.fillStyle = '#080808' ;
			this.canvasContext.fillRect(0,0, this.canvas.width, this.canvas.height );
			this.canvasContext.strokeStyle = '#46a0ba';
			this.canvasContext.globalCompositeOperation = 'lighter';
			this.canvasContext.translate(0, this.canvas.height / 2);
			//context.globalAlpha = 0.6 ; // lineOpacity ;
			this.canvasContext.lineWidth = 1;
			var totallength = leftChannel.length;
			var eachBlock = Math.floor(totallength / drawLines);
			var lineGap = (this.canvas.width / drawLines);

			this.canvasContext.beginPath();
			for (let i = 0; i <= drawLines; i++) {
				var audioBuffKey = Math.floor(eachBlock * i);
				var x = i * lineGap;
				var y = leftChannel[audioBuffKey] * this.canvas.height / 2;
				this.canvasContext.moveTo( x, y );
				this.canvasContext.lineTo( x, (y * -1) );
			}
			this.canvasContext.stroke();
			this.canvasContext.restore();	
			let pos = snd.getPosition();
			
			this.drawPosition(pos);
		}		
	}
	drawPosition(position) {
		let posX = (position.percent / 100) * this.canvas.width;
		this.canvasContext.fillStyle = 'rgb(255, 255, 25)';
		this.canvasContext.fillRect(posX, 0, 1.5, this.canvas.height);
	}
	
}