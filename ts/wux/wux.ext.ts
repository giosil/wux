namespace WUX {
	
	export let BS_VER = 5;
	export let BS_DLG_X: string | WWrapper = '';
	
	export function JQ(e: any): JQuery {
		let jq = window['jQuery'] ? window['jQuery'] as JQueryStatic : null;
		if(!jq) {
			console.error('[WUX] jQuery is not available');
			return null;
		}
		let r = jq(e);
		if(!r.length) {
			console.error('[WUX] !jQuery(' + e + ').length==true');
			return null;
		}
		return r;
	}
	
	export function setJQCss(e: WComponent | JQuery, ...a: (string | WStyle)[]): WComponent | JQuery {
		if (!e || !a || !a.length) return e;
		if (e instanceof WComponent) {
			e.css(...a);
		}
		else if (e instanceof jQuery) {
			if (!e.length) return e;
			let s = css(...a);
			let c = cls(...a);
			if (c) e.addClass(c);
			if (s) e.attr('style',s);
		}
		return e;
	}
	
	// Bootstrap / JQuery
	export class WDialog<P = any, S = any> extends WUX.WComponent<P, S> {
		cntRoot: WUX.WContainer;
		cntMain: WUX.WContainer;
		cntContent: WUX.WContainer;
		cntHeader: WUX.WContainer;
		cntBody: WUX.WContainer;
		cntFooter: WUX.WContainer;
		mainClass: string;
		contClass: string;
		contStyle: string;
		bodyClass: string;
		// GUI
		_title: string;
		tagTitle: string;
		btnClose: WUX.WButton;
		btnOK: WUX.WButton;
		btnCancel: WUX.WButton;
		txtCancel: string;
		buttons: WUX.WButton[];
		// Flag
		ok: boolean;
		cancel: boolean;
		isShown: boolean;
		fullscreen: boolean;
		// Control
		// parent handler
		ph: (e?: JQueryEventObject) => any;
		// show handler
		sh: (e?: JQueryEventObject) => any;
		// hidden handler
		hh: (e?: JQueryEventObject) => any;
		// Pages
		wp: WPages;
		pg: number = 0;

		constructor(id: string, name: string = 'WDialog', btnOk = true, btnClose = true, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
			super(id, name, undefined, classStyle, style, attributes);
			this.buttons = [];
			if (btnClose) {
				if (!btnOk) this.txtCancel = RES.CLOSE;
				this.buttonCancel();
			}
			if (btnOk) this.buttonOk();
			this.ok = false;
			this.cancel = false;
			this.isShown = false;
			// Auto-mount
			if (this.id && this.id != '*') {
				let e = document.getElementById(this.id);
				if(e) e.remove();
			}
			WuxDOM.onRender((e: WUX.WEvent) => {
				if (this.mounted) return;
				if (this.wp) return;
				this.mount(e.element);
			});
		}

		addToPages(wp: WPages, headVis: boolean = true, footVis: boolean = true, headStyle?: string | WStyle, footStyle?: string | WStyle, btnStyle?: string | WStyle): this {
			this.wp = wp;
			if(!wp) return this;
			this.isShown = false;
			if(!this.contClass) this.contClass = CSS.DIALOG_CONTENT;
			this.cntRoot = new WContainer(this.id);
			this.cntMain = this.cntRoot.addContainer('', this.mainClass, this._style);
			this.cntContent = this.cntMain.addContainer('', this.contClass, this.contStyle);
			if (headVis && this.cntHeader) {
				if(headStyle == null) headStyle = 'margin-bottom:2rem;';
				this.cntHeader.style = css(this.cntHeader.style, headStyle);
				this.cntContent.addContainer(this.cntHeader);
			}
			if (this.cntBody) this.cntContent.addContainer(this.cntBody);
			if (footVis) {
				if (btnStyle == null) btnStyle = 'margin:0.25rem;';
				for (let btn of this.buttons) {
					btn.style = css(btn.style, btnStyle);
					this.footer.add(btn);
				}
				if (this.cntFooter) {
					if (footStyle) {
						this.cntFooter.style = css(this.cntFooter.style, footStyle);
					}
					this.cntContent.addContainer(this.cntFooter);
				}
			}
			wp.add(this.cntRoot);
			this.pg = wp.pages - 1;
			return this;
		}

		makeUp(title: string, body: string | WUX.WComponent, onHidden?: (e?: JQueryEventObject) => any): this {
			this.title = title;
			this.body.addRow().addCol('12').add(body);
			if(onHidden) this.hh = onHidden;
			return this;
		}

		onShownModal(handler: (e?: JQueryEventObject) => any): this {
			this.sh = handler;
			return this;
		}

		onHiddenModal(handler: (e?: JQueryEventObject) => any): this {
			this.hh = handler;
			return this;
		}

		get header(): WUX.WContainer {
			if (this.cntHeader) return this.cntHeader;
			this.cntHeader = new WUX.WContainer('', CSS.DIALOG_HEADER);
			return this.cntHeader;
		}

		get body(): WUX.WContainer {
			if (this.cntBody) return this.cntBody;
			this.cntBody = new WUX.WContainer('', WUX.cls(CSS.DIALOG_BODY, this.bodyClass), '', this._attributes);
			return this.cntBody;
		}

		get footer(): WUX.WContainer {
			if (this.cntFooter) return this.cntFooter;
			this.cntFooter = new WUX.WContainer('', CSS.DIALOG_FOOTER);
			return this.cntFooter;
		}

		get title(): string {
			return this._title;
		}
		set title(s: string) {
			this._title = s;
			let te = document.getElementById(this.subId('title'));
			if(te) {
				te.innerText = s;
			}
			else {
				if(BS_DLG_X) {
					if(typeof BS_DLG_X == 'string') {
						this.btnClose = new WUX.WButton(this.subId('bhc'), BS_DLG_X, '', 'close');
					}
					else {
						this.btnClose = new WUX.WButton(this.subId('bhc'), BS_DLG_X.title, BS_DLG_X.icon, BS_DLG_X.classStyle, BS_DLG_X.style, BS_DLG_X.attributes);
					}
				}
				else if(BS_VER > 4) {
					// Bootstrap 5.x+
					this.btnClose = new WUX.WButton(this.subId('bhc'), '', '', 'btn-close', '', 'aria-label="' + RES.CLOSE + '"');
				}
				else {
					this.btnClose = new WUX.WButton(this.subId('bhc'), '<span aria-hidden="true">&times;</span>', '', 'close');
				}
				// No data-dismiss="modal" or data-bs-dismiss="modal", but:
				this.btnClose.on('click', (e: PointerEvent) => {
					this.close();
				});
				if(CSS.DIALOG_X_POS >= 0) {
					this.header.add(this.buildTitle()).add(this.btnClose);
				}
				else {
					this.header.add(this.btnClose).add(this.buildTitle());
				}
			}
		}

		protected onClickOk(): boolean {
			return true;
		}

		protected onClickCancel(): boolean {
			return true;
		}

		protected buildBtnOK(): WUX.WButton {
			return new WUX.WButton(this.subId('bfo'), RES.OK, '', CSS.DIALOG_OK, '', '');
		}

		protected buildBtnCancel(): WUX.WButton {
			if (this.txtCancel) {
				return new WUX.WButton(this.subId('bfc'), this.txtCancel, '', CSS.DIALOG_CANCEL, '', '');
			}
			return new WUX.WButton(this.subId('bfc'), RES.CANCEL, '', CSS.DIALOG_CANCEL, '', '');
		}

		fireOk(): void {
			if (this.onClickOk()) this.doOk();
		}

		fireCancel(): void {
			if (this.onClickCancel()) this.doCancel();
		}

		doOk(): void {
			this.ok = true;
			this.cancel = false;
			if(this.wp) {
				this.wp.back();
				this._h();
				return;
			}
			if(this.$r) this.$r.modal('hide');
		}

		doCancel(): void {
			this.ok = false;
			this.cancel = true;
			if(this.wp) {
				this.wp.back();
				this._h();
				return;
			}
			if(this.$r) this.$r.modal('hide');
		}

		buttonOk(): WUX.WButton {
			if (this.btnOK) return this.btnOK;
			this.btnOK = this.buildBtnOK();
			this.btnOK.on('click', (e: JQueryEventObject) => {
				
				this.fireOk();

			});
			this.buttons.push(this.btnOK);
		}

		buttonCancel(): WUX.WButton {
			if (this.btnCancel) return this.btnCancel;
			this.btnCancel = this.buildBtnCancel();
			this.btnCancel.on('click', (e: JQueryEventObject) => {

				this.fireCancel();

			});
			this.buttons.push(this.btnCancel);
		}

		updButtons(ok?: string, canc?: string): this {
			if(this.btnOK) {
				if(ok) {
					this.btnOK.setText(ok);
					this.btnOK.visible = true;
				}
				else if(ok == '') {
					this.btnOK.visible = false;
				}
				else {
					this.btnOK.setText(RES.OK);
					this.btnOK.visible = true;
				}
			}
			if(this.btnCancel) {
				if(canc) {
					this.btnCancel.setText(canc);
					this.btnCancel.visible = true;
				}
				else if(canc == '') {
					this.btnCancel.visible = false;
				}
				else {
					this.btnCancel.setText(RES.CANCEL);
					this.btnCancel.visible = true;
				}
			}
			return this;
		}

		show(parent?: WUX.WComponent, handler?: (e?: JQueryEventObject) => any): void {
			if (!this.beforeShow()) return;
			this.ok = false;
			this.cancel = false;
			this.parent = parent;
			this.ph = handler;
			if (this.wp) {
				this.wp.show(this.pg);
				this._s();
				return;
			}
			if (!this.mounted) WuxDOM.mount(this);
			if (!this.$r) return;
			this.$r.modal({ backdrop: 'static', keyboard: false, show: false});
			this.$r.modal('show');
		}

		hide(): void {
			if (this.wp) {
				this.wp.back();
				this._h();
				return;
			}
			if (this.$r) this.$r.modal('hide');
		}

		close(): void {
			this.ok = false;
			this.cancel = false;
			if (this.wp) {
				this.wp.back();
				this._h();
				return;
			}
			if (this.$r) this.$r.modal('hide');
		}

		protected beforeShow(): boolean {
			return true;
		}

		protected onShown() {
		}

		protected onHidden() {
		}

		protected render() {
			if(!this._classStyle) this._classStyle = CSS.DIALOG_CLASS;
			if(!this.mainClass) this.mainClass = this.fullscreen ? CSS.DIALOG_FULL : CSS.DIALOG_MAIN;
			if(!this.contClass) this.contClass = CSS.DIALOG_CONTENT;
			this.isShown = false;
			this.cntRoot = new WUX.WContainer(this.id, this._classStyle, '', 'role="dialog" tabindex="-1" aria-hidden="true"');
			this.cntMain = this.cntRoot.addContainer('', this.mainClass, this._style);
			this.cntContent = this.cntMain.addContainer('', this.contClass, this.contStyle);
			if (this.cntHeader) this.cntContent.addContainer(this.cntHeader);
			if (this.cntBody) this.cntContent.addContainer(this.cntBody);
			for (let btn of this.buttons) this.footer.add(btn);
			if (this.cntFooter) this.cntContent.addContainer(this.cntFooter);
			return this.cntRoot;
		}

		protected componentDidMount(): void {
			if (!this.$r) return;
			this.$r.on('shown.bs.modal', (e: JQueryEventObject) => {
				this._s(e);
			});
			this.$r.on('hidden.bs.modal', (e: JQueryEventObject) => {
				this._h(e);
			});
		}

		protected _s(e?: JQueryEventObject) {
			if (!e) e = {"type": "shown"} as JQueryEventObject
			this.isShown = true;
			this.onShown();
			if (this.sh) this.sh(e);
		}

		protected _h(e?: JQueryEventObject) {
			if (!e) e = {"type": "hidden"} as JQueryEventObject
			this.isShown = false;
			this.onHidden();
			if (this.hh) this.hh(e);
			if (this.ph) {
				this.ph(e);
				this.ph = null;
			}
		}

		componentWillUnmount(): void {
			this.isShown = false;
			if (this.btnClose) this.btnClose.unmount();
			if (this.btnCancel) this.btnCancel.unmount();
			if (this.cntFooter) this.cntFooter.unmount();
			if (this.cntBody) this.cntBody.unmount();
			if (this.cntHeader) this.cntHeader.unmount();
			if (this.cntContent) this.cntContent.unmount();
			if (this.cntMain) this.cntMain.unmount();
			if (this.cntRoot) this.cntRoot.unmount();
		}

		protected buildTitle(): string {
			if (!this.tagTitle) this.tagTitle = CSS.DIALOG_TITLE_TAG ? CSS.DIALOG_TITLE_TAG : 'h5';
			let c = this.wp ? '' : buildCss(CSS.DIALOG_TITLE);
			return '<' + this.tagTitle + c + ' id="' + this.subId('title') + '">' + WUtil.toText(this._title) + '</' + this.tagTitle + '>';
		}
	}
	
	export class WTab extends WComponent<any, number> {
		tabs: WContainer[];
		contStyle: string | WStyle;
		ulClass: string;
		tpClass: string;
		saClass: string;
		
		_t: string;
		_a: string;
		_r: string;
		
		constructor(id?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, props?: any) {
			// WComponent init
			super(id ? id : '*', 'WTab', props, classStyle, style, attributes);
			// WTab init
			this.tabs = [];
			if(BS_VER > 4) {
				// Bootstrap 5.x+
				this._t = 'button';
				this._a = 'data-bs-toggle';
				this._r = 'data-bs-target';
			}
			else {
				this._t = 'a';
				this._a = 'data-toggle';
				this._r = 'href';
			}
		}

		addTab(title: string, icon?: string, style?: string | WStyle, attributes?: string | object): WContainer {
			let tab = new WContainer('', 'panel-body', style, attributes);
			tab.name = WUX.buildIcon(icon, '', ' ') + title;
			this.tabs.push(tab);
			return tab;
		}

		get count(): number {
			return this.tabs ? this.tabs.length : 0;
		}

		isEnabled(i: number): boolean {
			if (i < 0) i = this.tabs.length + i;
			let p = document.getElementById(this.id + '-p' + i);
			if (!p) return false;
			let c = p.getAttribute('class');
			if (!c) return true;
			return c.indexOf('disabled') < 0;
		}

		setEnabled(i: number, e: boolean): this {
			if (i < 0) i = this.tabs.length + i;
			let p = document.getElementById(this.id + '-p' + i);
			if (!p) return this;
			let c = p.getAttribute('class');
			if (!c) return this;
			if (e) {
				if (c.indexOf('disabled') < 0) return this;
				c = c.replace('disabled', '').trim();
				p.removeAttribute('tabindex');
				p.removeAttribute('aria-disabled');
			}
			else {
				if (c.indexOf('disabled') >= 0) return this;
				c += ' disabled';
				p.setAttribute('tabindex', '-1');
				p.setAttribute('aria-disabled', 'true');
			}
			p.setAttribute('class', c);
			return this;
		}

		protected render() {
			if (!this.state) this.state = 0;
			let r: string = '<div';
			if (this._classStyle) {
				r += ' class="tabs-container ' + this._classStyle + '"';
			}
			else {
				r += ' class="tabs-container"';
			}
			r += ' id="' + this.id + '"';
			if (this._style) r += ' style="' + this._style + '"';
			if (this._attributes) r += ' ' + this._attributes;
			r += '>';
			if (!this.ulClass) this.ulClass = 'nav nav-tabs';
			r += '<ul class="' + this.ulClass + '" role="tablist">';
			for (let i = 0; i < this.tabs.length; i++) {
				let tab = this.tabs[i];
				if (i == this.state) {
					r += '<li class="nav-item' + (BS_VER < 4 ? ' active' : '') + '" role="presentation"><' + this._t + ' class="nav-link active" ' + this._a + '="tab" ' + this._r + '="#' + this.id + '-' + i + '" role="tab" id="' + this.id + '-p' + i + '"> ' + tab.name + '</'  + this._t + '></li>';
				}
				else {
					r += '<li class="nav-item" role="presentation"><' + this._t + ' class="nav-link" ' + this._a + '="tab" ' + this._r + '="#' + this.id + '-' + i + '" role="tab" id="' + this.id + '-p' + i + '">' + tab.name + '</'  + this._t + '></li>';
				}
			}
			r += '</ul>';
			let cs = css(this.contStyle);
			if(cs) cs = ' style="' + cs + '"';
			r += '<div class="tab-content"' + cs + '>';
			if (!this.tpClass) this.tpClass = 'tab-pane';
			if (!this.saClass) {
				this.saClass = BS_VER < 4 ? 'active' : 'show active';
			}
			for (let i = 0; i < this.tabs.length; i++) {
				if (i == this.state) {
					r += '<div id="' + this.id + '-' + i + '" class="' + this.tpClass + ' ' + this.saClass + '" role="tabpanel"></div>';
				}
				else {
					r += '<div id="' + this.id + '-' + i + '" class="' + this.tpClass + '" role="tabpanel"></div>';
				}
			}
			r += '</div></div>';
			return r;
		}

		protected componentDidUpdate(prevProps: any, prevState: any): void {
			let $t = JQ('.nav-tabs ' + this._t + '[' + this._r + '="#' + this.id + '-' + this.state + '"]');
			if (!$t) return;
			$t.tab('show');
		}

		protected componentDidMount(): void {
			if (!this.tabs.length) return;
			for (let i = 0; i < this.tabs.length; i++) {
				let container = this.tabs[i];
				let tabPane = document.getElementById(this.id + '-' + i);
				if (!tabPane) continue;
				container.mount(tabPane);
			}
			this.$r.find(this._t + '[' + this._a + '="tab"]').on('shown.bs.tab', (e?: JQueryEventObject) => {
				let t = e.target;
				let b = '';
				if(t instanceof Element) {
					b = t.getAttribute(this._r);
				}
				if(!b) return;
				let sep = b.lastIndexOf('-');
				if (sep >= 0) this.setState(parseInt(b.substring(sep + 1)));
			});
		}

		componentWillUnmount(): void {
			for (let c of this.tabs) {
				if(c) c.unmount();
			}
		}
	}
}