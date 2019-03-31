import LineSpectrum from './spectrum/LineSpectrum.js';
import Experiment from './spectrum/Experiment.js';
import BarSpectrum from './spectrum/BarSpectrum.js';
import FullSpectrum from './spectrum/FullSpectrum.js';
import CircleSpectrum from './spectrum/CircleSpectrum.js';
import SineSpectrum from './spectrum/SineSpectrum.js';
import VolumeSpectrum from './spectrum/VolumeSpectrum.js';

import AudioControls from './controls/AudioControls.js';


export default class View {
	constructor(player, w = window.innerWidth, h = window.innerHeight ) {
		this.visualType = 0;	
		this.player = player;
		this.createCanvas(w, h);
		
		this.spectrums = [];
		this.spectrums.push(new LineSpectrum(this.canvas, this.canvasContext, this.player));
		this.spectrums.push(new Experiment(this.canvas, this.canvasContext, this.player));
		this.spectrums.push(new BarSpectrum(this.canvas, this.canvasContext, this.player));
		this.spectrums.push(new FullSpectrum(this.canvas, this.canvasContext, this.player));
		this.spectrums.push(new CircleSpectrum(this.canvas, this.canvasContext, this.player));
		this.spectrums.push(new SineSpectrum(this.canvas, this.canvasContext, this.player));
		this.spectrums.push(new VolumeSpectrum(this.canvas, this.canvasContext, this.player));
		
		this.controls = new AudioControls(w, this.player);
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
		const div = document.createElement("div");
		div.style.width = w +"px";
		div.style.height = h +"px";
		div.className = "visualContainer";
		div.appendChild(this.canvas);
		document.body.appendChild(div);
		
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
		
		const snd = (this.player.getPlayingSounds().length > 0) ? this.player.getPlayingSounds()[0] : null;
		if (snd) {
			if (this.controls.scrubberControl && !snd.isStream) {
				this.controls.scrubberControl.setValue(snd.getPosition().percent);
			}
			this.spectrums[this.visualType].draw();
		} 
	}	
}