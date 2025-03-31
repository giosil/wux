namespace APP {

	export interface WChartData {
		labels?: string[];
		titles?: string[];
		series?: number[][];
		styles?: string[];
		type?: string;
	}

	/** 
		Chart Component.
		P: string - Chart type (bar, line)
		S: WChartData - Chart data
	*/
	export class WChart extends WUX.WComponent<string, WChartData> {
		fontName: string;
		fontSize: number;
		axis: string;
		grid: string;
		line: string;
		offx: number;
		offy: number;
		maxy: number;
		barw: number;
		_w: number;
		_h: number;

		constructor(id?: string, type?: string, classStyle?: string, style?: string | WUX.WStyle) {
			super(id ? id : '*', 'WChart', type, classStyle, style);
			this.rootTag = 'canvas';
			this.forceOnChange = true;

			let iw = window.innerWidth;
			this._w = 750;
			this._h = 370;
			if(iw < 900 || iw > 1920) {
				this._w = Math.round(750 * iw / 1400);
				this._h = Math.round(370 * this._w / 750);
			}
			this._attributes = 'width="' + this._w + '" height="' + this._h + '"';

			this.fontSize = 14;
			this.fontName = 'Arial';
			this.axis = '#808080';
			this.grid = '#a0a0a0';
			this.line = '#e23222';
			this.offx = 30;
			this.offy = 30;
			this.barw = 16;
		}

		size(width: number, height: number): this {
			this._w = width;
			this._h = height;
			if(this._w < 40) this._w = 40;
			if(this._h < 40) this._h = 40;
			this._attributes = 'width="' + this._w + '" height="' + this._h + '"';
			return this;
		}

		get width(): number {
			return this._w;
		}
		set width(v: number) {
			this._w = v;
			if(this._w < 40) this._w = 40;
			this._attributes = 'width="' + this._w + '" height="' + this._h + '"';
		}

		get height(): number {
			return this._h;
		}
		set height(v: number) {
			this._h = v;
			if(this._h < 40) this._h = 40;
			this._attributes = 'width="' + this._w + '" height="' + this._h + '"';
		}

		protected componentDidMount(): void {
			// Get data
			if(!this.state) return;
			let s = this.state.series;
			if(!s || !s.length) return;
			let d0 = s[0];
			if(!d0 || d0.length < 2) return;
			let cs = this.state.styles;
			
			// Get Context
			let r = this.root as HTMLCanvasElement;
			let ctx = r.getContext('2d');
			if(!ctx) return;
			
			// Check labels (arguments)
			let labels = this.state.labels;
			let pady = 0;
			let padx = 0;
			let drawL = false;
			if(labels && labels.length == d0.length) {
				let t0 = labels[0];
				let l0 = t0 ? t0.length : 0;
				let dl = l0 > 4 ? Math.ceil(l0 / 2) : 2;
				pady = this.fontSize * dl + 4;
				padx = this.fontSize * 2 + 4;
				drawL = true;
			}
			
			// Boundary
			let cw = r.width - this.offx - padx;
			let ch = r.height - this.offy - pady;
			let bw = cw / (d0.length - 1);
			// Max Y
			let my = Math.max(...d0);
			if(!my) my = 4;
			if(this.maxy && this.maxy > my) {
				my = this.maxy;
			}
			// Intermediate Y
			let iy = [Math.round(my / 4), Math.round(my / 2), Math.round(my * 3 / 4)];
			// Step Y
			let sy = ch / my;
			
			// Axis
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = this.axis;
			// Origin
			ctx.moveTo(this.offx, this.offy);
			// Y
			ctx.lineTo(this.offx, r.height - pady);
			// X
			ctx.lineTo(r.width - padx, r.height - pady);
			ctx.stroke();
			
			// Grid
			ctx.beginPath();
			ctx.setLineDash([4, 8]);
			ctx.lineWidth = 1;
			ctx.strokeStyle = this.grid;
			for (let i = 1; i < d0.length; i++) {
				let x = this.offx + i * bw;
				// X
				ctx.moveTo(x, this.offy);
				ctx.lineTo(x, r.height - pady);
			}
			// Max Y
			ctx.moveTo(this.offx, this.offy);
			ctx.lineTo(r.width - padx, this.offy);
			// Intermediate Y
			for(let vy of iy) {
				ctx.moveTo(this.offx, r.height - pady - (vy * sy));
				ctx.lineTo(r.width - padx, r.height - pady - (vy * sy));
			}
			ctx.stroke();
			
			// Labels
			ctx.fillStyle = this.axis;
			ctx.font = this.fontSize + 'px ' + this.fontName;
			ctx.fillText('0', 0, r.height - pady);
			for(let vy of iy) {
				ctx.fillText('' + vy, 0, r.height - pady - (vy * sy));
			}
			ctx.fillText('' + my, 0, this.offy);
			
			if(drawL) {
				for (let i = 0; i < labels.length; i++) {
					let x = this.offx + i * bw;
					// Etichetta inclinata sull'asse X
					ctx.save();
					ctx.translate(x - this.fontSize, r.height);
					ctx.rotate(-Math.PI / 3);
					ctx.fillStyle = this.axis;
					ctx.fillText(labels[i], 0, 0);
					ctx.restore();
				}
			}
			
			// Chart
			let type = this.props;
			if(!type) type = this.state.type;
			if(!type) type = 'line';
			if(type != 'bar') {
				ctx.setLineDash([]);
				for(let j = 0; j < s.length; j++) {
					let dj = s[j];
					// Mind this: < d0.length
					if(!dj || dj.length < d0.length) return;
					let sl = this.line;
					if(cs && cs.length > j) {
						sl = cs[j];
						if(!sl) sl = this.line;
					}
					
					ctx.beginPath();
					ctx.lineWidth = 2;
					ctx.strokeStyle = sl;
					ctx.moveTo(this.offx, r.height - pady - (dj[0] * sy));
					// Mind this: < d0.length
					for (let i = 1; i < d0.length; i++) {
						let x = this.offx + i * bw;
						let y = r.height - pady - (dj[i] * sy);
						ctx.lineTo(x, y);
					}
					ctx.stroke();
				}
			}
			else {
				if(this.barw < 4) this.barw = 4;
				for(let j = 0; j < s.length; j++) {
					let dj = s[j];
					// Mind this: < d0.length
					if(!dj || dj.length < d0.length) return;
					let sl = this.line;
					if(cs && cs.length > j) {
						sl = cs[j];
						if(!sl) sl = this.line;
					}
					ctx.fillStyle = sl;
					let sx = j * (this.barw + 1);
					// Mind this: < d0.length
					for (let i = 0; i < d0.length; i++) {
						let x = this.offx + i * bw;
						let y = r.height - pady - (dj[i] * sy);
						if(i == 0) {
							// Review first bar drawing!
							ctx.fillRect(x + sx, y, this.barw, dj[i] * sy);
						}
						else if(s.length < 3) {
							ctx.fillRect(x + sx - (this.barw / 2), y, this.barw, dj[i] * sy);
						}
						else {
							ctx.fillRect(x + sx - (this.barw / 2) - ((this.barw + 1) * (s.length - 2)), y, this.barw, dj[i] * sy);
						}
					}
				}
			}
		}
	}
}