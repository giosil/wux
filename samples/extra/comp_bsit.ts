namespace APP {

	import WUtil = WUX.WUtil;

	export class Card extends WUX.WComponent<string, number> {
		bcls: string;
		title: string;
		text: string;
		icon: string;
		label: string;
		link: string;
		badge: boolean;

		constructor(id?: string, badge?: boolean, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
			super(id ? id : '*', 'Card', 'card', classStyle, style, attributes);
			this.badge = badge;
		}

		set(key?: string, title?: string, text?: string, icon?: string, link?: string, val?: number): this {
			this.props = key;
			this.title = title;
			this.text = text;
			this.icon = icon;
			this.link = link;
			this.state = val;
			return this;
		}

		render() {
			if (!this._classStyle) this._classStyle = 'card border-0 shadow-lg rounded-4 p-3';
			if (!this.bcls) this.bcls = 'card-body text-center';
			let s = this._style ? ' style="' + this._style + '"' : '';
			let r = '';
			r += '<div class="card-wrapper card-space">';
			r += '<div class="' + this._classStyle + '"' + s + '>';
			r += '<div class="' + this.bcls + '">';
			if (this.icon) {
				r += '<div class="icon-wrapper mb-3">';
				r += '<span class="icon-circle bg-light-primary text-primary"><i class="' + this.icon + '"></i></span>';
				r += '</div>';
			}
			if (this.title) {
				let b = '';
				if (this.badge) {
					if (this.state == null) {
						b = ' <span id="' + this.id + '-b" class="badge bg-warning" style="display:none;"></span>';
					}
					else if (this.state < 1) {
						b = ' <span id="' + this.id + '-b" class="badge bg-danger">' + this.state + '</span>';
					}
					else if(this.state > 0) {
						b = ' <span id="' + this.id + '-b" class="badge bg-primary">' + this.state + '</span>';
					}
				}
				r += '<h5 class="card-title fw-bold">' + this.title + b + '</h5>';
			}
			if (this.text) {
				r += '<p class="card-text text-muted">' + this.text + '</p>';
			}
			if (this.link) {
				if (!this.label) this.label = 'Esplora';
				r += '<a class="btn btn-primary btn-sm rounded-pill px-4 mt-2" href="' + this.link + '">';
				r += this.label + ' <i class="fas fa-arrow-right ms-2"></i>';
				r += '</a>';
			}
			r += '</div></div></div>';
			return r;
		}

		protected updateState(nextState: number): void {
			super.updateState(nextState);
			let b = document.getElementById(this.id + '-b');
			if (!b) return;
			if (this.state == null) {
				b.className = 'badge bg-danger';
				b.innerText = '';
				b.setAttribute('style', 'display:none;');
			}
			else if (this.state < 1) {
				b.className = 'badge bg-danger';
				b.innerText = '' + this.state;
				b.setAttribute('style', '');
			}
			else if(this.state > 0) {
				b.className = 'badge bg-primary';
				b.innerText = '' + this.state;
				b.setAttribute('style', '');
			}
		}
	}

	export class MenuList extends WUX.WComponent<string, number> {
		main: WUX.WContainer;
		items: string[];
		values: number[];
		bstyle: string;
		
		constructor(id?: string, noSelText?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
			super(id ? id : '*', 'MenuList', noSelText, classStyle, style, attributes);
		}
		
		protected updateState(nextState: number): void {
			// Previous element
			let ep : Element;
			if(this.state == -1) {
				ep = document.getElementById(this.subId('la'));
			}
			else {
				ep = document.getElementById(this.subId('' + this.state));
			}
			if(ep) ep.setAttribute('style', 'font-size:1.1rem;cursor:pointer;text-decoration:underline !important;');
			this.state = nextState;
			// Current element
			let ec : Element;
			if(this.state == -1) {
				ec = document.getElementById(this.subId('la'));
			}
			else {
				ec = document.getElementById(this.subId('' + this.state));
			}
			if(ec) ec.setAttribute('style', 'font-size:1.1rem;cursor:auto;text-decoration:none !important;font-weight:bold;');
		}
		
		text(allItemsText?: string): string {
			if (this.state == null) return '';
			if (this.state < 0) {
				if (allItemsText != null) return allItemsText;
				return this.props;
			}
			if (!this.items || this.items.length <= this.state) return '';
			return this.items[this.state];
		}

		badges(values: number[]) {
			this.values = values;
			if(!values || !values.length) {
				this.clear();
				return;
			}
			for(let i = 0; i < this.items.length; i++) {
				let b = document.getElementById(this.subId('' + i + '-b'));
				if (!b) continue;
				let v = values[i];
				if (v) {
					b.setAttribute('style', this.bstyle);
					b.innerText = '' + v;
				}
				else {
					b.setAttribute('style', this.bstyle + 'display:none;');
					b.innerText = '';
				}
			}
		}

		clear() {
			for(let i = 0; i < this.items.length; i++) {
				let b = document.getElementById(this.subId('' + i + '-b'));
				if (!b) continue;
				b.setAttribute('style', this.bstyle + 'display:none;');
				b.innerText = '';
			}
		}
		
		render() {
			if (!this.values) this.values = [];
			if (!this.bstyle) this.bstyle = 'margin-left:0.6rem;';
			this.state = -1;
			this.main = new WUX.WContainer(this.id, this._classStyle, this._style, this._attributes);
			if(this.props) {
				let la = new WUX.WLink(this.subId('la'), this.props, '', '', 'font-size:1.1rem;cursor:auto;text-decoration:none !important;font-weight:bold;');
				la.on('click', (e: PointerEvent) => {
					this.setState(-1);
				});
				this.main.addRow().addCol('12').add(la).addRow().addCol('12').add('<hr>');
			}
			if(!this.items) this.items = [];
			for(let i = 0; i < this.items.length; i++) {
				let s = this.items[i];
				let l = new WUX.WLink(this.subId('' + i), s, '', '', 'font-size:1.1rem;cursor:pointer;text-decoration:underline !important;');
				l.on('click', (e: PointerEvent) => {
					let x = WUtil.toNumber(WUX.lastSub(e.target), -1);
					if(x < 0) return;
					this.setState(x);
				});
				this.main.addRow().addCol('12').add(l);
				let v = this.values[i];
				if (v) {
					this.main.add('<span id="' + this.subId('' + i) + '-b" class="badge bg-primary" style="' + this.bstyle + '">' + v + '</span>')
				}
				else {
					this.main.add('<span id="' + this.subId('' + i) + '-b" class="badge bg-primary" style="' + this.bstyle + 'display:none;"></span>')
				}
			}
			return this.main;
		}
	}

	//                                            desc,   base64
	export class WAllegato extends WUX.WComponent<string, string> {

		constructor(id?: string, desc?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object, href?: string, target?: string) {
			// WComponent init
			super(id ? id : '*', 'WAllegato', desc, classStyle, style, attributes);
			this.rootTag = 'a';
		}

		protected render() {
			if (!this._style) this._style = 'cursor:pointer;font-size:1.2rem;position:relative;top:0.4rem;';
			if (!this._classStyle) this._classStyle = 'text-primary';
			let html = '';
			if (!this.props) this.props = 'Allegato';
			if (this.state) {
				html += WUX.buildIcon('fa-file', '', ' ') + this.props;
			}
			else {
				html += "(Nessun allegato presente)"
			}
			return this.build(this.rootTag, html);
		}

		set(o: any, kb64: string, kp: string, pf: string): this {
			if (!o) return this;
			if (kp) {
				pf = pf ? pf + ' ' : '';
				this.setProps(pf + WUtil.getString(o, kp, ''));
			}
			if (kb64) {
				this.setState(WUtil.getString(o, kb64));
			}
			return this;
		}

		protected updateState(nextState: string): void {
			super.updateState(nextState);
			if (!this.root) return;
			let html = '';
			if (nextState) {
				if (!this.props) this.props = 'Allegato';
				html += WUX.buildIcon('fa-file', '', ' ') + this.props;
				this.root.setAttribute('title', 'Scarica allegato');
			}
			else {
				html += "(Nessun allegato presente)"
				this.root.setAttribute('title', 'Nessun allegato presente');
			}
			this.root.innerHTML = html;
		}

		protected updateProps(nextProps: any): void {
			super.updateProps(nextProps);
			if (!this.root) return;
			if (!this.props) this.props = 'Allegato';
			if (!this.state) {
				this.root.innerHTML = "(Nessun allegato presente)";
			}
			else {
				this.root.innerHTML = WUX.buildIcon('fa-file', '', ' ') + this.props;
			}
		}

		protected componentDidMount(): void {
			if (!this.root) return;
			if (this.state) {
				this.root.setAttribute('title', 'Scarica allegato');
			}
			else {
				this.root.setAttribute('title', 'Nessun allegato presente');
			}
			this.root.addEventListener('click', (e: MouseEvent) => {
				if (!this.state) {
					showWarning('Nessun allegato presente.');
					return;
				}
				if (!this.props) this.props = 'Allegato';
				let n = this.props + '.pdf'
				// Converte Base 64 in Blob e quindi in File
				let b = Uint8Array.from(atob(this.state), c => c.charCodeAt(0));
				let f = new File([b], n, {type: 'application/pdf'});
				saveAs(f);
			});
		}
	}
}