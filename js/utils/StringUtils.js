export default class StringUtils {
	
	static formatTime(timeInSec) {
		timeInSec = parseInt(timeInSec, 10);
		let hrs = Math.floor(timeInSec / 3600);
		let min = Math.floor((timeInSec - (hrs * 3600)) / 60);
		let sec = timeInSec - (hrs * 3600) - (min * 60);

		if (hrs   < 10) { hrs   = "0"+hrs; }
		if (min < 10) { min = "0"+min; }
		if (sec < 10) { sec = "0"+sec; }
		return hrs+':'+min+':'+sec;				
	}
	
	static getFileExtension(fileName) {
		const matches = /\.([a-z]{3,4})$/i.exec(fileName);
		return matches ? matches[1].toLowerCase() : null;
	};
}