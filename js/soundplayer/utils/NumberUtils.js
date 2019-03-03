export default class NumberUtils {
	/**
	 * Converts a range of values between another range of values.
	 * If your minimum rotation is 0.1, and your max rotation is 0.9,
	 * you can map those values to any given range. 
	 * @param {Number} value The current value.
	 * @param {Array} r1 The first range of numbers, e.g. [0.1, 0.9]
	 * @param {Array} r2 The second range of numbers to map r1 to, e.g. [0, 10].
	 * @returns {Number} The scaled number.
	 */
	static convertRange( value, r1, r2 ) { 
		return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
	}
}