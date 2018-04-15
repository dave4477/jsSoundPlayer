import Sound from './../Sound.js';
import LineSpectrum from './LineSpectrum.js';
import BarSpectrum from './BarSpectrum.js';
import FullSpectrum from './FullSpectrum.js';
import CircleSpectrum from './CircleSpectrum.js';
import SineSpectrum from './SineSpectrum.js';
import AudioControls from './AudioControls.js';
import ScrubberControl from './ScrubberControl.js';


export default class View {
	constructor(player, w = window.innerWidth, h = window.innerHeight ) {
		this.visualType = 0;	
		this.player = player;
		this.createCanvas(w, h);
		
		this.spectrums = [];
		this.spectrums.push(new LineSpectrum(this.canvas, this.canvasContext, this.player));
		this.spectrums.push(new BarSpectrum(this.canvas, this.canvasContext, this.player));
		this.spectrums.push(new FullSpectrum(this.canvas, this.canvasContext, this.player));
		this.spectrums.push(new CircleSpectrum(this.canvas, this.canvasContext, this.player));
		this.spectrums.push(new SineSpectrum(this.canvas, this.canvasContext, this.player));
		
		this.controls = new AudioControls(w, this.player);
		this.controls.scrubberControl.slider.onchange = (e) => {
			let snd = this.player.getPlayingSounds()[0];
			console.log(e.target.value);
			//console.log(this.scrubberControl.slider.value);
			snd.setPositionInPercent(e.target.value);
		}
	}
	
	createCanvas(w, h) {
		this.canvas = document.createElement('canvas');
		this.canvas.style.top = 0;
		this.canvas.style.left = 0;
		this.canvas.width = w;
		this.canvas.height = h;
		this.canvas.onmousedown = () => {
			this.visualType ++;
			if (this.visualType > this.spectrums.length-1) {
				this.visualType = 0;
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
		
		this.spectrums[this.visualType].draw();
		
		let snd = this.player.getPlayingSounds()[0];
		this.controls.scrubberControl.setValue(snd.getPosition().percent);
	}	
}