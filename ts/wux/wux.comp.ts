namespace WUX {

	export class Wrapp extends WComponent<WElement, any> {
		isText: boolean;
		constructor(props: WElement, tag?: string, id?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
			super(id, 'Wrapp', props, classStyle, style, attributes);
			if(tag) this.rootTag = tag;
		}

		protected render() {
			this.isText = false;
			if(typeof this.props == 'string') {
				if(!this.props || this.props.indexOf('<') < 0) {
					this.isText = true;
					return this.buildRoot(this.rootTag, this.props);
				}
			}
			return this.props;
		}

		protected componentDidMount(): void {
			if(this.root && !this.isText) {
				this.rootTag = this.root.tagName;
				this.id = this.root.getAttribute('id');
				this._classStyle = this.root.getAttribute('class');
				this._style = this.root.getAttribute('style'); 
			}
		}
	}

	export class WContainer extends WComponent<string, any> {
		cbef: WComponent[]; // Components before the container
		ashe: string[];     // Head 
		cbgr: WComponent[]; //   Components before Grid
		comp: WComponent[]; //     Grid components
		sr_c: string[];     //     Grid ids
		grid: string[][];   //     Grid of class^style
		_end: boolean;      //     End grid
		cagr: WComponent[]; //   Components after Grid
		asta: string[];     // Tail 
		caft: WComponent[]; // Components after the container

		constructor(id?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, inline?: boolean, type?: string) {
			// WComponent init
			super(id ? id : '*', 'WContainer', type, classStyle, WUX.style(style), attributes);
			// WContainer init
			this.cbef = [];    // Components before the container
			this.ashe = [];    // Head 
			this.cbgr = [];    //   Components before Grid
			this.comp = [];    //     Grid components
			this.sr_c = [];    //     Grid ids
			this.grid = [];    //     Grid of class^style
			this._end = false; //     End grid
			this.cagr = [];    //   Components after Grid
			this.asta = [];    // Tail 
			this.caft = [];    // Components after the container
			this.rootTag = inline ? 'span' : 'div';
		}

		addRow(classStyle?: string, style?: string | WStyle): this {
			if(classStyle == null) classStyle = 'row';
			let g: string[] = [];
			let s = WUX.style(style);
			if(s) classStyle += '^' + s;
			g.push(classStyle);
			this.grid.push(g);
			return this;
		}

		addCol(classStyle?: string, style?: string | WStyle): this {
			if(!classStyle) classStyle = 'col-12';
			if(!isNaN(parseInt(classStyle))) classStyle = 'col-' + classStyle;
			if(!this.grid.length) this.addRow();
			let g = this.grid[this.grid.length - 1];
			let s = WUX.style(style);
			if(s) classStyle += '^' + s;
			g.push(classStyle);
			return this;
		}

		head(...items: string[]): this {
			if(!items) return this;
			this.ashe.push(...items);
			return this;
		}

		tail(...items: string[]): this {
			if(!items) return this;
			this.asta.push(...items);
			return this;
		}

		before(...items: WElement[]): this {
			if(!items) return this;
			for(let e of items) {
				if (!e) continue;
				if (typeof e == 'string') {
					this.cbef.push(new Wrapp(e));
				}
				else if (e instanceof Element) {
					this.cbef.push(new Wrapp(e));
				}
				else {
					this.cbef.push(e);
				}
			}
			return this;
		}

		after(...items: WElement[]): this {
			if(!items) return this;
			for(let e of items) {
				if (!e) continue;
				if (typeof e == 'string') {
					this.caft.push(new Wrapp(e));
				}
				else if (e instanceof Element) {
					this.caft.push(new Wrapp(e));
				}
				else {
					this.caft.push(e);
				}
			}
			return this;
		}

		add(e: WElement): this {
			if (!e) return this;
			if (typeof e == 'string') {
				this.add(new Wrapp(e));
				return this;
			}
			else if (e instanceof Element) {
				this.add(new Wrapp(e));
				return this;
			}
			else {
				if (!e.parent) e.parent = this;
				if (this.mounted) {
					// Runtime
					e.mount(this.root);
					return this;
				}
				let l = this.grid.length;
				if (this._end) {
					// After Grid
					this.cagr.push(e);
				}
				else if(!l) {
					// Before Grid
					this.cbgr.push(e);
				}
				else {
					// Grid
					let r = l - 1;                   // row
					let c = this.grid[r].length - 1; // column
					this.comp.push(e);
					this.sr_c.push(this.subId(r + '_' + c));
				}
				return this;
			}
		}

		addGroup(w: WWrapper, ...ac: WElement[]): this {
			if (w) {
				let cnt = this.addContainer(w);
				if (!ac || !ac.length) return this;
				for (let c of ac) {
					if(c) cnt.add(c);
				}
				return this;
			}
			if (!ac || !ac.length) return this;
			for (let c of ac) {
				if(c) this.add(c);
			}
			return this;
		}

		addLine(style: string | WStyle, ...ac: WElement[]): this {
			let w = new WContainer();
			w.addRow();
			if(ac) {
				let n = '1';
				if(typeof style != 'string') {
					n = style.n;
					if(!n) n = '1';
				}
				for (let c of ac) {
					if(c) w.addCol(n, style).add(c);
				}
			}
			this.add(w);
			return this;
		}

		addStack(style: string | WStyle, ...ac: WElement[]): this {
			let w = new WContainer();
			if(ac) {
				let n = '12';
				if(typeof style != 'string') {
					n = style.n;
					if(!n) n = '12';
				}
				for (let c of ac) {
					if(c) w.addRow().addCol(n, style).add(c);
				}
			}
			this.add(w);
			return this;
		}

		addContainer(c: WUX.WContainer): WContainer;
		addContainer(w: WWrapper): WContainer;
		addContainer(i: string, classStyle?: string, style?: string, attributes?: string | object, inline?: boolean, type?: string): WContainer;
		addContainer(c_w_i: WUX.WContainer | WWrapper | string , cls?: string, style?: string, attributes?: string | object, inline?: boolean, type?: string): WContainer {
			let c: WContainer;
			if(typeof c_w_i == 'string') {
				c = new WContainer(c_w_i, cls, style, attributes, inline, type);
				this.add(c);
			}
			else if(c_w_i instanceof WContainer) {
				c_w_i.parent = this;
				this.add(c_w_i);
			}
			else {
				c = new WContainer();
				if(c_w_i) {
					c.classStyle = WUX.cls(c_w_i.classStyle, c_w_i.style)
					c.style = WUX.style(c_w_i.style);
					c.attributes = c_w_i.attributes;
				}
				this.add(c);
			}
			return c;
		}

		addDiv(height: number, inner?: string, classStyle?: string): WContainer;
		addDiv(css: string | WStyle, inner?: string, attributes?: string, id?: string): WContainer;
		addDiv(hcss: number | string | WStyle, inner?: string, cls_att?: string, id?: string): WContainer {
			let d: string;
			if (typeof hcss == 'number') {
				if (hcss < 1) return this;
				d = WUX.build('div', inner, { h: hcss, n: cls_att });
			}
			else {
				d = WUX.build('div', inner, hcss, cls_att, id);
			}
			return this.add(d);
		}

		end(): WContainer {
			if (this.parent instanceof WContainer) return this.parent.end();
			this._end = true;
			return this;
		}

		protected componentWillMount(): void {
			// Before the container
			for(let c of this.cbef) {
				c.mount(this.context);
			}
		}

		protected render(): any {
			let inner = '';
			// Head
			for(let s of this.ashe) {
				inner += s;
			}
			// Grid
			let l = this.grid.length;
			if(l) {
				// Before the Grid
				if(this.cbgr.length) {
					inner += '<div id="' + this.subId('bg') + '"></div>';
				}
				// Build Grid
				for(let r = 0; r < l; r++) {
					let g = this.grid[r];
					let cl = g.length;
					if(!cl) continue;
					inner += '<div ' + this.cs(g[0]) + ' id="' + this.subId(r + '_0') + '">';
					for(let c = 1; c < cl; c++) {
						inner += '<div id="' + this.subId(r + '_' + c) + '" ' + this.cs(g[c]) + '></div>';
					}
					inner += "</div>";
				}
			}
			// Tail
			for(let s of this.asta) {
				inner += s;
			}
			return this.buildRoot(this.rootTag, inner);
		}

		protected componentDidMount(): void {
			// Before the container (See componentWillMount)
			// Before the grid
			let bg = document.getElementById(this.subId('bg'));
			if(bg) {
				for(let c of this.cbgr) {
					c.mount(bg);
				}
			}
			else {
				for(let c of this.cbgr) {
					c.mount(this.root);
				}
			}
			// Grid
			for(let i = 0; i < this.comp.length; i++) {
				let c = this.comp[i];
				let e = document.getElementById(this.sr_c[i]);
				if(!e) continue;
				c.mount(e);
			}
			// After Grid
			for(let c of this.cagr) {
				c.mount(this.root);
			}
			// After the container
			for(let e of this.caft) {
				e.mount(this.context);
			}
		}

		componentWillUnmount(): void {
			for(let c of this.caft) c.unmount(); // Components after the container
			for(let c of this.cagr) c.unmount(); //   Components after Grid
			for(let c of this.comp) c.unmount(); //     Grid components
			for(let c of this.cbgr) c.unmount(); //   Components before Grid
			for(let c of this.cbef) c.unmount(); // Components before the container
		}

		protected cs(cs: string) {
			if(!cs) return '';
			let x = cs.indexOf('^');
			if(x < 0) return 'class="' + cs + '"';
			let c = cs.substring(0, x);
			let s = cs.substring(x + 1);
			return 'class="' + c + '" style="' + s + '"';
		}

		getElement(r: number, c?: number): HTMLElement {
			if(!this.grid || !this.grid.length) {
				return null;
			}
			if(r < 0) {
				r = this.grid.length + r;
				if(r < 0) r = 0;
			}
			if(this.grid.length <= r) {
				return null;
			}
			if(c == null) {
				return document.getElementById(this.subId(r + '_0'));
			}
			let g = this.grid[r];
			// g = columns + row
			if(!g || g.length < 2) {
				return null;
			}
			if(c < 0) {
				c = g.length - 1 + c;
				if(c < 0) c = 0;
			}
			// c in id starts at 1
			c++;
			return document.getElementById(this.subId(r + '_' + c));
		}
	}

	export class WPages extends WComponent<any, number> {
		components: WComponent[];
		cbef: WUX.WComponent
		caft: WUX.WComponent
		sp: number = 0;
		
		constructor(id?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, props?: any) {
			// WComponent init
			super(id ? id : '*', 'WPages', props, classStyle, style, attributes);
			// WPages init
			this.components = [];
		}

		get pages(): number {
			if(!this.components) return 0;
			return this.components.length;
		}

		add(c: WComponent): this {
			if (!c) return this;
			if (c instanceof WDialog) {
				c.addToPages(this);
				return this;
			}
			this.components.push(c);
			return this;
		}

		addContainer(cid?: string, cls?: string, style?: string, attributes?: string | object, inline?: boolean, type?: string): WContainer {
			let c = new WContainer(cid, cls, style, attributes, inline, type);
			this.add(c);
			return c;
		}

		before(c: WComponent): this {
			this.cbef = c;
			return this;
		}

		after(c: WComponent): this {
			this.caft = c;
			return this;
		}

		first(): this {
			this.setState(0);
			return this;
		}

		last(): this {
			this.setState(this.components.length - 1);
			return this;
		}

		back(): this {
			this.setState(this.sp);
			return this;
		}

		next(): boolean {
			let l = this.components.length;
			if (!l) return false;
			let s = this.state;
			if (!s) s = 0;
			s++;
			if (s >= l) return false;
			this.setState(s);
			return true;
		}

		prev(): boolean {
			let l = this.components.length;
			if (!l) return false;
			let s = this.state;
			if (!s) s = 0;
			s--;
			if (s < 0) return false;
			this.setState(s);
			return true;
		}

		show(p: number, before?: (c: WComponent) => any, after?: (c: WComponent) => any, t: number = 0): WComponent {
			let l = this.components.length;
			if (!l) return null;
			if (!p) p = 0;
			if (p < 0) p = l + p;
			if (p < 0) p = 0;
			if (p >= l) return null;
			let c = this.components[p];
			if (!c) return null;
			if (before) before(c);
			this.setState(p);
			if (after) setTimeout(() => after(c), t);
			return c;
		}

		curr(): WComponent {
			let l = this.components.length;
			let i = this.state;
			if(i >= 0 && i < l) return this.components[i];
			return null;
		}

		protected render() {
			let l = this.components.length;
			if (!this.state) this.state = 0;
			if (this.state < 0) this.state = l + this.state;
			if (this.state < 0) this.state = 0;
			this.sp = this.state;
			let r: string = '<div';
			r += ' id="' + this.id + '"';
			if (this._classStyle) r += ' class="' + this._classStyle + '"';
			if (this._style) r += ' style="' + this._style + '"';
			if (this._attributes) r += ' ' + this._attributes;
			r += '>';
			if(this.cbef) {
				r += '<div id="' + this.id + '-b""></div>';
			}
			for (let i = 0; i < l; i++) {
				if (i == this.state) {
					r += '<div id="' + this.id + '-' + i + '" style="display:block;"></div>';
				}
				else {
					r += '<div id="' + this.id + '-' + i + '" style="display:none;"></div>';
				}
			}
			if(this.caft) {
				r += '<div id="' + this.id + '-a""></div>';
			}
			r += '</div>';
			return r;
		}

		protected updateState(nextState: number): void {
			this.sp = this.state;
			this.state = nextState;
			let l = this.components.length;
			if (!this.state) this.state = 0;
			if (this.state < 0) this.state = l + this.state;
			if (this.state < 0) this.state = 0;
			if (!this.mounted) return;
			for (let i = 0; i < l; i++) {
				let e = document.getElementById(this.id + '-' + i);
				if(!e) continue;
				e.style.display = i == this.state ? 'block' : 'none';
			}
		}

		protected componentDidMount(): void {
			if(this.cbef) {
				let b = document.getElementById(this.id + '-b');
				if(b) this.cbef.mount(b);
			}
			let l = this.components.length;
			for (let i = 0; i < l; i++) {
				let c = this.components[i];
				let e = document.getElementById(this.id + '-' + i);
				if (!e) continue;
				c.mount(e);
			}
			if(this.caft) {
				let a = document.getElementById(this.id + '-a');
				if(a) this.caft.mount(a);
			}
		}

		componentWillUnmount(): void {
			if(this.cbef) this.cbef.unmount();
			for (let c of this.components) {
				if(c) c.unmount();
			}
			if(this.caft) this.caft.unmount();
		}
	}

	export class WLink extends WComponent<string, string> {
		protected _href: string;
		protected _target: string;
		lock: boolean;

		constructor(id?: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, href?: string, target?: string) {
			// WComponent init
			super(id ? id : '*', 'WLink', icon, classStyle, style, attributes);
			this.updateState(text);
			this.rootTag = 'a';
			// WLink init
			this._href = href;
			this._target = target;
		}

		get icon(): string {
			return this.props;
		}
		set icon(s: string) {
			this.update(s, this.state, true, false, false);
		}

		get href(): string {
			return this._href;
		}
		set href(s: string) {
			this._href = s;
			if (this.root) {
				if (s) {
					this.root.setAttribute('href', s);
				}
				else {
					this.root.removeAttribute('href');
				}
			}
		}

		get target(): string {
			return this._target;
		}
		set target(s: string) {
			this._target = s;
			if (this.root) {
				if (s) {
					this.root.setAttribute('target', s);
				}
				else {
					this.root.removeAttribute('target');
				}
			}
		}

		protected render() {
			let addAttributes = '';
			if (this._href) addAttributes += 'href="' + this._href + '"';
			if (this._target) {
				if (addAttributes) addAttributes += ' ';
				addAttributes += 'target="' + this._target + '"';
			}
			if (this._tooltip) {
				if (addAttributes) addAttributes += ' ';
				addAttributes += 'title="' + this._tooltip + '"';
			}
			let html = '';
			if (this.state) {
				html += WUX.buildIcon(this.icon, '', ' ') + this.state;
			}
			else {
				html += WUX.buildIcon(this.icon);
			}
			return this.build(this.rootTag, html, addAttributes);
		}

		setState(nextState: string, force?: boolean, callback?: () => any): this {
			if (this.lock) return this;
			return super.setState(nextState, force, callback);
		}

		protected componentWillUpdate(nextProps: any, nextState: any): void {
			let html = '';
			if (nextState) {
				html += WUX.buildIcon(this.icon, '', ' ') + nextState;
			}
			else {
				html += WUX.buildIcon(this.icon);
			}
			this.root.innerHTML = html;
		}
	}

	export class WLabel extends WComponent<string, string> {
		forId: string;

		constructor(id?: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
			// WComponent init
			super(id ? id : '*', 'WLabel', icon, classStyle, style, attributes);
			this.rootTag = 'span';
			this.updateState(text);
		}

		get icon(): string {
			return this.props;
		}
		set icon(i: string) {
			this.update(i, this.state, true, false, false);
		}

		protected updateState(nextState: string): void {
			if (!nextState) nextState = '';
			super.updateState(nextState);
			if (this.root) this.root.innerHTML = WUX.buildIcon(this.props, '', ' ') + nextState;
		}

		for(e: WElement): this {
			this.forId = WUX.getId(e);
			return this;
		}

		protected render() {
			let text = this.state ? this.state : '';
			if (this.forId) return this.buildRoot('label', WUX.buildIcon(this.props, '', ' ') + text, 'for="' + this.forId + '"', this._classStyle);
			return this.buildRoot(this.rootTag, WUX.buildIcon(this.props, '', ' ') + text, null, this._classStyle);
		}

		protected componentDidMount(): void {
			if (this._tooltip) this.root.setAttribute('title', this._tooltip);
		}
	}

	export class WInput extends WComponent<string, string> {
		size: number;
		label: string;
		placeHolder: string;
		_ro: boolean;
		_af: boolean;

		constructor(id?: string, type?: string, size?: number, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
			// WComponent init
			super(id ? id : '*', 'WInput', type, classStyle, style, attributes);
			this.rootTag = 'input';
			// WInput init
			this.size = size;
		}

		get readonly(): boolean {
			return this._ro;
		}
		set readonly(v: boolean) {
			this._ro = v;
			if(this.mounted) {
				if(v) {
					this.root.setAttribute('readonly', '');
				}
				else {
					this.root.removeAttribute('readonly');
				}
			}
		}

		get autofocus(): boolean {
			return this._af;
		}
		set autofocus(v: boolean) {
			this._af = v;
			if(this.mounted) {
				if(v) {
					this.root.setAttribute('autofocus', '');
				}
				else {
					this.root.removeAttribute('autofocus');
				}
			}
		}

		onEnter(h: (e: KeyboardEvent) => any): this {
			if (!h) return this;
			this.handlers['_enter'] = [h];
			return this;
		}

		protected updateState(nextState: string) {
			// At runtime nextState can be of any type 
			nextState = WUtil.toString(nextState);
			if (!nextState) nextState = '';
			super.updateState(nextState);
			if (this.root) this.root['value'] = nextState;
		}

		getState(): string {
			if(this.root) {
				this.state = this.root['value'];
			}
			return this.state;
		}

		protected render() {
			let l = '';
			if (this.label) {
				l = this.id ? '<label for="' + this.id + '">' : '<label>'
				let br = this.label.lastIndexOf('<br');
				if (br > 0) {
					l += this.label.substring(0, br).replace('<', '&lt;').replace('>', '&gt;')
					l += '</label><br>';
				}
				else {
					l += this.label.replace('<', '&lt;').replace('>', '&gt;')
					l += '</label> ';
				}
			}
			if (this.props == 'static') {
				return l + this.build('span', this.state);
			}
			else {
				let addAttributes = 'name="' + this.id + '"';
				addAttributes += this.props ? ' type="' + this.props + '"' : ' type="text"';
				if (this.size) addAttributes += ' size="' + this.size + '"';
				if (this.state) addAttributes += ' value="' + this.state + '"';
				if (this.placeHolder) addAttributes += ' placeholder="' + this.placeHolder + '"';
				if (this._ro) addAttributes += ' readonly';
				if (this._af) addAttributes += ' autofocus';
				return l + this.build(this.rootTag, '', addAttributes);
			}
		}

		protected componentDidMount(): void {
			let i = document.getElementById(this.id);
			if (!i) return;
			i.addEventListener("keydown", (e: KeyboardEvent) => {
				if (e.key === "Enter") {
					e.preventDefault();
					if (this.handlers['_enter']) {
						for (let h of this.handlers['_enter']) h(e);
					}
				}
			});
		}
	}

	export class WTextArea extends WComponent<number, string> {
		_ro: boolean;
		_af: boolean;

		constructor(id?: string, rows?: number, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
			// WComponent init
			super(id ? id : '*', 'WTextArea', rows, classStyle, style, attributes);
			this.rootTag = 'textarea';
			if (!rows) this.props = 5;
		}

		get readonly(): boolean {
			return this._ro;
		}
		set readonly(v: boolean) {
			this._ro = v;
			if(this.mounted) {
				if(v) {
					this.root.setAttribute('readonly', '');
				}
				else {
					this.root.removeAttribute('readonly');
				}
			}
		}

		get autofocus(): boolean {
			return this._af;
		}
		set autofocus(v: boolean) {
			this._af = v;
			if(this.mounted) {
				if(v) {
					this.root.setAttribute('autofocus', '');
				}
				else {
					this.root.removeAttribute('autofocus');
				}
			}
		}

		protected updateState(nextState: string) {
			if (!nextState) nextState = '';
			super.updateState(nextState);
			if (this.root) this.root['value'] = nextState;
		}

		getState(): string {
			if(this.root) {
				this.state = this.root['value'];
			}
			return this.state;
		}

		protected render() {
			if (!this.props) this.props = 1;
			if (this._style) {
				if (this._style.indexOf('width') < 0) {
					this._style += ';width:100%';
				}
			}
			else {
				this._style = 'width:100%';
			}
			if (this._attributes) {
				if (this._style.indexOf('rows=') < 0) {
					this._attributes += ' rows="' + this.props + '"';
				}
			}
			else {
				this._attributes = 'rows="' + this.props + '"';
			}
			if(this._ro) {
				if(!this._attributes) {
					this._attributes = 'readonly';
				}
				else {
					this._attributes += ' readonly';
				}
			}
			if(this._af) {
				if(!this._attributes) {
					this._attributes = 'autofocus';
				}
				else {
					this._attributes += ' autofocus';
				}
			}
			return WUX.build('textarea', '', this._style, this._attributes, this.id, this._classStyle);
		}

		protected componentDidMount(): void {
			if (this._tooltip) this.root.setAttribute('title', this._tooltip);
			if (this.state) this.root.setAttribute('value', this.state);
		}
	}
	
	export class WButton extends WComponent<string, string> {
		public readonly type: string;

		constructor(id?: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, type?: string) {
			// WComponent init
			super(id ? id : '*', 'WButton', icon, classStyle, style, attributes);
			this.updateState(text);
			this.rootTag = 'button';
			// WButton init
			this.type = type ? type : 'button';
		}

		get icon(): string {
			return this.props;
		}
		set icon(i: string) {
			this.update(i, this.state, true, false, false);
		}

		setText(text?: string, icon?: string) {
			if (icon != null) this.props = icon;
			this.setState(text);
		}

		protected render() {
			let addAttributes = this.type ? 'type="' + this.type + '"' : '';
			let html = '';
			if (this.state) {
				html += WUX.buildIcon(this.props, '', ' ') + this.state;
			}
			else {
				html += WUX.buildIcon(this.props);
			}
			return this.build(this.rootTag, html, addAttributes);
		}

		protected componentDidMount(): void {
			if (this._tooltip) this.root.setAttribute('title', this._tooltip);
		}

		protected componentWillUpdate(nextProps: any, nextState: any): void {
			let html = '';
			if(nextProps == null) nextProps = this.props;
			if (nextState) {
				html += WUX.buildIcon(nextProps, '', ' ') + nextState;
			}
			else {
				html += WUX.buildIcon(nextProps);
			}
			this.root.innerHTML = html;
		}
	}

	export class WCheck extends WComponent<boolean, any> {
		divClass: string;
		divStyle: string;
		label: string;
		value: any;
		text: string;
		lever: boolean;
		leverStyle: string;

		constructor(id?: string, text?: string, value?: any, checked?: boolean, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
			// WComponent init
			super(id ? id : '*', 'WCheck', checked, classStyle, style, attributes);
			this.rootTag = 'input';
			// WCheck init
			this.value = value ? value : '1';
			if (checked) this.updateState(value);
			this.text = text;
		}

		get checked(): boolean {
			if(this.root) this.props = !!this.root['checked'];
			this.state = this.props ? this.value : undefined;
			return this.props;
		}
		set checked(b: boolean) {
			this.setProps(b);
		}

		set tooltip(s: string) {
			this._tooltip = s;
			let l = document.getElementById(this.id + '-l');
			if(l) {
				l.setAttribute('title', this._tooltip);
			}
			else if (this.root) {
				this.root.setAttribute('title', this._tooltip);
			}
		}

		getState(): any {
			if(this.root) this.props = !!this.root['checked'];
			this.state = this.props ? this.value : undefined;
			return this.state;
		}

		protected updateProps(nextProps: boolean) {
			super.updateProps(nextProps);
			if(this.props == null) this.props = false;
			this.state = this.props ? this.value : undefined;
			if (this.root) this.root['checked'] = this.props;
		}

		protected updateState(nextState: any) {
			super.updateState(nextState);
			if (typeof this.state == 'boolean') {
				this.props = this.state;
				this.state = this.props ? this.value : undefined;
			}
			else {
				if (this.state == 'true') this.state = '1';
				this.props = this.state && this.state == this.value;
			}
			if (this.root) this.root['checked'] = this.props;
		}

		protected render() {
			let addAttributes = 'name="' + this.id + '" type="checkbox"';
			addAttributes += this.props ? ' checked="checked"' : '';
			let inner = this.text ? '&nbsp;' + this.text : '';
			// Label
			if(!this.label) {
				this.label = '';
			}
			else if (this._tooltip) {
				addAttributes += ' title="' + this._tooltip + '"';
			}
			let l = '<label id="' + this.id + '-l" for="' + this.id + '"';
			if (this._tooltip) {
				l += ' title="' + this._tooltip + '"';
			}
			l += '>' + this.label;
			// Wrapper
			let r0 = '';
			let r1 = '';
			if (this.divClass || this.divStyle) {
				r0 += '<div ';
				if(this.divClass) r0 += ' class="' + this.divClass + '"';
				if(this.divStyle) r0 += ' style="' + this.divStyle + '"';
				r0 += '>';
			}
			if(this.lever) {
				r0 += '<div class="toggles">';
				r0 += l;
			}
			else {
				r1 += l;
			}
			if (r0) {
				if(this.lever) {
					let ls = this.leverStyle ? ' style="' + this.leverStyle + '"' : '';
					r1 += '<span class="lever"' + ls + '></span></label></div>';
				}
				r1 += '</div>';
			}
			return r0 + this.build(this.rootTag, inner, addAttributes) + r1;
		}

		protected componentDidMount(): void {
			if (this.id) {
				// The component may be wrapped...
				this.root = document.getElementById(this.id);
			}
			if(this.root) {
				this.root.addEventListener("change", (e: Event) => {
					this.props = !!this.root['checked'];
					this.state = this.props ? this.value : undefined;
				});
			}
		}
	}
	
	export class WRadio extends WComponent<string, any> implements WISelectable {
		options: Array<string | WEntity>;
		label: string;
		classDiv: string;
		styleDiv: string;

		constructor(id?: string, options?: Array<string | WEntity>, classStyle?: string, style?: string | WStyle, attributes?: string | object, props?: any) {
			// WComponent init
			super(id ? id : '*', 'WRadio', props, classStyle, style, attributes);
			// WRadio init 
			this.options = options;
			this.classDiv = 'form-check form-check-inline';
		}

		get enabled(): boolean {
			return this._enabled;
		}
		set enabled(b: boolean) {
			this._enabled = b;
			if (this.mounted) {
				for (let i = 0; i < this.options.length; i++) {
					let item = document.getElementById(this.id + '-' + i);
					if (!item) continue;
					if (b) {
						item.removeAttribute('disabled');
					}
					else {
						item.setAttribute('disabled', '');
					}
				}
			}
		}

		set tooltip(s: string) {
			this._tooltip = s;
			if (!this.mounted) return;
			if (this.internal) this.internal.tooltip = s;
			if (!this.options || !this.options.length) return;
			for (let i = 0; i < this.options.length; i++) {
				let item = document.getElementById(this.id + '-' + i);
				if (!item) continue;
				item.setAttribute('title', this._tooltip);
			}
		}

		select(i: number): this {
			if (!this.root || !this.options) return this;
			this.setState(this.options.length > i ? this.options[i] : null);
			return this;
		}

		getProps(): string {
			if (!this.options || !this.options.length) return null;
			for (let i = 0; i < this.options.length; i++) {
				let rid = this.id + '-' + i;
				let item = document.getElementById(rid);
				if (!item) continue;
				if (item['checked']) {
					let lbl = document.getElementById(rid + '-l');
					if(lbl) return lbl.innerText;
				}
			}
			return WUtil.toString(this.state);
		}

		setOptions(options: Array<string | WEntity>, prevVal?: boolean): this {
			this.options = options;
			if (!this.mounted) return this;
			let p = this.getState();
			let o = this.buildOptions();
			this.root.innerHTML = o;
			if (prevVal) {
				this.setState(p);
			}
			else if (options && options.length) {
				this.setState(options[0]);
			}
			this.componentDidMount();
			return this;
		}

		protected updateState(nextState: any) {
			super.updateState(nextState);
			if(!this.state) {
				if(this.options && this.options.length) {
					this.state = this.options[0];
				}
			}
			if(typeof this.state == 'object') {
				if("id" in this.state) {
					this.state = this.state["id"];
				}
			}
		}

		protected render() {
			let r = this.buildOptions();
			return WUX.build('div', r, this._style, this._attributes, this.id, this._classStyle);
		}

		protected componentDidMount(): void {
			if (!this.options || !this.options.length) return;
			for (let i = 0; i < this.options.length; i++) {
				let item = document.getElementById(this.id + '-' + i);
				if (!item) continue;
				if (this._tooltip) item.setAttribute('title', this._tooltip);
				let opt = this.options[i];
				// Dispatched only by user action
				item.addEventListener('change', (e: Event) => {
					this.setState(opt);
				});
			}
		}

		protected componentDidUpdate(prevProps: any, prevState: any): void {
			let idx = -1;
			if(this.state) {
				for (let i = 0; i < this.options.length; i++) {
					if (match(this.state, this.options[i])) {
						idx = i;
						break;
					}
				}
			}
			else {
				idx = 0;
			}
			if(idx >= 0) {
				let item = document.getElementById(this.id + '-' + idx);
				// This don't dispatch the event 'change'
				if (item) item['checked'] = true;
			}
		}

		protected buildOptions(): string {
			let r = '';
			if (this.label) {
				r += this.id ? '<label for="' + this.id + '">' : '<label>'
				r += this.label.replace('<', '&lt;').replace('>', '&gt;')
				r += '</label> ';
			}
			let d = '';
			if(this._enabled != null && !this._enabled) d = ' disabled';
			if (!this.options) this.options = [];
			let l = this.options.length;
			if (this.state === undefined && l) this.state = this.options[0];
			for (let i = 0; i < l; i++) {
				r += '<div';
				if(this.classDiv) r += ' class="' + this.classDiv + '"';
				if(this.styleDiv) r += ' style="' + this.styleDiv + '"';
				r += '>';
				let opt = this.options[i];
				let rid = this.id + '-' + i;
				if (typeof opt == "string") {
					if (match(this.state, opt)) {
						r += '<input type="radio" value="' + opt + '" name="' + this.id + '" id="' + rid + '" checked' + d + '>';
					}
					else {
						r += '<input type="radio" value="' + opt + '" name="' + this.id + '" id="' + rid + '"' + d + '>';
					}
					r += '<label id="' + rid + '-l" for="' + rid + '">' +  opt + '</label>';
				}
				else {
					if (match(this.state, opt)) {
						r += '<input type="radio" value="' + opt.id + '" name="' + this.id + '" id="' + rid + '" checked' + d + '>';
					}
					else {
						r += '<input type="radio" value="' + opt.id + '" name="' + this.id + '" id="' + rid + '"' + d + '>';
					}
					r += '<label id="' + rid + '-l" for="' + rid + '">' +  opt.text + '</label>';
				}
				r += '</div>';
			}
			return r;
		}
	}

	export class WSelect extends WComponent implements WISelectable {
		options: Array<string | WEntity>;
		multiple: boolean;

		constructor(id?: string, options?: Array<string | WEntity>, multiple?: boolean, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
			// WComponent init
			super(id ? id : '*', 'WSelect', null, classStyle, style, attributes);
			// WSelect init
			this.rootTag = 'select';
			this.options = options;
			this.multiple = multiple;
		}

		getProps(): any {
			if (!this.root) return this.props;
			this.props = [];
			let options = this.root["options"] as HTMLOptionElement[];
			if(options && options.length) {
				let s = WUtil.toNumber(this.root["selectedIndex"], -1);
				if(s >= 0 && options.length > s) {
					this.props.push(options[s].text);
				}
			}
			return this.props;
		}

		findOption(text: string, d: any = null): any {
			if (!this.options) return d;
			if (!text) text = '';
			for(let o of this.options) {
				if(typeof o == 'string') {
					if(o == text) return o;
				}
				else {
					if(o.text == text) return o.id;
				}
			}
			return d;
		}

		select(i: number): this {
			if (!this.root || !this.options) return this;
			this.setState(this.options.length > i ? this.options[i] : null);
			return this;
		}

		addOption(e: string | WEntity, sel?: boolean): this {
			if (!e) return this;
			if (!this.options) this.options = [];
			this.options.push(e);
			if (!this.mounted) return this;
			let o = this.buildOptions();
			this.root.innerHTML = o;
			if (sel) this.updateState(e);
			return this;
		}

		remOption(e: string | WEntity): this {
			if (!e || !this.options) return this;
			let x = -1;
			for (let i = 0; i < this.options.length; i++) {
				let s = this.options[i];
				if (!s) continue;
				if (typeof e == 'string') {
					if (typeof s == 'string') {
						if (s == e) {
							x = i;
							break;
						}
					}
					else {
						if (s.id == e) {
							x = i;
							break;
						}
					}
				}
				else {
					if (typeof s == 'string') {
						if (s == e.id) {
							x = i;
							break;
						}
					}
					else {
						if (s.id == e.id) {
							x = i;
							break;
						}
					}
				}
			}
			if (x >= 0) {
				this.options.splice(x, 1);
				if (!this.mounted) return this;
				let o = this.buildOptions();
				this.root.innerHTML = o;
			}
			return this;
		}

		setOptions(options: Array<string | WEntity>, prevVal?: boolean): this {
			this.options = options;
			if (!this.mounted) return this;
			let p = this.root["value"];
			let o = this.buildOptions();
			this.root.innerHTML = o;
			if (prevVal) {
				this.root["value"] = p;
			}
			else if (options && options.length) {
				if (typeof options[0] == 'string') {
					this.trigger('statechange', options[0]);
				}
				else {
					this.trigger('statechange', WUtil.getString(options[0], 'id'));
				}
			}
			return this;
		}

		protected updateState(nextState: any) {
			super.updateState(nextState);
			if (this.root) {
				if (this.state == null) {
					this.root["value"] = '';
				}
				else if (typeof this.state == 'string' || typeof this.state == 'number') {
					this.root["value"] = '' + this.state;
				}
				else {
					this.root["value"] = this.state.id;
				}
			}
		}

		protected render() {
			let o = this.buildOptions();
			let addAttributes = 'name="' + this.id + '"';
			if (this.multiple) addAttributes += ' multiple="multiple"';
			let d = '';
			if(this._enabled != null && !this._enabled) d = ' disabled';
			addAttributes += d;
			return this.buildRoot('select', o, addAttributes);
		}

		protected componentDidMount(): void {
			if (this._tooltip) this.root.setAttribute('title', this._tooltip);
			if (this.state) this.root["value"] = this.state;
			this.root.addEventListener('change', () => {
				this.trigger('statechange', this.root["value"]);
			});
		}

		protected buildOptions(): string {
			let r = '';
			if (!this.options) this.options = [];
			let g = '';
			for (let opt of this.options) {
				if (typeof opt == 'string') {
					r += '<option>' + opt + '</option>';
				}
				else {
					if (opt.group) {
						if (g != opt.group) {
							if (g) r += '</optgroup>';
							g = opt.group;
							r += '<optgroup label="' + g + '">';
						}
						g = opt.group
					}
					r += '<option value="' + opt.id + '">' + opt.text + '</option>';
				}
			}
			if (g) r += '</optgroup>';
			return r;
		}
	}

	export class WTable extends WComponent<any, any[]> {
		header: string[];
		keys: any[];
		types: string[];
		widths: number[];
		widthsPerc: boolean;
		hideHeader: boolean;
		div: string; 

		colStyle: string | WStyle;
		rowStyle: string | WStyle;
		headStyle: string | WStyle;
		footerStyle: string | WStyle;
		/** First col style */
		col0Style: string | WStyle;
		/** Last col style */
		colLStyle: string | WStyle;

		sortable: number[];
		soId: string[];
		sortBy: number[];
		reqSort: number = -1;
		prvSort: number = -1;

		selClass: string;
		selectionMode: 'single' | 'multiple' | 'none';
		selectedRow: number = -1;

		paging: boolean = false;
		plen: number = 10;
		page: number = 1;
		rows: number = 0;

		constructor(id: string, header: string[], keys?: any[], classStyle?: string, style?: string | WStyle, attributes?: string | object, props?: any) {
			super(id ? id : '*', 'WTable', props, classStyle, style, attributes);
			this.rootTag = 'table';
			this.header = header;
			if (keys && keys.length) {
				this.keys = keys;
			}
			else {
				this.keys = [];
				if (this.header) for (let i = 0; i < this.header.length; i++) this.keys.push(i);
			}
			this.widths = [];
			this.selClass = CSS.SEL_ROW;
		}

		onSelectionChanged(handler: (e: {element?: Element, selectedRowsData?: any[]}) => any): void {
			if (!this.handlers['_selectionchanged']) this.handlers['_selectionchanged'] = [];
			this.handlers['_selectionchanged'].push(handler);
		}

		onDoubleClick(handler: (e: {element?: Element, rowElement?: Element, data?: any, rowIndex?: number}) => any): void {
			if (!this.handlers['_doubleclick']) this.handlers['_doubleclick'] = [];
			this.handlers['_doubleclick'].push(handler);
		}

		onRowPrepared(handler: (e: {element?: Element, rowElement?: Element, data?: any, rowIndex?: number}) => any) {
			if (!this.handlers['_rowprepared']) this.handlers['_rowprepared'] = [];
			this.handlers['_rowprepared'].push(handler);
		}

		clearSelection(): this {
			this.selectedRow = -1;
			if (!this.mounted) return this;
			let b = document.getElementById(this.id + '-b');
			if(b && this.selClass) {
				let an = b.childNodes as any;
				for(let i = 0; i < b.childElementCount; i++) {
					WUX.removeClassOf(an[i], this.selClass);
				}
			}
			if (!this.handlers['_selectionchanged']) return this;
			for (let handler of this.handlers['_selectionchanged']) {
				handler({ element: this.root, selectedRowsData: [] });
			}
			return this;
		}

		select(idxs: number[]): this {
			if(!idxs) idxs = [];
			this.selectedRow = idxs.length ? idxs[0] : -1;
			if (!this.mounted) return this;
			let b = document.getElementById(this.id + '-b');
			if(b && this.selClass) {
				let an = b.childNodes as any;
				for(let i = 0; i < b.childElementCount; i++) {
					if(idxs.indexOf(i) >= 0) {
						WUX.addClassOf(an[i], this.selClass);
					}
					else {
						WUX.removeClassOf(an[i], this.selClass);
					}
				}
			}
			if (!this.handlers['_selectionchanged']) return this;
			let srd = [];
			for (let idx of idxs) {
				if(this.state && this.state.length > idx) {
					srd.push(this.state[idx]);
				}
			}
			for (let handler of this.handlers['_selectionchanged']) {
				handler({ element: this.root, selectedRowsData: srd });
			}
			return this;
		}

		selectAll(toggle?: boolean): this {
			if (!this.mounted) return this;
			if(toggle && this.selectedRow >= 0) {
				return this.clearSelection();
			}
			this.selectedRow = -1;
			if(this.state && this.state.length) {
				this.selectedRow = 0;
			}
			let b = document.getElementById(this.id + '-b');
			if(b && this.selClass) {
				let an = b.childNodes as any;
				for(let i = 0; i < b.childElementCount; i++) {
					WUX.addClassOf(an[i], this.selClass);
				}
			}
			if (!this.handlers['_selectionchanged']) return this;
			for (let handler of this.handlers['_selectionchanged']) {
				handler({ element: this.root, selectedRowsData: this.state });
			}
			return this;
		}

		getSelectedRows(): number[] {
			if (!this.mounted) return [];
			if (this.selectedRow < 0) return [];
			return [this.selectedRow];
		}

		getSelectedRowsData(): any[] {
			if (!this.mounted) return [];
			if (this.selectedRow < 0) return [];
			if (!this.state || !this.state.length) return [];
			if (this.state.length <= this.selectedRow) return [];
			return [this.state[this.selectedRow]];
		}

		protected render() {
			if (this.sortable && this.sortable.length) {
				this.soId = [];
				this.sortBy = [];
				for(let i = 0; i < this.sortable.length; i++) {
					this.sortBy.push(0);
				}
			}
			let tableClass = 'table';
			if (this._classStyle) tableClass = this._classStyle.indexOf('table ') >= 0 ? this._classStyle : tableClass + ' ' + this._classStyle;
			let ts = this.style ? ' style="' + this.style + '"' : '';
			let r = '';
			if(this.div) r += '<div id="' + this.id + '-c" class="' + this.div + '">';
			let sm = this.selectionMode;
			if(sm && sm != 'none') {
				if(tableClass.indexOf('table-hover') < 0) {
					tableClass += ' table-hover';
				}
			}
			r += '<table id="' + this.id + '" class="' + tableClass + '"' + ts + '>';
			if (this.header && this.header.length) {
				let ths = false;
				if (typeof this.headStyle == 'string') {
					if (this.headStyle.indexOf('text-align') > 0) ths = true;
				}
				else if (this.headStyle && this.headStyle.a) {
					ths = true;
				}
				if (!this.hideHeader) {
					if (ths) {
						r += '<thead id="' + this.id + '-h"><tr>';
					}
					else {
						r += '<thead id="' + this.id + '-h"><tr' + WUX.buildCss(this.headStyle) + '>';
					}
					let j = -1;
					for (let h of this.header) {
						j++;
						let s: string | WStyle;
						if (j == 0) {
							s = this.col0Style ? this.col0Style : this.colStyle;
						}
						else if (j == this.header.length - 1) {
							s = this.colLStyle ? this.colLStyle : this.colStyle;
						}
						else {
							s = ths ? this.headStyle : this.colStyle;
						}
						let w = this.widths && this.widths.length > j ? this.widths[j] : 0;
						let x: WStyle = {};
						if (w) x.w = this.widthsPerc ? w + '%' : w; 
						let t = this.getType(j);
						if(t == 'w') x.a = 'center';
						
						let so = this.sortable && this.sortable.indexOf(j) >= 0;
						if(so) {
							let aid = this.subId('sort_' + j);
							this.soId.push(aid);
							r += '<th' + WUX.buildCss(s, x) + '><a style="cursor:pointer;text-decoration:none !important;" id="' + aid + '">' + h + ' &nbsp;<i class="fa fa-unsorted"></i></a></th>';
						}
						else {
							r += '<th' + WUX.buildCss(s, x) + '>' + h + '</th>';
						}
					}
					r += '</tr></thead>';
				}
			}
			r += '<tbody id="' + this.id + '-b"></tbody>';
			r += '</table>';
			if(this.div) r += '</div>';
			return r;
		}

		protected componentDidMount(): void {
			this.buildBody();
			if(this.soId) {
				for(let aid of this.soId) {
					let a = document.getElementById(aid);
					if(a) {
						a.addEventListener('click', (e: PointerEvent) => {
							let i = WUX.lastSub(WUX.getId(e.currentTarget));
							let x = i.indexOf('_');
							if(x <= 0) return;
							let c = WUtil.toNumber(i.substring(x + 1), -1);
							if(c >= 0 && this.header && this.header.length > c) {
								this.reqSort = c;
								// Default sort?
								let hs = this.handlers['_sort'];
								let ds = !(hs && hs.length) && this.keys && this.keys.length > c;
								let h = this.header[c];
								let v = this.sortBy[c];
								if(!v) {
									this.sortBy[c] = 1;
									if(h) a.innerHTML = h + ' &nbsp;<i class="fa fa-sort-asc"></i>';
									if(ds) this.setState(WUtil.sort(this.state, true, this.keys[c]));
								}
								else if(v == 1) {
									this.sortBy[c] = -1;
									if(h) a.innerHTML = h + ' &nbsp;<i class="fa fa-sort-desc"></i>';
									if(ds) this.setState(WUtil.sort(this.state, false, this.keys[c]));
								}
								else if(v == -1) {
									this.sortBy[c] = 0;
									if(h) a.innerHTML = h + ' &nbsp;<i class="fa fa-unsorted"></i>';
								}
								if(hs) {
									for (let hr of hs) hr(this.createEvent('_sort', this.sortBy));
								}
								this.reqSort = -1;
								this.prvSort = c;
							}
						});
					}
				}
			}
			let b = document.getElementById(this.id + '-b');
			if(b) {
				b.addEventListener('click', (e: PointerEvent) => {
					if(!this.selectionMode || this.selectionMode == 'none') return;
					let t = e.target as HTMLElement;
					if(!t) return;
					let tr = t.closest('tr');
					if(!tr) return;
					let i = WUtil.toNumber(WUX.lastSub(tr), -1);
					if(i < 0) return;
					this.select([i]);
				});
				b.addEventListener('dblclick', (e: PointerEvent) => {
					if(!this.handlers['_doubleclick']) return;
					let t = e.target as HTMLElement;
					if(!t) return;
					let tr = t.closest('tr');
					if(!tr) return;
					let i = WUtil.toNumber(WUX.lastSub(tr), -1);
					if(i < 0) return;
					let d = this.state && this.state.length > i ? this.state[i] : null;
					for (let h of this.handlers['_doubleclick']) {
						h({ element: this.root, rowElement: tr, data: d, rowIndex: i });
					}
				});
			}
		}

		protected componentDidUpdate(prevProps: any, prevState: any): void {
			this.buildBody();
			this.updSort();
		}

		protected updSort(): void {
			if(this.prvSort == -1 || this.reqSort == this.prvSort) return;
			let v = this.sortBy[this.prvSort];
			if(!v) return;
			let aid = this.subId('sort_' + this.prvSort);
			let a = document.getElementById(aid);
			if(!a) return;
			let h = this.header[this.prvSort];
			if(h) a.innerHTML = h + ' &nbsp;<i class="fa fa-unsorted"></i>';
			this.sortBy[this.prvSort] = 0;
		}

		protected getType(i: number): string {
			if(!this.types) return '';
			if(this.types.length <= i) return '';
			return this.types[i];
		}

		protected buildBody(): void {
			let tbody = document.getElementById(this.id + "-b")
			if(!tbody) return;
			if (!this.state || !this.state.length) {
				tbody.innerHTML = '';
				return;
			}
			if (!this.keys || !this.keys.length) {
				tbody.innerHTML = '';
				return;
			}
			if(this.page < 1) this.page = 1;
			if(this.plen < 1) this.plen = 10;
			let s = (this.page - 1) * this.plen;
			let m = s + this.plen;
			let sr = this.selectionMode && this.selectionMode != 'none' ? ' style="cursor:pointer;"' : '';
			let b = '';
			let l = this.state ? this.state.length : 0;
			this.rows = 0;
			for (let i = 0; i < l; i++) {
				if(this.paging) {
					if(i < s || i >= m) continue;
				}
				this.rows++;
				let row = this.state[i];
				let r: string = '';
				if (i == this.state.length - 1) {
					if (this.footerStyle) {
						r = '<tr' + buildCss(this.footerStyle) + ' id="' + this.id + '-' + i + '"' + sr + '>';
					}
					else {
						r = '<tr' + buildCss(this.rowStyle) + ' id="' + this.id + '-' + i + '"' + sr + '>';
					}
				}
				else {
					r = '<tr' + buildCss(this.rowStyle) + ' id="' + this.id + '-' + i + '"' + sr + '>';
				}
				let j = -1;
				for (let key of this.keys) {
					let v = row[key];
					let align = '';
					if (v == null) v = '';
					j++;
					let t = this.getType(j);
					switch (t) {
						case 'w':
							align = 'text-center';
							break;
						case 'c':
						case 'c5':
						case 'i':
						case 'n':
							align = 'text-right';
							break;
						case 'b':
							v = v ? '&check;' : '';
							break;
						default:
							if (v instanceof Date) v = v.toLocaleDateString();
							if (typeof v == 'boolean') v = v ? '&check;' : '';
							if (typeof v == 'number') {
								align = 'text-right';
							}
					}
					let s: string | WStyle;
					if (j == 0) {
						s = this.col0Style ? this.col0Style : this.colStyle;
					}
					else if (j == this.header.length - 1) {
						s = this.colLStyle ? this.colLStyle : this.colStyle;
					}
					else {
						s = this.colStyle;
					}
					if (typeof s == 'string') {
						if (s.indexOf('text-align') > 0) align = '';
					}
					else if (s && s.a) {
						align = '';
					}
					let w = this.widths && this.widths.length > j ? this.widths[j] : 0;
					r += '<td' + WUX.buildCss(s, align, { w: w }) + '>' + v + '</td>';
				}
				if (this.header && this.header.length > this.keys.length) {
					for (let i = 0; i < this.header.length - this.keys.length; i++) {
						r += '<td' + WUX.buildCss(this.colStyle) + '></td>';
					}
				}
				r += '</tr>';
				if (this.handlers['_rowprepared']) {
					let t = document.createElement("template");
					t.innerHTML = r;
					let e = { element: this.root, rowElement: t.content.firstElementChild, data: row, rowIndex: i };
					for (let handler of this.handlers['_rowprepared']) handler(e);
					r = t.innerHTML;
				}
				b += r;
			}
			tbody.innerHTML = b;
		}

		onSort(h: (e: WEvent) => any): void {
			if (!this.handlers['_sort']) this.handlers['_sort'] = [];
			this.handlers['_sort'].push(h);
		}
	}

	export class WForm extends WComponent<WField[][], any> {
		title: string;
		fieldset: Element;
		rows: WField[][];
		roww: WWrapper[];
		currRow: WField[];
		main: WContainer;
		foot: WContainer;
		footer: WElement[];
		footerClass: string;
		footerStyle: string | WStyle;
		captions: WComponent[];
		mainClass: string;
		mainStyle: string | WStyle;
		groupStyle: string | WStyle;

		constructor(id?: string, title?: string, action?: string) {
			// WComponent init
			super(id ? id : '*', 'WForm');
			this.rootTag = 'form';
			if (action) {
				this._attributes = 'role="form" name="' + this.id + '" action="' + action + '"';
			}
			else {
				this._attributes = 'role="form" name="' + this.id + '" action="javascript:void(0);"';
			}
			// WForm init
			this.title = title;
			if(CSS.FORM) {
				if(CSS.FORM.indexOf(':') > 0) {
					this.style = CSS.FORM;
				}
				else {
					this.classStyle = CSS.FORM;
				}
			}
			this.init();
		}

		get enabled(): boolean {
			if (this.internal) return this.internal.enabled;
			return this._enabled;
		}
		set enabled(b: boolean) {
			this._enabled = b;
			if (this.internal) this.internal.enabled = b;
			if (this.fieldset) {
				if (this._enabled) {
					this.fieldset.removeAttribute('disabled');
				}
				else {
					this.fieldset.setAttribute('disabled', '');
				}
			}
		}

		init(): this {
			this.rows = [];
			this.roww = [];
			this.currRow = null;
			this.footer = [];
			this.captions = [];
			this.addRow();
			return this;
		}

		onEnter(h: (e: KeyboardEvent) => any): this {
			if (!h) return this;
			this.handlers['_enter'] = [h];
			return this;
		}

		focus(): this {
			if (!this.mounted) return this;
			let f = this.first(true);
			if (f) {
				if (f.component) {
					f.component.focus();
				}
				else if (f.element instanceof HTMLElement) {
					f.element.focus();
				}
			}
			return this;
		}

		first(enabled?: boolean): WField {
			if (!this.rows) return null;
			for (let row of this.rows) {
				for (let f of row) {
					if (enabled) {
						if (f.enabled == null || f.enabled) {
							if (f.readonly == null || !f.readonly) return f;
						}
					}
					else {
						return f;
					}
				}
			}
			return null;
		}

		focusOn(fieldId: string): this {
			if (!this.mounted) return this;
			let f = this.getField(fieldId);
			if (!f) return this;
			if (f.component) {
				f.component.focus();
			}
			else if (f.element instanceof HTMLElement) {
				f.element.focus();
			}
			return this;
		}

		getField(fid: string): WField {
			if (!fid) return;
			let sid = fid.indexOf(this.id + '-') == 0 ? fid : this.subId(fid);
			for (let i = 0; i < this.rows.length; i++) {
				let row = this.rows[i];
				for (let j = 0; j < row.length; j++) {
					let f = row[j];
					if (f.id == sid) return f;
				}
			}
			return;
		}

		getComponent(fid: string, def?: WComponent): WComponent {
			let f = this.getField(fid);
			if(!f) {
				console.error('[' + str(this) + '] Field ' + fid + ' not found.');
				return def;
			}
			let c = f.component;
			if(!c) {
				console.error('[' + str(this) + '] Field ' + fid + ' has no components.');
				return def;
			}
			return c;
		}

		onField(fid: string, events: 'mount' | 'unmount' | 'statechange' | 'propschange', handler: (e: WEvent) => any): this;
		onField(fid: string, events: 'click' | 'dblclick' | 'mouseenter' | 'mouseleave' | 'keypress' | 'keydown' | 'keyup' | 'submit' | 'change' | 'focus' | 'blur' | 'resize', handler: (e: Event) => any): this;
		onField(fid: string, events: string, handler: (e: any) => any): this;
		onField(fid: string, events: string, handler: (e: any) => any): this {
			let c = this.getComponent(fid);
			if(!c) return this;
			c.on(events, handler);
			return this;
		}

		findOption(fid: string, text: string, d: any = null): any {
			if (!text) text = '';
			let c = this.getComponent(fid);
			if(!c) return d;
			if(c instanceof WSelect) {
				return c.findOption(text, d);
			}
			return d;
		}

		setOptionValue(fid: string, text: string, d: any = null): this {
			this.setValue(fid, this.findOption(fid, text, d));
			return this;
		}

		addRow(classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object, type: string = 'row'): this {
			if (this.currRow && !this.currRow.length) {
				this.roww[this.roww.length - 1] = {
					classStyle: classStyle,
					style: style,
					id: id,
					attributes: WUX.attributes(attributes),
					type: type
				};
				return this;
			}
			this.currRow = [];
			this.rows.push(this.currRow);
			this.roww.push({
				classStyle: classStyle,
				style: style,
				id: id,
				attributes: WUX.attributes(attributes),
				type: type
			});
			return this;
		}

		protected _add(id: string, label: string, co: WComponent, type: string, opts?: WField): this {
			let f = opts ? opts : {};
			if(co instanceof WInput) {
				co.readonly = !!f.readonly;
				co.autofocus = !!f.autofocus;
				co.onEnter((e: KeyboardEvent) => {
					if (this.handlers['_enter']) {
						for (let h of this.handlers['_enter']) h(e);
					}
				});
			}
			else if(co instanceof WTextArea) {
				co.readonly = !!f.readonly;
				co.autofocus = !!f.autofocus;
			}
			else {
				co.enabled = !f.readonly;
			}
			if(f.attributes) co.attributes = f.attributes;
			if(f.tooltip) co.tooltip = f.tooltip;
			if(f.style) co.style = style(f.style);
			f.id = id;
			f.label = label;
			f.component = co;
			f.type = type;
			this.currRow.push(f);
			return this;
		}

		addTextField(fieldId: string, label: string, opts?: WField): this {
			let id = this.subId(fieldId);
			let co = new WInput(id, 'text', 0, CSS.FORM_CTRL);
			return this._add(id, label, co, 'text', opts);
		}

		addNumberField(fieldId: string, label: string, min: number, max: number, opts?: WField): this {
			let id = this.subId(fieldId);
			let co = new WInput(id, 'number', 0, CSS.FORM_CTRL);
			let at = 'min="' + min + '" max="' + max + '"';
			if (!opts) opts = {};
			if (opts.attributes) opts.attributes += ' ' + at;
			else opts.attributes = at;
			return this._add(id, label, co, 'number', opts);
		}

		addPasswordField(fieldId: string, label: string, opts?: WField): this {
			let id = this.subId(fieldId);
			let co = new WInput(id, 'password', 0, CSS.FORM_CTRL);
			return this._add(id, label, co, 'password', opts);
		}

		addDateField(fieldId: string, label: string, opts?: WField): this {
			let id = this.subId(fieldId);
			let co = new WInput(id, 'date', 0, CSS.FORM_CTRL);
			return this._add(id, label, co, 'date', opts);
		}

		addMonthField(fieldId: string, label: string, opts?: WField): this {
			let id = this.subId(fieldId);
			let co = new WInput(id, 'month', 0, CSS.FORM_CTRL);
			return this._add(id, label, co, 'month', opts);
		}

		addTimeField(fieldId: string, label: string, opts?: WField): this {
			let id = this.subId(fieldId);
			let co = new WInput(id, 'time', 0, CSS.FORM_CTRL);
			return this._add(id, label, co, 'time', opts);
		}

		addEmailField(fieldId: string, label: string, opts?: WField): this {
			let id = this.subId(fieldId);
			let co = new WInput(id, 'email', 0, CSS.FORM_CTRL);
			return this._add(id, label, co, 'email', opts);
		}

		addNoteField(fieldId: string, label: string, rows: number, opts?: WField): this {
			if (!rows) rows = 3;
			let id = this.subId(fieldId);
			let co = new WTextArea(id, rows, CSS.FORM_CTRL);
			return this._add(id, label, co, 'note', opts);
		}

		addFileField(fieldId: string, label: string, opts?: WField): this {
			let id = this.subId(fieldId);
			let co = new WInput(id, 'file', 0, CSS.FORM_CTRL);
			return this._add(id, label, co, 'file', opts);
		}

		addOptionsField(fieldId: string, label: string, options?: (string | WEntity)[], opts?: WField): this {
			let id = this.subId(fieldId);
			let co = new WSelect(id, options, false, CSS.FORM_CTRL);
			return this._add(id, label, co, 'select', opts);
		}

		addRadioField(fieldId: string, label: string, options?: (string | WEntity)[], opts?: WField): this {
			let id = this.subId(fieldId);
			let co = new WRadio(id, options, CSS.FORM_CTRL, CSS.CHECK_STYLE);
			return this._add(id, label, co, 'select', opts);
		}

		addBooleanField(fieldId: string, label: string, labelCheck?: string, opts?: WField): this {
			let id = this.subId(fieldId);
			let co = new WCheck(id, '');
			co.divClass = CSS.FORM_CHECK;
			co.divStyle = CSS.CHECK_STYLE;
			co.classStyle = CSS.FORM_CTRL;
			co.label = labelCheck;
			return this._add(id, label, co, 'boolean', opts);
		}

		addToggleField(fieldId: string, label: string, labelCheck?: string, opts?: WField): this {
			let id = this.subId(fieldId);
			let co = new WCheck(id, '');
			co.lever = true;
			co.divClass = CSS.FORM_CHECK;
			co.divStyle = CSS.CHECK_STYLE;
			co.classStyle = CSS.FORM_CTRL;
			co.leverStyle = CSS.LEVER_STYLE
			co.label = labelCheck;
			return this._add(id, label, co, 'boolean', opts);
		}

		addBlankField(label?: string, classStyle?: string, style?: string | WStyle, e?: WElement): this {
			let co = new WContainer('', classStyle, style);
			if(e) co.add(e);
			return this._add('', label, co, 'blank', {});
		}

		addCaption(text: string, icon?: string, classStyle?: string, style?: string | WStyle, opts?: WField): this {
			if (!text) text = '';
			let co = new WLabel('', text, icon, classStyle, style);
			return this._add('', '', co, 'caption', opts);
		}

		addHiddenField(fieldId: string, value?: any): this {
			let id = this.subId(fieldId);
			let vs = WUtil.toString(value);
			let co = new WInput(id, 'hidden');
			co.setState(vs)
			this.currRow.push({ id: id, component: co, value: vs, type: 'hidden' });
			return this;
		}

		addInternalField(fieldId: string, value?: any): this {
			if (value === undefined) value = null;
			this.currRow.push({ id: this.subId(fieldId), value: value, type: 'internal' });
			return this;
		}

		addComponent(fieldId: string, label: string, component: WComponent, opts?: WField): this {
			if (!component) return this;
			if (fieldId) {
				let id = this.subId(fieldId);
				component.id = id;
				return this._add(id, label, component, 'component', opts);
			}
			else {
				component.id = '';
				return this._add('', label, component, 'component', opts);
			}
			return this;
		}

		addToFooter(c: WElement): this {
			if (!c && !this.footer) return this;
			this.footer.push(c)
			return this;
		}

		protected componentDidMount(): void {
			this.fieldset = document.createElement('fieldset');
			if(!this._enabled) {
				this.fieldset.setAttribute('disabled', '');
			}
			this.root.appendChild(this.fieldset);

			this.main = new WContainer(this.id + '__c', this.mainClass, this.mainStyle);
			for (let i = 0; i < this.rows.length; i++) {
				let w = this.roww[i];
				this.main.addRow(WUX.cls(w.type, w.classStyle, w.style), WUX.style(w.style));
				
				let row = this.rows[i];
				
				// Calcolo colonne effettive
				let cols = 0;
				for (let j = 0; j < row.length; j++) {
					let f = row[j];
					if (!f.component || f.type == 'hidden') continue;
					cols += f.span && f.span > 0 ? f.span : 1;
				}
				let g = !!CSS.FORM_GROUP;
				for (let j = 0; j < row.length; j++) {
					let f = row[j];

					if (!f.component) continue;
					if (f.type == 'hidden') {
						f.component.mount(this.fieldset);
						continue;
					}
					
					let cs = Math.floor(12 / cols);
					if (cs < 1) cs = 1;
					if ((cs == 1 && cols < 11) && (j == 0 || j == cols - 1)) cs = 2;
					if (f.span && f.span > 0) cs = cs * f.span;
					if (f.colClass) {
						if (WUtil.starts(f.colClass, 'col-')) {
							this.main.addCol(f.colClass, f.colStyle);
						}
						else {
							this.main.addCol((cs + ' ') + f.colClass, f.colStyle);
						}
					}
					else {
						this.main.addCol('' + cs, f.colStyle);
					}
					
					if (f.type != 'caption') f.component.setState(f.value);
					if (f.label && !f.labelComp) {
						let r = f.required ? RES.REQ_MARK : '';
						let lc = CSS.LBL_CLASS;
						let ls = '';
						if (f.labelCss) {
							if (f.labelCss.indexOf(':')) {
								ls = f.labelCss;
							}
							else {
								lc = f.labelCss;
							}
						}
						else if (f.classStyle) {
							lc = f.classStyle;
						}
						let l = new WLabel(f.id + '-l', f.label + r, '', lc, ls);
						f.labelComp = l.for(f.id);
					}
					
					if (g) {
						if (f.type == 'select') {
							this.main.addGroup({classStyle: CSS.SEL_WRAPPER, style: this.groupStyle}, f.labelComp, f.component);
						}
						else {
							this.main.addGroup({classStyle: CSS.FORM_GROUP, style: this.groupStyle}, f.labelComp, f.component);
						}
					}
					else {
						this.main.add(f.labelComp);
						this.main.add(f.component);
					}
				}
			}
			this.main.mount(this.fieldset);
			if (this.footer && this.footer.length) {
				this.foot = new WContainer(this.subId('__foot'), this.footerClass, this.footerStyle);
				for(let f of this.footer) {
					this.foot.addRow().addCol('12').add(f);
				}
				this.foot.mount(this.root);
			}
		}

		componentWillUnmount(): void {
			if (this.main) this.main.unmount();
			if (this.foot) this.foot.unmount();
			for (let r of this.rows) {
				for (let f of r) {
					let c = f.component;
					if (c && f.type == 'hidden') c.unmount();
				}
			}
		}

		clear(): this {
			for (let i = 0; i < this.rows.length; i++) {
				let row = this.rows[i];
				for (let j = 0; j < row.length; j++) {
					let f = row[j];
					if (f.type == 'caption') continue;
					if (f.component) f.component.setState(null);
					f.value = null;
				}
			}
			return this;
		}

		setValue(fid: string, v: any, updState: boolean = true): this {
			let f = this.getField(fid);
			if (!f) return this;
			if (f.type == 'date') v = isoDate(v);
			if (f.type == 'time') v = formatTime(v, false);
			if (f.component) f.component.setState(v);
			f.value = v;
			if (updState) {
				if (!this.state) this.state = {};
				this.state[fid] = v;
			}
			return this;
		}

		setValueOf(fid: string, v: any, k: string, updState: boolean = true): this {
			let f = this.getField(fid);
			if (!f) return this;
			let w = v;
			let x = k ? k.indexOf('.') : -1;
			if (w != null && x > 0) {
				w = w[k.substring(0, x)];
				k = k.substring(x + 1);
			}
			if (w != null && typeof w == 'object') {
				if (k != null) w = w[k];
			}
			if (f.type == 'date') w = isoDate(w);
			if (f.type == 'time') w = formatTime(w, false);
			if (f.component) f.component.setState(w);
			f.value = w;
			if (updState) {
				if (!this.state) this.state = {};
				this.state[fid] = w;
			}
			return this;
		}

		getValue(fid: string | WField): any {
			let f = typeof fid == 'string' ? this.getField(fid) : fid;
			if (!f) return null;
			if (f.component) return f.component.getState();
			return f.value;
		}

		getFile(fid: string, onload: (f: File, b64: string) => any): File;
		getFile(fid: string, x: number, onload: (f: File, b64: string) => any): File;
		getFile(fid: string, x: number | ((f: File, b64: string) => any), onload?: (f: File, b64: string) => any): File {
			let f = this.getField(fid);
			if (!f || !f.id) return null;
			let i = document.getElementById(f.id) as HTMLInputElement;
			if (!i || !i.files) return null;
			if (typeof x == 'function') {
				onload = x;
				x = 0;
			}
			if (x < 0) x = i.files.length + x;
			if (x < 0 || x >= i.files.length) return null;
			let l = i.files[x];
			if (!l) return null;
			if (onload) {
				let r  = new FileReader();
				r.onload = (e: any) => {
					if (!e || !e.target) return;
					let s =  e.target.result as string;
					if (!s) return;
					let a = s.split(',');
					if (!a || a.length < 2) return;
					onload(l, a[1]);
				};
				r.readAsDataURL(l);
			}
			return l;
		}

		setOptions(fid: string, options: Array<string | WEntity>, prevVal?: boolean): this {
			let f = this.getField(fid);
			if (!f) return this;
			let c = f.component;
			if (c instanceof WUX.WSelect) {
				c.setOptions(options, prevVal);
			}
			else if (c instanceof WUX.WRadio) {
				c.setOptions(options, prevVal);
			}
			return this;
		}

		setSpan(fieldId: string, span: number): this {
			let f = this.getField(fieldId);
			if (!f) return this;
			f.span = span;
			return this;
		}

		setEnabled(fieldId: string, v: boolean): this {
			let f = this.getField(fieldId);
			if (!f) return this;
			f.enabled = v;
			if (f.component) f.component.enabled = v;
			return this;
		}

		setReadOnly(fieldId: string, v: boolean): this {
			let f = this.getField(fieldId);
			if (!f) return this;
			f.readonly = v;
			let c = f.component;
			if (c instanceof WUX.WInput || c instanceof WUX.WTextArea) {
				c.readonly = v;
			}
			return this;
		}

		getValues(): any {
			let v = {};
			for (let r of this.rows) {
				for (let f of r) {
					let k = this.ripId(f.id);
					if (!k) continue;
					v[k] = f.component ? f.component.getState() : f.value;
				}
			}
			return v;
		}

		getState() {
			this.state = this.getValues();
			return this.state;
		}

		protected updateState(nextState: any): void {
			super.updateState(nextState);
			if (!nextState || WUtil.isEmpty(nextState)) {
				this.clear();
			}
			else {
				this.updateView();
			}
		}

		protected updateView() {
			if (!this.state) {
				this.clear();
				return;
			}
			for (let id in this.state) {
				this.setValue(id, this.state[id], false);
			}
		}

		setMandatory(...fids: string[]): this {
			if (!this.rows) return this;
			let sids: string[] = [];
			for (let fid of fids) {
				let sid = fid.indexOf(this.id + '-') == 0 ? fid : this.subId(fid);
				sids.push(sid);
			}
			for (let i = 0; i < this.rows.length; i++) {
				let row = this.rows[i];
				for (let j = 0; j < row.length; j++) {
					let f = row[j];
					if (sids.indexOf(f.id) >= 0) {
						f.required = true;
					}
					else {
						f.required = false;
					}
				}
			}
			return this;
		}

		checkMandatory(labels?: boolean, focus?: boolean, atLeastOne?: boolean): string {
			let values = this.getState();
			if (!values) values = {};
			let r = '';
			let x = '';
			let a = false;
			for (let i = 0; i < this.rows.length; i++) {
				let row = this.rows[i];
				for (let j = 0; j < row.length; j++) {
					let f = row[j];
					let id = this.ripId(f.id);
					let v = values[id];
					if (f.required) {
						if (v == null || v == '') {
							if (labels) {
								r += ',' + f.label;
							}
							else {
								r += ',' + id;
							}
							if (!x) x = id; // first
						}
						else {
							a = true;
						}
					}
				}
			}
			if (atLeastOne && a) return '';
			if (x && focus) this.focusOn(x);
			if (r) return r.substring(1);
			return r;
		}
	}
}