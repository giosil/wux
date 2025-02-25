WUX.dxTableDidMount = () => {
	let i = document.querySelector('.dx-datagrid .dx-icon.dx-icon-export-excel-button');
	if (i) {
		let b = i.parentElement;
		b.setAttribute('style', 'padding:4px');
		b.innerHTML = '<i class="fa fa-file-excel text-primary" style="font-size:1.4rem;"></i>';
	}
};

namespace APP {

	import WUtil = WUX.WUtil;

	export function getPageComponent(): WUX.WComponent {
		let p = WUX.WUtil.getParam('test');
		switch(window.location.pathname) {
			case '/app-adc':  return new GUIText('Aree di competenza', 'In fase di sviluppo.');
			case '/app-cco':  return new GUICompetenze('Competenze comportamentali', 'C_COM');
			case '/app-ctp':  return new GUICompetenze('Competenze Tecnico Professionali', 'C_TP');
			case '/app-cts':  return new GUICompetenze('Competenze Tecnico Specialistiche', 'C_TS');
			case '/app-demo': return new GUIDemo();
			case '/app-test': return p == 'bs' ? new GUIEntities() : new GUIEntitiesDX();
			case '/app-mrat': return new GUIRating();
		}
		return null;
	}

	export function showInfo(m: string, title?: string) {
		if(!title) title = "Messaggio";
		window["BSIT"].notify({"state": 'info', "title" : title, "message": m});
	}

	export function showSuccess(m: string, title?: string) {
		if(!title) title = "Messaggio";
		window["BSIT"].notify({"state": 'success', "title" : title, "message": m});
	}

	export function showWarning(m: string, title?: string) {
		if(!title) title = "Messaggio";
		window["BSIT"].notify({"state": 'warning', "title" : title, "message": m});
	}

	export function showError(m: string, title?: string) {
		if(!title) title = "Messaggio";
		window["BSIT"].notify({"state": 'error', "title" : title, "message": m});
	}

	let _dc: DlgConfirm;
	
	export function confirm(m: string, f?: (response: any) => void) {
		if(!_dc) _dc = new DlgConfirm('', m);
		_dc.onHiddenModal((e) => { if(f) f(_dc.ok); });
		_dc.message = m;
		_dc.show();
	}

	export function dropdownBtn(id: string, t: string, items: string, cls: string = 'btn btn-outline-primary') {
		let r = '<button id="' + id + '-b" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="dropdown-toggle ' + cls + '">' + t + ' <i class="fa fa-caret-down"></i></button>';
		let a = ' tabindex="-1"';
		let s = ' style="max-height:180px;overflow-y:auto;"';
		r += '<div id="' + id + '-m"' + a + ' role="menu" aria-hidden="true" class="dropdown-menu"' + s + '>';
		r += '<div class="link-list-wrapper">';
		r += '<ul id="' + id + '-l" class="link-list">';
		if(items) r += items;
		r +=  '</ul></div></div>';
		return r;
	}

	export function addItem(r: any, t: WUX.WComponent) {
		if(!r || !t) return;
		let s = t.getState();
		if(!s) s = [];
		s.push(r);
		t.setState(s);
	}

	export function updItem(r: any, c: WUX.WComponent, f: string, a?: boolean) {
		if(!r || !c || !f) return;
		let s = c.getState();
		if(!s || s.length == 0) return;
		let x = WUtil.indexOf(s, f, r[f]);
		if(x < 0) return;
		s[x] = r;
		if(a) {
			c.setState([]);
			setTimeout(()=> { c.setState(s); }, 0);
		}
		c.setState(s);
	}

	export function delItem(i: number, c: WUX.WComponent) {
		if(i < 0) return;
		let s = c.getState();
		if(!s || s.length <= i) return;
		s.splice(i, 1);
		c.setState(s);
	}

	export function delItemBy(f: string, v: any, c: WUX.WComponent) {
		if(!f || !v || !c) return;
		let s = c.getState();
		if(!s || s.length == 0) return;
		let x = WUtil.indexOf(s, f, v);
		if(x < 0) return;
		s.splice(x, 1);
		c.setState(s);
	}

	export function upSelItem(c: WUX.WDXTable): number {
		let r = c.getSelectedRows();
		if(!r || !r.length) {
			showWarning('Selezionare l\'elemento da spostare');
			return -1;
		}
		let i = r[0];
		if (i < 1) return -1;
		let s = c.getState();
		if (s.length == 1) return -1;
		let e = s[i];
		let p = s[i - 1];
		s[i - 1] = e;
		s[i] = p;
		c.setState(s);
		setTimeout(() => { c.select([i - 1]); }, 50);
		return i - 1;
	}

	export function downSelItem(c: WUX.WDXTable): number {
		let r = c.getSelectedRows();
		if(!r || !r.length) {
			showWarning('Selezionare l\'elemento da spostare');
			return -1;
		}
		let i = r[0];
		if (i < 0) return -1;
		let s = c.getState();
		if (s.length == 1) return -1;
		if (i >= s.length - 1) return -1;
		let e = s[i];
		let n = s[i + 1];
		s[i + 1] = e;
		s[i] = n;
		c.setState(s);
		setTimeout(() => { c.select([i + 1]); }, 50);
		return i + 1;
	}
}