# jsSoundPlayer
A sound player for browsers that support WebAudio in ES6.

The soundplayer uses only ES6 native functionality and no library dependencies.

#Usage example with loaded sound:

// URL to sound file.
const url = "www.example.com/music.mp3";

// Create an instance of soundplayer.
this.soundPlayer = new SoundPlayer();

// Load a sound
let result = await this.soundPlayer.loadSounds([url]); 
		
// Grab the loaded sound instance and add some sound effects through the Sound API.
result[url].addNode("distortion", new Distortion())
	.addNode("bandFilters", new BandpassFilters())
	.addNode("panner", new Panner())
	.addNode("reverb", new Reverb("./assets/soundeffects/reverb1.wav"))
	.addNode("masterGain", new Gain())
	.addNode("delay", new Delay({ feedback: 0.4, delayTime:1, maxDelayTime:4 }))
	.addNode("compressor", new Compressor());	;		

// Play the sound.
this.soundPlayer.playSound(url, true);


#Usage example with user media (microphone or line-in) sound:

// Create an instance of soundplayer.
this.soundPlayer = new SoundPlayer();

this.soundPlayer.streamSoundInput((sound) => {
	// Grab the input soundstream and add some sound effects through the Sound API.
	sound.addNode("distortion", new Distortion())
		.addNode("bandFilters", new BandpassFilters())
		.addNode("panner", new Panner())
		.addNode("reverb", new Reverb("./assets/soundeffects/reverb1.wav"))
		.addNode("masterGain", new Gain())
		.addNode("delay", new Delay({ feedback: 0.4, delayTime:1, maxDelayTime:4 }))
		.addNode("compressor", new Compressor());	;		

	// Play the soundstream.
	sound.stream();
});		
