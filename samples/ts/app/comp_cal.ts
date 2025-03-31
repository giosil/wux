namespace APP {

	import WUtil = WUX.WUtil;

	export class WCalendar extends WUX.WComponent<number, Date> {
		// Element previous
		ep: HTMLElement;
		// Element month
		em: HTMLElement;
		// Element next
		en: HTMLElement;
		// Prev month
		pm: string;
		// Next month
		nm: string;
		// Element table
		et: HTMLElement;
		// Element table body
		eb: HTMLElement;
		// Class table
		ct: string;
		// Class div table
		cd: string;
		// Style previous
		sp: string;
		// Style month
		sm: string;
		// Style next
		sn: string;
		// Row (<tr>) style
		tr: string
		// Style week day
		sw: string;
		// Style day
		sd: string;
		// Style day over
		so: string;
		// Style day selected
		ss: string;
		// Style day marked
		sk: string;
		// Style empty
		se: string;
		// Style today
		st: string;
		// Today
		td: string;

		// Array of marker
		am: string[] = [];
		// Map date - title
		mt: {[k: string]: string} = {};
		// Last state (converted to string)
		ls: string;

		constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
			// WComponent init
			super(id ? id : '*', 'WCalendar', 1, classStyle, style, attributes);
			// Prev month
			this.pm = 'Mese precedente';
			// Next month
			this.nm = 'Mese successivo';
			// Class table
			this.ct = 'table table-sm';
			// Class div table
			this.cd = 'table-responsive';
			// Style previous
			this.sp = 'padding:1rem;text-align:center;font-weight:bold;background-color:#eeeeee;';
			// Style month
			this.sm = this.sp;
			// Style next
			this.sn = this.sp;
			// Row (<tr>) style
			this.tr = 'height:3rem;';
			// Style week day
			this.sw = 'text-align:center;';
			// Style day
			this.sd = 'text-align:center;vertical-align:middle;';
			// Style day over
			this.so = 'text-align:center;vertical-align:middle;background-color:#f6f6f6;cursor:pointer;';
			// Style day selected (table-primary)
			this.ss = 'text-align:center;vertical-align:middle;background-color:#b8d4f1;'; 
			// Style day marked (table-warning)
			this.sk = 'text-align:center;vertical-align:middle;background-color:#ffeebc;';
			// Style empty
			this.se = 'background-color:#f0f0f0;';
			// Style today
			this.st = 'font-weight:bold;';
			// Today
			this.td = this.str(new Date());
		}

		onDoubleClick(handler: (e: WUX.WEvent) => any): void {
			if (!this.handlers['_doubleclick']) this.handlers['_doubleclick'] = [];
			this.handlers['_doubleclick'].push(handler);
		}

		protected updateState(nextState: Date): void {
			this.state = nextState;
			if(!this.state) this.state = new Date();
			let d = this.state.getDate();
			let m = this.state.getMonth();
			let y = this.state.getFullYear();
			this.ls = (y * 10000 + (m + 1) * 100 + d) + '';
		}

		protected render() {
			if(!this.state) this.state = new Date();
			// Build table
			let t = '<table id="' + this.subId('t') + '" class="' + this.ct + '"><thead><tr>';
			for(let x = 0; x < 7; x++) {
				let k = x == 6 ? 0 : x + 1;
				t += '<th id="' + this.subId(k + '') + '" style="' + this.sw + '">' + WUX.formatDay(k, false) + '</th>'; 
			}
			t += '</tr></thead><tbody id="' + this.subId('b') + '">';
			t += this.body();
			t += '</tbody></table>';
			// Build component
			let m = this.state.getMonth();
			let y = this.state.getFullYear();
			let k = y * 100 + m + 1;
			let p = '<a id="' + this.subId('p') + '" title="' + this.pm + '"><i class="fa fa-arrow-circle-left"></i></a>';
			let n = '<a id="' + this.subId('n') + '" title="' + this.nm + '"><i class="fa fa-arrow-circle-right"></i></a>';
			let i = '<div class="row"><div class="col-2" style="' + this.sp + '">' + p + '</div><div id="' + this.subId('m') + '" class="col-8" style="' + this.sm + '">' + WUX.formatMonth(k, true, true) + '</div><div class="col-2" style="' + this.sn + '">' + n + '</div></div>';
			if(this.cd) {
				i += '<div class="row"><div class="' + this.cd + '">' + t + '</div></div>';
			}
			else {
				i += '<div class="row"><div class="col-12">' + t + '</div></div>';
			}
			return this.buildRoot(this.rootTag, i);
		}

		add(a: number): Date {
			if(!this.state) this.state = new Date();
			let d = this.state.getDate();
			let m = this.state.getMonth();
			let y = this.state.getFullYear();
			let r = m + a;
			let n = new Date(y, r, d);
			let nm = n.getMonth();
			if(nm != r) {
				n = new Date(y, r + 1, 0);
				nm = n.getMonth();
			}
			let ny = n.getFullYear();
			// Invocare prima del metodo body
			this.setState(n);
			if(this.eb) {
				this.eb.innerHTML = this.body();
			}
			if(this.em) {
				let w = ny * 100 + nm + 1;
				this.em.innerText = WUX.formatMonth(w, true, true);
			}
			return n;
		}

		mark(...p: any[]): this {
			if(!p || !p.length) return this;
			for(let o of p) {
				let dt = WUtil.toDate(o);
				if(!dt) continue;
				let k = this.str(dt);
				this.am.push(k);
				if(k == this.ls) continue;
				let e = document.getElementById(this.subId(k));
				if(e) e.setAttribute('style', this.sk);
			}
			return this;
		}

		unmark(...p: any[]): this {
			if(!p || !p.length) return this;
			for(let o of p) {
				let dt = WUtil.toDate(o);
				if(!dt) continue;
				let k = this.str(dt);
				this.unm(this.am.indexOf(k));
			}
			return this;
		}

		title(d: any, t: string): this {
			let dt = WUtil.toDate(d);
			if(!dt) return this;
			let k = this.str(dt);
			this.mt[k] = t;
			let e = document.getElementById(this.subId(k));
			if(e) e.setAttribute('title', t);
			return this;
		}

		unm(i: number, r: boolean = true): void {
			if(i < 0) return;
			let k = this.am[i];
			if(!k) return;
			if(r) this.am.splice(i, 1);
			let e = document.getElementById(this.subId(k));
			if(e) {
				let s = this.str(this.state);
				if(s == k) {
					e.setAttribute('style', this.ss);
				}
				else {
					e.setAttribute('style', this.sd);
				}
			}
		}

		clear(): this {
			if(this.am && this.am.length) {
				for(let i = 0; i < this.am.length; i++) {
					this.unm(i, false);
				}
				this.am = [];
			}
			if(this.mt) {
				for(let k in this.mt) {
					let e = document.getElementById(this.subId(k));
					if(e) e.setAttribute('title', null);
				}
				this.mt = {};
			}
			return this;
		}

		prev(): Date {
			return this.add(-1);
		}

		next(): Date {
			return this.add(1);
		}

		ele(dt: Date): HTMLElement {
			if(!dt) return null;
			return document.getElementById(this.subId(this.str(dt)));
		}

		str(dt: Date): string {
			if(!dt) return null;
			return (dt.getFullYear() * 10000 + (dt.getMonth() + 1) * 100 + dt.getDate()) + '';
		}

		from(): string {
			if(!this.state) this.state = new Date();
			let m = this.state.getMonth();
			let y = this.state.getFullYear();
			return (y * 10000 + (m + 1) * 100 + 1) + '';
		}

		to(): string {
			if(!this.state) this.state = new Date();
			let m = this.state.getMonth();
			let y = this.state.getFullYear();
			// Last day
			let n = new Date(y, m + 1, 0);
			let d = n.getDate();
			return (y * 10000 + (m + 1) * 100 + d) + '';
		}

		protected body(): string {
			if(!this.state) this.state = new Date();
			let b = '';
			// Current state
			let d = this.state.getDate();
			let m = this.state.getMonth();
			let y = this.state.getFullYear();
			this.ls = (y * 10000 + (m + 1) * 100 + d) + '';
			// First day of month
			let h = new Date(y, m, 1);
			let w = h.getDay();
			if(w == 0) w = 7;
			// Last day of month
			let j = new Date(y, m + 1, 0);
			let l = j.getDate();
			let z = 1;
			for(let r = 1; r <= 6; r++) {
				if(this.tr) {
					b += '<tr style="' + this.tr + '">';
				}
				else {
					b += '<tr>';
				}
				// rows
				for(let c = 1; c <= 7; c++) {
					// cols
					if(r == 1 && c < w) {
						// empty cell in first row
						b += '<td style="' + this.se + '"></td>';
					}
					else if(z > l) {
						// empty cell in last row
						b += '<td style="' + this.se + '"></td>';
					}
					else {
						let k = (y * 10000 + (m + 1) * 100 + z) + '';
						let t = k == this.td ? this.st : '';
						let a = this.mt[k];
						a = a ? ' title="' + a + '"' : '';
						if(k == this.ls) {
							b += '<td id="' + this.subId(k) + '" style="' + this.ss + t + '"' + a + '>' + z + '</td>';
						}
						else {
							if(this.am.indexOf(k) >= 0) {
								b += '<td id="' + this.subId(k) + '" style="' + this.sk + t + '"' + a + '>' + z + '</td>';
							}
							else {
								b += '<td id="' + this.subId(k) + '" style="' + this.sd + t + '"' + a + '>' + z + '</td>';
							}
						}
						z++;
					}
				}
				b += '</tr>';
				if(z > l) break;
			}
			return b;
		}

		protected componentDidMount(): void {
			this.ep = document.getElementById(this.subId('p'));
			this.em = document.getElementById(this.subId('m'));
			this.en = document.getElementById(this.subId('n'));
			this.et = document.getElementById(this.subId('t'));
			this.eb = document.getElementById(this.subId('b'));
			if(this.ep) {
				this.ep.addEventListener('click', (e) => {
					this.prev();
				});
			}
			if(this.en) {
				this.en.addEventListener('click', (e) => {
					this.next();
				});
			}
			this.root.addEventListener('click', (e) => {
				let s = WUX.lastSub(e.target);
				if(!s) return;
				if(s.length == 8) {
					let n = parseInt(s);
					let t = s == this.td ? this.st : '';
					// Date
					let se = this.ele(this.state);
					if(se) {
						let p = this.str(this.state);
						let q = p == this.td ? this.st : '';
						if(this.am.indexOf(p) >= 0) {
							se.setAttribute('style', this.sk + q);
						}
						else {
							se.setAttribute('style', this.sd + q);
						}
					}
					e.target['style'] = this.ss + t;
					if(this.ls == s) return;
					this.setState(new Date(n / 10000, ((n % 10000) / 100) - 1, (n % 10000) % 100));
				}
			});
			this.root.addEventListener('dblclick', (e) => {
				let s = WUX.lastSub(e.target);
				if(!s) return;
				if(s.length == 8) {
					this.trigger('_doubleclick', s);
				}
			});
			this.root.addEventListener('mouseover', (e) => {
				let s = WUX.lastSub(e.target);
				if(!s) return;
				if(s.length == 8) {
					let t = s == this.td ? this.st : '';
					// Over date
					e.target['style'] = this.so + t;
				}
			});
			this.root.addEventListener('mouseout', (e) => {
				let s = WUX.lastSub(e.target);
				if(!s) return;
				if(s.length == 8) {
					let t = s == this.td ? this.st : '';
					let i = this.str(this.state);
					if(s == i) {
						// Selected date
						e.target['style'] = this.ss + t;
					}
					else {
						if(this.am.indexOf(s) >= 0) {
							// Marked date
							e.target['style'] = this.sk + t;
						}
						else {
							// Normal date
							e.target['style'] = this.sd + t;
						}
					}
				}
			});
		}
	}

}