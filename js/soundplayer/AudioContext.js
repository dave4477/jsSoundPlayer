let instance;

export default class AudioContext {
	/**
	 * Returns an instance of AudioContext
	 */
	static getInstance() {
		if (!instance) {
			instance = { 
				context:new window.AudioContext() || new window.webkitAudioContext(),
				contextCreatedAt: new Date()
			};
		}
		return instance;
		
	}
}


