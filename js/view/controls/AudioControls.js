import PlayPauseControl from './PlayPauseControl.js';
import ScrubberControl from './ScrubberControl.js';
import VolumeControl from './VolumeControl.js';
import PanningControl from './PanningControl.js';
import BandControls from './BandControls.js';
import ReverbControls from './ReverbControls.js';
import DistortionControl from './DistortionControl.js';
import Generic1DialControl from './Generic1DialControl.js';

export default class AudioControls {
	constructor(width, player) {
		this.player = player;
		this.sound = this.player.getPlayingSounds()[0];
		this.width = width;
		this.container = this.createControlContainer(); 
		
		if (this.sound) {
			this.createControls();
		}
	}
	
	createControls(sound) {
		this.setSound(sound);
		this.buttonPlayPause = new PlayPauseControl(this.sound);
		this.scrubberControl = new ScrubberControl(this.sound);
		this.volumeControl = new VolumeControl(this.sound);
		this.panningControl = new PanningControl(this.sound);
		this.bandControls = new BandControls(this.sound);
		this.reverbControls = new Generic1DialControl(this.sound, { className:"distortionControl", effectName:"Reverb", effectToggle:"On", knobLabelBottom:"Level", callback:"setReverbLevel", valueMultiplier:1 });		
		this.distortionControl = new Generic1DialControl(this.sound, { className:"distortionControl", effectName:"Distortion", effectToggle:"Damage", knobLabelBottom:"Drive", callback:"setDistortionLevel", valueMultiplier:100 });				
		document.body.appendChild(this.container);
		
		this.container.appendChild(this.buttonPlayPause.createControl());
		this.container.appendChild(this.scrubberControl.createControl());	
		this.container.appendChild(this.bandControls.createControl());
		this.container.appendChild(this.volumeControl.createControl());
		this.container.appendChild(this.panningControl.createControl());
		
		const clearDiv = document.createElement("div");
		clearDiv.style.clear = "both";
		this.container.appendChild(clearDiv);

		this.container.appendChild(this.reverbControls.createControl());		
		this.container.appendChild(this.distortionControl.createControl());		
	}

	setSound(sound) {
		if (!this.sound && sound) {
			this.sound = sound;
		} else {
			return;
		}
	}
	
	createControlContainer() {
		const container = document.createElement("div");
		container.className = "audioControls";
		container.style.width = this.width;
		return container;
	}	
}