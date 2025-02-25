class WLaucher {
	// Config
	_cf: string;
	// Loading element
	_le: string | Element;
	// Loading node
	_ln: Element;
	// CSS
	_cs: string[];
	_ci: number;
	// Scripts
	_js: string[];
	_ji: number;
	// All 
	_cx: string[];
	_jx: string[];

	constructor(config?: string) {
		this._cf = config;
		this._cs = [];
		this._ci = -1;
		this._js = [];
		this._ji = -1;
		this._cx = [];
		this._jx = [];
	}

	get config(): string {
		return this._cf;
	}
	set config(s: string) {
		this._cf = s;
	}

	get loading(): string | Element {
		return this._le;
	}
	set loading(s: string | Element) {
		this._le = s;
	}

	css(href: string, v?: any) {
		if(!href) return;
		if(v) href += '?' + v;
		this._cs.push(href);
	}

	js(src: string, v?: any) {
		if(!src) return;
		if(v) src += '?' + v;
		this._js.push(src);
	}

	create(node: string | Element, tag?: string, id?: string, cs?: string, st?: string, inner?: string | Element): Element {
		if (!tag) tag = 'div';
		if (id) {
			let c = document.getElementById(id);
			if(c) return c;
		}
		let n: Element;
		if (typeof node == 'string') {
			n = document.getElementById(node);
			if (!n) n = document.querySelector(node);
		}
		else {
			n = node;
		}
		if (!n) return null;
		let e = document.createElement(tag);
		if (id) e.setAttribute('id', id);
		if (cs) e.setAttribute('class', cs);
		if (st) e.setAttribute('style', st);
		if (inner) {
			if(typeof inner == 'string') {
				e.innerHTML = inner;
			}
			else {
				e.append(inner);
			}
		}
		n.append(e);
		return e;
	}

	clear(node: string | Element): Element {
		let n: Element;
		if (typeof node == 'string') {
			n = document.getElementById(node);
			if (!n) n = document.querySelector(node);
		}
		else {
			n = node;
		}
		n.innerHTML = '';
		return n;
	}

	protected appendLinks() {
		let href = this.nextCss();
		// Se non vi sono ulteriori elementi si richiama la callback
		if(!href) {
			return;
		}
		// Si verifica che non sia gia' presente
		if(this._cx && this._cx.indexOf(href) >= 0) {
			this.appendLinks();
			return;
		}
		// Versionamento
		let vx = href.indexOf('?');
		if(vx) {
			let vk = href.substring(vx + 1);
			let vv = window[vk];
			if(vv) href = href.substring(0, vx + 1) + vv;
		}
		// Si procede con la creazione del tag link
		console.log('Load ' + href + '...');
		let e = document.createElement("link");
		e.rel = "stylesheet";
		e.type = "text/css";
		e.href = href;
		document.head.appendChild(e);
		e.onload = () => {
			this.appendLinks();
		}
		e.onerror = () => {
			console.error(href + ' not loaded.');
			if(this._ln) {
				this._ln.innerHTML = '<span><em>' + href + ' not loaded.</em></span>';
			}
		}
		// Si aggiunge all'array complessivo
		this._cx.push(href);
	}

	protected appendScripts(cb?: () => any) {
		let src = this.nextJs();
		// Se non vi sono ulteriori elementi si richiama la callback
		if(!src) {
			if(cb) {
				if(this._ln) {
					this._ln.innerHTML = '';
				}
				console.log('Scripts callback...');
				cb();
			}
			return;
		}
		// Si verifica che non sia gia' presente
		if(this._jx && this._jx.indexOf(src) >= 0) {
			this.appendScripts(cb);
			return;
		}
		// Versionamento
		let vx = src.indexOf('?');
		if(vx) {
			let vk = src.substring(vx + 1);
			let vv = window[vk];
			if(vv) src = src.substring(0, vx + 1) + vv;
		}
		// Si procede con la creazione del tag script
		console.log('Load ' + src + '...');
		let e = document.createElement("script");
		e.type = "text/javascript";
		e.src = src;
		document.head.appendChild(e);
		e.onload = () => {
			this.appendScripts(cb);
		}
		e.onerror = () => {
			console.error(src + ' not loaded.');
			if(this._ln) {
				this._ln.innerHTML = '<span><em>' + src + ' not loaded.</em></span>';
			}
		}
		// Si aggiunge all'array complessivo
		this._jx.push(src);
	}

	nextCss(): string {
		this._ci++;
		let lc = this._cs.length;
		if(lc && this._ci >= lc) return '';
		return this._cs[this._ci];
	}

	nextJs(): string {
		this._ji++;
		let lj = this._js.length;
		if(lj && this._ji >= lj) return '';
		return this._js[this._ji];
	}

	start(cb: () => any) {
		// Inizializzazione indici
		this._ci = -1;
		this._ji = -1;
		this._cx = [];
		this._jx = [];
		// Risoluzione elemento di loading
		this._ln = null;
		if(this._le) {
			if (typeof this._le == 'string') {
				this._ln = document.getElementById(this._le);
				if (!this._ln) this._ln = document.querySelector(this._le);
			}
			else {
				this._ln = this._le;
			}
		}
		if(this._ln) {
			this._ln.innerHTML = '<span><em>Loading...</em></span>';
		}
		// Si caricano tutti i css e script presenti per effettuare il controllo.
		let ls = document.getElementsByTagName('link');
		for (let i = 0; i < ls.length; i++) {
			if(ls[i].href) this._cx.push(ls[i].href);
		}
		let ss = document.getElementsByTagName('script');
		for (let i = 0; i < ss.length; i++) {
			if(ss[i].src) this._jx.push(ss[i].src)
		}
		// Avvio applicazione
		window.addEventListener("load", () => {
			if(this._cf && this._jx.indexOf(this._cf) < 0) {
				let src = this._cf + '?' + Date.now();
				console.log('Load ' + src + '...');
				let e = document.createElement("script");
				e.type = "text/javascript";
				e.src = src;
				document.head.appendChild(e);
				e.onload = () => {
					this.appendLinks();
					this.appendScripts(cb);
				}
				e.onerror = () => {
					console.error(src + ' not loaded.');
					if(this._ln) {
						this._ln.innerHTML = '<span><em>' + src + ' not loaded.</em></span>';
					}
				}
			}
			else {
				this.appendLinks();
				this.appendScripts(cb);
			}
		});
	}
}
