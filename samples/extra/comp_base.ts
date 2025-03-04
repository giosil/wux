namespace APP {
	
	export class Breadcrumb extends WUX.WComponent<string, string[]> {
		home: string;
		lhtm: string;
		leid: string;

		constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
			super(id ? id : '*', 'Breadcrumb', '/', classStyle, style, attributes);
			this.rootTag = 'nav';
		}
		
		add(link: string): this {
			if(!this.state) this.state = [];
			if(link) this.state.push(link);
			return this;
		}

		status(t: string, cls: string = 'bg-primary'): this {
			if(!this.leid) return this;
			if(!this.lhtm) this.lhtm = '';
			let l = document.getElementById(this.leid);
			let h = t ? ' <span class="badge ' + cls + '" style="margin-left:0.5rem;">' + t + '</span>' : '';
			if(l) l.innerHTML = this.lhtm + h;
			return this;
		}
		
		render() {
			if(!this.home) this.home = '/';
			if(!this._classStyle) this._classStyle = 'mb-5 breadcrumb-container';
			if(!this.props) this.props = '/';
			let s = this._style ? ' style="' + this._style + '"' : '';
			let a = this._attributes ? ' ' + this._attributes : '';
			let r = '<nav class="' + this._classStyle + '" aria-label="breadcrumb"' + s + a + '>';
			r += '<ol class="breadcrumb"><li class="breadcrumb-item"><a href="' + this.home + '">Homepage</a><span class="separator">/</span></li>';
			if(this.state) {
				let l = this.state.length;
				for(let i = 0; i < l; i++) {
					let e = this.state[i];
					let s = i < l - 1 ? '<span class="separator">/</span>' : '';
					if(l[0] == '<') {
						r += '<li class="breadcrumb-item" id="' + this.id + '-' + i + '">' + e + s + '</li>';
					}
					else {
						r += '<li class="breadcrumb-item"><a href="#" id="' + this.id + '-' + i + '">' + e + s + '</a></li>';
					}
					if(i == l - 1) {
						this.lhtm = e;
						this.leid = this.id + '-' + i;
					}
				}
			}
			r += '</ol></nav>';
			return r;
		}
	}
	
	// Props: Numero di pagine
	// State: Pagina corrente
	export class ResPages extends WUX.WComponent<number, number> {
		max: number;
		
		constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
			super(id ? id : '*', 'ResPages', 0, classStyle, style, attributes);
			this.rootTag = 'nav';
			this.max = 5;
		}
		
		refresh(rows: number, lim: number, tot: number, curr: number): this {
			// rows non viene utilizzato, ma viene lasciato in caso lo si voglia mostrare 
			if(!tot) return this.clear();
			
			let pages = Math.floor(tot / lim);
			let rem = tot % lim;
			if(rem > 0) pages++;
			
			this.state = curr;
			this.props = pages;
			this.forceUpdate();
			return this;
		}
		
		public clear(): this {
			this.state = 0;
			this.props = 0;
			this.forceUpdate();
			return this;
		}
		
		protected updateState(nextState: number): void {
			if(this.state) {
				let ap = document.getElementById(this.id + '-' + this.state);
				if(ap) {
					WUX.removeClassOf(ap.parentElement, 'active');
				}
			}
			
			if(!nextState) nextState = 1;
			super.updateState(nextState);
			
			let an = document.getElementById(this.id + '-' + nextState);
			if (an) {
				WUX.addClassOf(an.parentElement, 'active');
			}
		}
		
		protected componentDidMount(): void {
			if(this.props < 1) {
				this.root.innerHTML = '<nav id="' + this.id+ '" class="pagination-wrapper" aria-label="Paginazione"></nav>';
				return;
			}
			let r: string = '<nav id="' + this.id+ '" class="pagination-wrapper" aria-label="Paginazione">';
			r += '<ul class="pagination">';
			if(this.state == 1) {
				r += '<li class="page-item disabled">' + this.getBtnPrev() + '</li>';
			}
			else {
				r += '<li class="page-item">' + this.getBtnPrev() + '</li>';
			}
			if(this.max > 0 && this.props > this.max) {
				let b = this.state - (this.max - 2);
				if(b < 2) {
					b = 1;
				}
				else {
					let x = this.props - this.max + 1;
					if(b > x) b = x;
				}
				for(let i = b; i < b + this.max; i++) {
					r += this.getPageItem(i, i == this.state);
				}
			}
			else {
				for(let i = 1; i <= this.props; i++) {
					r += this.getPageItem(i, i == this.state);
				}
			}
			if(this.state == this.props) {
				r += '<li class="page-item disabled">' + this.getBtnNext() + '</li>';
			}
			else {
				r += '<li class="page-item">' + this.getBtnNext() + '</li>';
			}
			r += '</ul></nav>';
			this.root.innerHTML = r;
			
			let ap = document.getElementById(this.id + '-p');
			if (ap) {
				ap.addEventListener("click", (e: PointerEvent) => {
					let cs = this.state;
					if(cs > 1) cs--;
					this.setState(cs);
				});
			}
			let an = document.getElementById(this.id + '-n');
			if (an) {
				an.addEventListener("click", (e: PointerEvent) => {
					let cs = this.state;
					if(cs < this.props) cs++;
					this.setState(cs);
				});
			}
			
			for(let i = 1; i <= this.props; i++) {
				let a = document.getElementById(this.id + '-' + i);
				if (!a) continue;
				a.addEventListener("click", (e: PointerEvent) => {
					this.setState(i);
				});
			}
		}
		
		getBtnPrev() {
			return '<button id="' + this.id + '-p" class="page-link" aria-label="Precedente"><span aria-hidden="true"><i class="fa fa-angle-left fa-lg"></i></span><span class="sr-only">Precedente</span></button>';
		}
		
		getBtnNext() {
			return '<button id="' + this.id + '-n" class="page-link" aria-label="Successiva"><span aria-hidden="true"><i class="fa fa-angle-right fa-lg"></i></span><span class="sr-only">Successiva</span></button>';
		}
		
		getPageItem(i: number, a?: boolean, t?: string) {
			if(!t) t = '' + i;
			if(a) return '<li id="' + this.id + '-' + i + '" class="page-item" style="cursor:pointer;"><button aria-current="true" class="page-link" title="Pagina ' + i + '">' + t + '</button></i>';
			return '<li id="' + this.id + '-' + i + '" class="page-item" style="cursor:pointer;"><button class="page-link" title="Pagina ' + i + '">' + t + '</button></i>';
		}
	}
	
	// Props: Numero di pagine
	// State: Pagina corrente
	export class BtnPages extends WUX.WComponent<number, number> {
		constructor(id?: string) {
			super(id ? id : '*', 'BtnPages');
		}
		
		refresh(page: number, pages: number): void {
			this.state = page;
			this.props = pages
			this.forceUpdate();
			return;
		}
		
		protected updateState(n: number): void {
			let p = document.getElementById(this.id + '-' + this.state);
			if (p) WUX.removeClassOf(p, 'active');
			super.updateState(n);
			let a = document.getElementById(this.id + '-' + this.state);
			if (a) WUX.addClassOf(a, 'active');
		}
		
		render() {
			if(!this.props) {
				return '<div id="' + this.id + '"></div>';
			}
			if(!this.state) this.state = 1;
			
			let items = '';
			for(let i = 1; i <= this.props; i++) {
				items += '<li><a id="' + this.id + '-' + i + '" class="list-item" style="cursor:pointer;">Pagina ' + i + '</a></li>';
			}
			let r = '<div id="' + this.id + '" class="page-dropdown dropdown">';
			r += dropdownBtn(this.id, 'Pagina ' + this.state + ' di ' + this.props, items);
			r += '</div>';
			return r;
		}
		
		protected componentDidMount(): void {
			let a = document.getElementById(this.id + '-' + this.state);
			if (a) WUX.addClassOf(a, 'active');
			for(let i = 1; i <= this.props; i++) {
				let a = document.getElementById(this.id + '-' + i);
				if (!a) continue;
				a.addEventListener("click", (e: PointerEvent) => {
					console.log('[BtnPages] click (i=' + i + ')', e);
					this.setState(i);
				});
			}
		}
	}
	
	// State: numero di elementi per pagina
	export class BtnItems extends WUX.WComponent<number, number> {
		IPP: number[] = [5, 10, 20, 50, 100];
		
		constructor(id?: string) {
			super(id ? id : '*', 'BtnItems');
			this.state = this.IPP[0];
		}
		
		render() {
			if(!this.state) this.state = this.IPP[0];
			
			let items = '';
			for(let i = 0; i < this.IPP.length; i++) {
				let v = this.IPP[i];
				items += '<li><a id="' + this.id + '-' + v + '" class="list-item" style="cursor:pointer;">' + v + ' elementi</a></li>';
			}
			let r = '<div class="page-dropdown dropdown">';
			r += dropdownBtn(this.id, 'Elementi per Pagina', items);
			r += '</div>';
			return r;
		}
		
		protected updateState(n: number): void {
			let p = document.getElementById(this.id + '-' + this.state);
			if (p) WUX.removeClassOf(p, 'active');
			super.updateState(n);
			let a = document.getElementById(this.id + '-' + this.state);
			if (a) WUX.addClassOf(a, 'active');
		}
		
		protected componentDidMount(): void {
			let a = document.getElementById(this.id + '-' + this.state);
			if (a) WUX.addClassOf(a, 'active');
			for(let i = 0; i < this.IPP.length; i++) {
				let v = this.IPP[i];
				let a = document.getElementById(this.id + '-' + v);
				if (!a) continue;
				a.addEventListener("click", (e: PointerEvent) => {
					console.log('[BtnItems] click (v=' + v + ')', e);
					this.setState(v);
				});
			}
		}
	}

	export class DlgConfirm extends WUX.WDialog<string, boolean> {
		_msg: string;

		constructor(id?: string, msg?: string) {
			super(id ? id : '*', 'DlgConfirm');
			
			this.title = "Conferma";
			this._msg = msg;
			if(!this._msg) this._msg = "Si vuole procedere con l'operazione?";
			
			this.body.addRow().addCol('12').add(this._msg);
		}

		get message(): string {
			return this._msg;
		}
		set message(s: string) {
			this._msg = s;
			if(!this._msg) this._msg = "Si vuole procedere con l'operazione?";
			let em = this.body.getElement(0, 0);
			if(em) em.innerText = this._msg;
		}

		protected buildBtnOK(): WUX.WButton {
			return new WUX.WButton(this.subId('bfo'), 'S&igrave;', '', 'btn btn-primary button-sm', '', '');
		}

		protected buildBtnCancel(): WUX.WButton {
			return new WUX.WButton(this.subId('bfc'), 'No', '', 'btn btn-secondary button-sm', '', '');
		}
	}
}