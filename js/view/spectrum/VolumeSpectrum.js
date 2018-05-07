import AbstractSpectrum from "./AbstractSpectrum.js";

export default class VolumeSpectrum extends AbstractSpectrum {
	constructor(canvas, context, player) {
		super(canvas, context, player);
		
		this.colors = [];
		this.out_data = [];
		
		this.img_data = this.context.createImageData(this.canvas.width, this.canvas.height);
		this.data_width = this.img_data.width,
		this.data_height = this.img_data.height,
    
		this.prepare_palette();
		
		// allocating array with zeros
		this.out_data = this.new_filled_array(this.data_width * this.data_height, 0)
		
		//setInterval(drawScene, 30); // loop drawScene
	}
		
		
	new_filled_array(len, val) {
		var rv = new Array(len);
		while (--len >= 0) {
			rv[len] = val;
		}
		return rv;
	}
	
	prepare_palette() {
		for (var i = 0; i < 64; ++i) {
			this.colors[i + 0] = {r: 0, g: 0, b: i << 1, a: i};
			this.colors[i + 64] = {r: i << 3, g: 0, b: 128 - (i << 2), a: i+64};
			this.colors[i + 128] = {r: 255, g: i << 1, b: 0, a: i+128};
			this.colors[i + 192] = {r: 255, g: 255, b: i << 2, a: i+192};
		}
	}

	draw() {
		super.draw();
		
		
		this.data.analyser.fftSize = 2048;

		let randomArray = [];
		for (let i = 0; i < this.data.dataArray.length; i++) {
			const barHeight = Math.abs((this.data.dataArray[i] + 140) / 100);
			randomArray.push(barHeight);
		}
		
		var data_cnt = this.data_width * (this.data_height - 1);
		for (var i = 0; i < this.data_width; i++) {
			this.out_data[data_cnt + i] = (randomArray[i] > Math.random()) ? 255 : 0;
		}
		for (var y = 0; y < 200; y++){
			for (var x = 0; x < this.data_width; x++){
				var s = data_cnt + x;
				var temp_data = this.out_data[s] + this.out_data[s + 1] + this.out_data[s - 1] + this.out_data[s - this.data_width];
				temp_data >>= 2;
				if (temp_data > 1){
					temp_data -= 1;
				}
				temp_data <<= 0;
				this.out_data[s - this.data_width] = temp_data;
				var id = s << 2;
				this.img_data.data[id + 0] = this.colors[temp_data].r; // red
				this.img_data.data[id + 1] = this.colors[temp_data].g; // green
				this.img_data.data[id + 2] = this.colors[temp_data].b; // blue
				this.img_data.data[id + 3] = this.colors[temp_data].a; // alpha
			}
			data_cnt -= this.data_width;
		}
		// draw result data
		this.context.putImageData(this.img_data, 0, 0);
	}
}