import PlayPauseControl from './PlayPauseControl.js';
import ScrubberControl from './ScrubberControl.js';
import VolumeControl from './VolumeControl.js';
import PanningControl from './PanningControl.js';
import BandControls from './BandControls.js';
import GenericXDialControl from './GenericXDialControl.js';
import FullSpectrum from './FullSpectrum.js';

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
			this.distortionControl = new GenericXDialControl(this.sound, { 
				className:"distortionControl", 
				effectName:"Distortion", 
				effectToggle:"Damage", 
				node:"distortion",
				dial:[{
					name:"DistortionDrive",
					knobLabelBottom:"Drive", 
					callback:"setLevel", 
					valueMultiplier:1,
					dialMinValue:0.1,
					dialMaxValue:1000,
					defaultSetting:500
				},
				{
					name:"Tone",
					knobLabelBottom:"Tone",
					callback:"setTone",
					dialMinValue:0,
					dialMaxValue:3000,
					valueMultiplier:1,
					defaultSetting:1500
				},
				{
					name:"Gain",
					knobLabelBottom:"Gain", 
					callback:"setFeedback", 
					dialMinValue:0, 
					dialMaxValue:1,					
					valueMultiplier:1,
					defaultSetting:0.25
				}]
			});
			this.container.appendChild(this.distortionControl.createControl());		
		}
		if (this.sound.getNodeByName("reverb")) {
			this.reverbControls = new GenericXDialControl(this.sound, { 
				className:"distortionControl", 
				effectName:"Reverb", 
				effectToggle:"On",
				node:"reverb",
				dial:[{
					name:"reverbLevel",
					knobLabelBottom:"Level", 
					callback:"setLevel", 
					valueMultiplier:1, 
					defaultSetting:0.5
				}]

			});		
			let reverbControl = this.reverbControls.createControl();
			this.container.appendChild(reverbControl);
			
			const impulseCanvas = document.createElement("canvas");
			impulseCanvas.style.top = 65;
			impulseCanvas.style.left = 5;
			impulseCanvas.width = 100;
			impulseCanvas.height = 20;
			impulseCanvas.style.position = "relative";
			impulseCanvas.style.borderRadius = "8px";
			const canvasContext = impulseCanvas.getContext('2d');
			
			this.sound.getNodeByName("reverb").value.onImpulseLoaded = (buffer) => {
				this.impulseSpectrum = new FullSpectrum(impulseCanvas, canvasContext, buffer);
				this.reverbControls.container.appendChild(impulseCanvas);
				this.impulseSpectrum.draw();
			}
		}
		
		if (this.sound.getNodeByName("delay")) {
			this.delayControls = new GenericXDialControl(this.sound, { 
				className:"distortionControl", 
				effectName:"Delay", 
				effectToggle:"On", 
				node:"delay",
				dial:[{
					name:"delayTime",
					knobLabelBottom:"Delay", 
					callback:"setDelayTime", 
					dialMinValue:0, 
					dialMaxValue:4,
					valueMultiplier:1,
					defaultSetting:1
				}, 
				{
					name:"Gain",
					knobLabelBottom:"Gain", 
					callback:"setFeedBack", 
					dialMinValue:0.1, 
					dialMaxValue:1,					
					valueMultiplier:1,
					defaultSetting:0.42
				}]
			});
			this.container.appendChild(this.delayControls.createControl());
		}

		if (!this.sound.isStream) {
			this.detuneControl = new GenericXDialControl(this.sound, { 
				className:"distortionControl", 
				effectName:"Detuner", 
				effectToggle:"On", 
				dial:[{
					name:"detuneValue",
					dialMinValue:-1200, 
					dialMaxValue:1200,
					valueMultiplier:1,
					knobLabelBottom:"Detune", 
					callback:"detune",
					defaultSetting:0
				}]
			}); 
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