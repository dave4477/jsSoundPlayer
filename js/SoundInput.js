export default class SoundInput {
	constructor() {
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	}
	
	getUserMedia() {
		if (navigator.getUserMedia) {
			return new Promise((resolve, reject) => {
				navigator.getUserMedia(
				// constraints - only audio needed for this app
				{ audio: true },

				// Success callback
				function(stream) {
					resolve(stream); //return stream;
				},

				// Error callback
				function(err) {
					reject('The following gUM error occured: ' + err);
				}
				);
			});
		}
	}

}