import PlayPauseControl from './PlayPauseControl.js';
import ScrubberControl from './ScrubberControl.js';
import VolumeControl from './VolumeControl.js';
import PanningControl from './PanningControl.js';
import BandControls from './BandControls.js';
import ReverbControls from './ReverbControls.js';
import DistortionControl from './DistortionControl.js';

export default class AudioControls {
	constructor(controlWidth, player) {
		this.player = player;
		this.sound = this.player.getPlayingSounds()[0];
		this.width = controlWidth;
		
		this.container = this.createControlContainer(); 
		
		this.buttonPlayPause = new PlayPauseControl(this.sound);
		this.scrubberControl = new ScrubberControl(this.sound);
		this.volumeControl = new VolumeControl(this.sound);
		this.panningControl = new PanningControl(this.sound);
		this.bandControls = new BandControls(this.sound);
		this.reverbControls = new ReverbControls(this.sound);
		this.distortionControl = new DistortionControl(this.sound);
		
		document.body.appendChild(this.container);
		
		this.container.appendChild(this.buttonPlayPause.createControl());
		this.container.appendChild(this.scrubberControl.createControl());	
		this.container.appendChild(this.bandControls.createControl());
		this.container.appendChild(this.volumeControl.createControl());
		this.container.appendChild(this.panningControl.createControl());
		this.container.appendChild(this.reverbControls.createControl());
		this.container.appendChild(this.distortionControl.createControl());
	}
	
	createControlContainer() {
		const container = document.createElement("div");
		container.className = "audioControls";
		container.style.width = this.width;
		return container;
	}	
}