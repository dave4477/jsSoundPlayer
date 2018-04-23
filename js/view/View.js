import Sound from './../Sound.js';
import LineSpectrum from './LineSpectrum.js';

import Experiment from './Experiment.js';


import BarSpectrum from './BarSpectrum.js';
import FullSpectrum from './FullSpectrum.js';
import CircleSpectrum from './CircleSpectrum.js';
import SineSpectrum from './SineSpectrum.js';
import VolumeSpectrum from './VolumeSpectrum.js';
import AudioControls from './AudioControls.js';
import ScrubberControl from './ScrubberControl.js';


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
		this.controls.scrubberControl.slider.onchange = (e) => {
			let snd = this.player.getPlayingSounds()[0];
			snd.setPositionInPercent(e.target.value);
		}
		this.controls.bandControls.sliders["lBand"].onchange = (e) => {
			let snd = this.player.getPlayingSounds()[0];
			let ls = snd.lowShelf.gain;
			ls.value = e.target.value;
		}
		this.controls.bandControls.sliders["mBand"].onchange = (e) => {
			let snd = this.player.getPlayingSounds()[0];
			let ms = snd.midShelf.gain;
			ms.value = e.target.value;
		}
		this.controls.bandControls.sliders["hBand"].onchange = (e) => {
			let snd = this.player.getPlayingSounds()[0];
			let hs = snd.highShelf.gain;
			hs.value = e.target.value;
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
		let div = document.createElement("div");
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
		
		this.spectrums[this.visualType].draw();
		
		let snd = (this.player.getPlayingSounds().length > 0) ? this.player.getPlayingSounds()[0] : null;
		if (snd) {
			this.controls.scrubberControl.setValue(snd.getPosition().percent);
		}
	}	
}