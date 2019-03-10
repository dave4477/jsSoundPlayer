import PlayPauseControl from './PlayPauseControl.js';
import ScrubberControl from './ScrubberControl.js';
import VolumeControl from './VolumeControl.js';
import PanningControl from './PanningControl.js';
import BandControls from './BandControls.js';
import ReverbControls from './ReverbControls.js';
import DistortionControl from './DistortionControl.js';
import Generic1DialControl from './Generic1DialControl.js';
import GenericXDialControl from './GenericXDialControl.js';

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

		this.container.appendChild(this.buttonPlayPause.createControl());
		this.container.appendChild(this.scrubberControl.createControl());	
		if (this.sound.getNodeByName("bandFilters")) {
			this.bandControls = new BandControls(this.sound);
			this.container.appendChild(this.bandControls.createControl());
		}

		this.container.appendChild(this.volumeControl.createControl());
				
		if (this.sound.getNodeByName("panner")) {
			this.panningControl = new PanningControl(this.sound);
			this.container.appendChild(this.panningControl.createControl());
		}
		
		const clearDiv = document.createElement("div");
		clearDiv.style.clear = "both";
		this.container.appendChild(clearDiv);		
		
		if (this.sound.getNodeByName("distortion")) {
			this.distortionControl = new Generic1DialControl(this.sound, { 
				className:"distortionControl", 
				effectName:"Distortion", 
				effectToggle:"Damage", 
				knobLabelBottom:"Drive", 
				callback:"setDistortionLevel", 
				valueMultiplier:100, 
				defaultValue:10 
			});
			this.container.appendChild(this.distortionControl.createControl());		
		}
		if (this.sound.getNodeByName("reverb")) {
			this.reverbControls = new Generic1DialControl(this.sound, { 
				className:"distortionControl", 
				effectName:"Reverb", 
				effectToggle:"On", 
				knobLabelBottom:"Level", 
				callback:"setReverbLevel", 
				valueMultiplier:1, 
				defaultValue:0.1 
			});		
			this.container.appendChild(this.reverbControls.createControl());		
		}
		
		if (this.sound.getNodeByName("delay")) {
			this.delayControls = new GenericXDialControl(this.sound, { 
				className:"distortionControl", 
				effectName:"Delay", 
				effectToggle:"On", 
				dial:[{
					name:"delayTime",
					knobLabelBottom:"Delay", 
					callback:"setDelayTime", 
					dialMinValue:0.1, 
					dialMaxValue:4,
					valueMultiplier:1 

				}, 
				{
					name:"feedback",
					knobLabelBottom:"Feedback", 
					callback:"setFeedBack", 
					dialMinValue:0.1, 
					dialMaxValue:1,
					valueMultiplier:1 
				}],
				defaultValue:1 
			});
			this.container.appendChild(this.delayControls.createControl());
		}


		if (!this.sound.isStream) {
			this.detuneControl = new Generic1DialControl(this.sound, { className:"distortionControl", effectName:"Detuner", effectToggle:"On", knobLabelBottom:"Detune", callback:"detune", dial:{dialMinValue:-1200, dialMaxValue:1200}, valueMultiplier:1, defaultValue:50 }); 
			this.container.appendChild(this.detuneControl.createControl());
		}
		document.body.appendChild(this.container);

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