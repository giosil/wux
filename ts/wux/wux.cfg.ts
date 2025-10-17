namespace WUX {

	/** Shared data */
	let _data: { [key: string]: any } = {};
	/** DataChanged callbacks */
	let _dccb: { [key: string]: ((e?: any) => any)[] } = {};
	
	/** Internal init */
	export let init0: (callback: () => any) => any;
	/** App init */
	export let initApp: (callback: () => any) => any;
	
	export let global: WGlobal = {
		locale: 'it',
		rootPath: '',

		init: function _init(callback: () => any) {
			if (debug) console.log('[WUX] global.init...');
			if (init0) {
				if (initApp) {
					init0(() => initApp(callback));
				}
				else {
					init0(callback);
				}
			}
			else if (initApp) {
				initApp(callback);
			}
			else {
				if (callback) callback();
			}
		},

		setData(key: string, data: any, dontTrigger: boolean = false): void {
			if (!key) key = 'global';
			_data[key] = data;
			if (dontTrigger) return;
			if (!_dccb[key]) return;
			for (let cb of _dccb[key]) cb(data);
		},

		getData(key: string, def?: any): any {
			if (!key) key = 'global';
			let r = _data[key];
			if (r == null) return def;
			return r;
		},

		onDataChanged(key: string, callback: (data: any) => any) {
			if (!key) key = 'global';
			if (!_dccb[key]) _dccb[key] = [];
			_dccb[key].push(callback);
		}
	}
	
	export class CSS {
		// Container grid
		static ROW = 'row';
		static COL = 'col-';
		// Sections
		static SEC_DIV_CLASS = 'text-primary';
		static SEC_DIV_STYLE = 'border-bottom:solid 1px;';
		static SEC_TAG = 'h5';
		static SEC_CLASS = '';
		static SEC_STYLE = '';
		static SEC_PARENT = '';
		// Boxes
		static BOX_TAG = 'div';
		static BOX_CLASS = 'callout';
		static BOX_INNER = 'callout-inner';
		static BOX_ICON = '';
		static BOX_TITLE = 'callout-title';
		static BOX_TITLE_TAG = 'span';
		static BOX_TITLE_CLASS = 'text';
		static BOX_TITLE_STYLE = '';
		static BOX_TOOLS_EXT = '';
		static BOX_TOOLS = '';
		static BOX_TOOLS_POS = 0; // -1 left, 0 center, 1 right
		static BOX_CONTENT = '';
		static BOX_FOOTER = '';
		static BOX_CLP_CLASS = '';
		static BOX_CLP_STYLE = 'cursor:pointer;padding-left:1rem;';
		static BOX_CLP = '<i class="fa fa-chevron-up"></i>';
		static BOX_EXP = '<i class="fa fa-chevron-down"></i>';
		// Forms
		static FORM = 'padding-top:16px;';
		static FORM_GROUP = 'form-group';
		static FORM_CTRL = 'form-control';
		static FORM_CHECK = 'form-check form-check-inline';
		static LBL_CLASS = 'active';
		static SEL_WRAPPER = 'select-wrapper';
		static CKDIV_STYLE = 'padding-top:1rem;';
		static CKBOX_STYLE = '';
		static LEVER_CLASS = 'lever';
		static LEVER_STYLE = '';
		// Dialogs
		static DIALOG_CLASS = 'modal fade';
		static DIALOG_MAIN = 'modal-dialog modal-lg';
		static DIALOG_FULL = 'modal-dialog modal-fullscreen';
		static DIALOG_CONTENT = 'modal-content';
		static DIALOG_BODY = 'modal-body';
		static DIALOG_HEADER = 'modal-header';
		static DIALOG_FOOTER = 'modal-footer';
		static DIALOG_TITLE = 'modal-title';
		static DIALOG_TITLE_TAG = 'h5';
		static DIALOG_OK = 'btn btn-primary button-sm';
		static DIALOG_CANCEL = 'btn btn-secondary button-sm';
		static DIALOG_X_POS = 1; // -1 left, 1 right
		// General
		static ICON = 'margin-right:8px;';
		static SEL_ROW = 'primary-bg-a2';
	
		static PRIMARY: WStyle = { bg: '#cce5ff' };
		static SECONDARY: WStyle = { bg: '#e2e3e5' };
		static SUCCESS: WStyle = { bg: '#d4edda' };
		static DANGER: WStyle = { bg: '#f8d7da' };
		static ERROR: WStyle = { bg: '#f8d7da' };
		static WARNING: WStyle = { bg: '#fff3cd' };
		static INFO: WStyle = { bg: '#d1ecf1' };
		
		static LABEL_NOTICE: WStyle = { c: '#aa6a6c', fw: 'bold' };
		static LABEL_INFO: WStyle = { c: '#676a96', fw: 'bold' };
	}
	
	export class RES {
		static OK = 'OK';
		static CLOSE = 'Chiudi';
		static CANCEL = 'Annulla';
		static REQ_MARK = ' *';
	}
	
	// Data format utilities

	export function formatDate(a: any): string {
		if (!a) return '';
		let d = WUtil.toDate(a);
		if (!d) return '';
		let m = d.getMonth() + 1;
		let sm = m < 10 ? '0' + m : '' + m;
		let sd = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
		return sd + '/' + sm + '/' + d.getFullYear();
	}

	export function isoDate(a: any): string {
		if (!a) return '';
		let d = WUtil.toDate(a);
		if (!d) return '';
		let m = d.getMonth() + 1;
		let sm = m < 10 ? '0' + m : '' + m;
		let sd = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
		return d.getFullYear() + '-' + sm + '-' + sd;
	}

	export function formatDateTime(a: any, withSec: boolean = false): string {
		if (!a) return '';
		let d = WUtil.toDate(a);
		if (!d) return '';
		let m = d.getMonth() + 1;
		let sm = m < 10 ? '0' + m : '' + m;
		let sd = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
		let sh = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours();
		let sp = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes();
		if (withSec) {
			let ss = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds();
			return sd + '/' + sm + '/' + d.getFullYear() + ' ' + sh + ':' + sp + ':' + ss;
		}
		return sd + '/' + sm + '/' + d.getFullYear() + ' ' + sh + ':' + sp;
	}

	export function formatTime(a: any, withSec: boolean = false): string {
		if (a == null) return '';
		if (typeof a == 'number') {
			if (withSec) {
				if(a < 10000) a = a * 100;
				let hh = Math.floor(a / 10000);
				let mm = Math.floor((a % 10000) / 100);
				let is = (a % 10000) % 100;
				let sm = mm < 10 ? '0' + mm : '' + mm;
				let ss = is < 10 ? '0' + is : '' + is;
				return hh + ':' + sm + ':' + ss;
			}
			else {
				if(a > 9999) a = Math.floor(a / 100);
				let hh = Math.floor(a / 100);
				let mm = a % 100;
				let sm = mm < 10 ? '0' + mm : '' + mm;
				return hh + ':' + sm;
			}
		}
		if (typeof a == 'string') {
			let s = a.indexOf('T');
			if(s < 0) s = a.indexOf(' ');
			if(s >= 0) a = a.substring(s + 1);
			s = a.indexOf('+');
			if(s < 0) s = a.indexOf('-');
			if(s < 0) s = a.indexOf('Z');
			if(s >= 0) a = a.substring(0, s);
			let n = parseInt(a.replace(':', '').replace('.', ''));
			return formatTime(n);
		}
		if (a instanceof Date) {
			let sh = a.getHours() < 10 ? '0' + a.getHours() : '' + a.getHours();
			let sp = a.getMinutes() < 10 ? '0' + a.getMinutes() : '' + a.getMinutes();
			if (withSec) {
				let ss = a.getSeconds() < 10 ? '0' + a.getSeconds() : '' + a.getSeconds();
				return sh + ':' + sp + ':' + ss;
			}
			return sh + ':' + sp;
		}
		return '';
	}

	/**
	 * Formatta numero alla 2a cifra decimale SENZA separatore migliaia.
	 */
	export function formatNum2(a: any, nz?: string, z?: string, neg?: string): string {
		if (a === '' || a == null) return '';
		let n = WUtil.toNumber(a);
		let r = ('' + (Math.round(n * 100) / 100)).replace('.', ',');
		if (nz != null && n != 0) {
			if (neg != null && n < 0) return neg.replace('$', r);
			return nz.replace('$', r);
		}
		if (z != null && n == 0) return z.replace('$', r);
		return r;
	}

	/**
	 * Formatta numero di default SENZA separatore migliaia. Specificare 'l' per la rappresentazione locale.
	 */
	export function formatNum(a: any, nz?: string, z?: string, neg?: string): string {
		if (a === '' || a == null) return '';
		let n = WUtil.toNumber(a);
		let r = ('' + n).replace('.', ',');
		if (nz != null && n != 0) {
			if (neg != null && n < 0) {
				if (neg == 'l') return n.toLocaleString('it-IT');
				return neg.replace('$', r);
			}
			if (nz == 'l') return n.toLocaleString('it-IT');
			return nz.replace('$', r);
		}
		if (z != null && n == 0) return z.replace('$', r);
		return r;
	}

	/**
	 * Formatta numero alla 2a cifra decimale CON separatore migliaia e riportando SEMPRE le cifre decimali.
	 */
	export function formatCurr(a: any, nz?: string, z?: string, neg?: string): string {
		if (a === '' || a == null) return '';
		let n = WUtil.toNumber(a);
		let r = (Math.round(n * 100) / 100).toLocaleString('it-IT');
		let d = r.indexOf(',');
		if (d < 0) r += ',00';
		if (d == r.length - 2) r += '0';
		if (nz != null && n != 0) {
			if (neg != null && n < 0) return neg.replace('$', r);
			return nz.replace('$', r);
		}
		if (z != null && n == 0) return z.replace('$', r);
		return r;
	}

	/**
	 * Formatta numero alla 5a cifra decimale CON separatore migliaia e riportando SEMPRE le cifre decimali (massimo 2).
	 */
	export function formatCurr5(a: any, nz?: string, z?: string, neg?: string): string {
		if (a === '' || a == null) return '';
		let n = WUtil.toNumber(a);
		let r = ('' + (Math.round(n * 100000) / 100000)).replace('.', ',');
		let d = r.indexOf(',');
		if (d < 0) r += ',00';
		if (d == r.length - 2) r += '0';
		if (d > 0) {
			let s1 = r.substring(0, d);
			let s2 = r.substring(d);
			let s3 = '';
			for (let i = 1; i <= s1.length; i++) {
				if (i > 3 && (i - 1) % 3 == 0) s3 = '.' + s3;
				s3 = s1.charAt(s1.length - i) + s3;
			}
			r = s3 + s2;
		}
		if (nz != null && n != 0) {
			if (neg != null && n < 0) return neg.replace('$', r);
			return nz.replace('$', r);
		}
		if (z != null && n == 0) return z.replace('$', r);
		return r;
	}

	export function formatBoolean(a: any): string {
		if (a == null) return '';
		return a ? 'S' : 'N';
	}

	export function format(a: any): string {
		if (a == null) return '';
		if (typeof a == 'string') return a;
		if (typeof a == 'boolean') return WUX.formatBoolean(a);
		if (typeof a == 'number') {
			let r = ('' + a);
			if (r.indexOf('.') >= 0) return WUX.formatCurr(a);
			return WUX.formatNum(a);
		}
		if (a instanceof Date) return WUX.formatDate(a);
		if (a instanceof WUX.WComponent) {
			return WUX.format(a.getState());
		}
		return '' + a;
	}

	export function saveFile(base64: string, fileName: string, mimeType: string = 'application/octet-stream') {
		const ab = atob(base64);
		const an = new Array(ab.length);
		for (let i = 0; i < ab.length; i++) {
			an[i] = ab.charCodeAt(i);
		}
		const ui8a = new Uint8Array(an);
		const blob = new Blob([ui8a], {type: mimeType});
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = fileName;
		link.click();
	}

	export function viewFile(base64: string, fileName: string, mimeType: string = 'application/octet-stream') {
		const ab = atob(base64);
		const an = new Array(ab.length);
		for (let i = 0; i < ab.length; i++) {
			an[i] = ab.charCodeAt(i);
		}
		const ui8a = new Uint8Array(an);
		const blob = new Blob([ui8a], {type: mimeType});
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.title = fileName;
		link.click();
		setTimeout(() => { URL.revokeObjectURL(url); }, 1000);
	}

	export function getAction(ie: string | Event, c?: WUX.WComponent, tag?: string): WAction {
		if(!ie) return null;
		if(typeof ie == 'string') {
			let s = WUX.lastSub(ie);
			if(!s) return null;
			let x = s.indexOf('_');
			if(x <= 0) return null;
			let n = s.substring(0, x);
			let r = s.substring(x + 1).replace(/\$/g, '-');
			if(tag) tag = tag.toLowerCase();
			return {name: n, ref: r, idx: WUtil.toNumber(r, -1),tag: tag, comp: c};
		}
		else {
			let t = ie.target as Element;
			if(!t) return null;
			let n = t.tagName;
			if(!n) return null;
			if(tag && tag.toLowerCase() != n.toLowerCase()) return null;
			let i = WUX.getId(t);
			if(i) {
				let a = getAction(i, c, n);
				if(a) return a;
			}
			let p = t["parentElement"] as Element;
			if(p) {
				n = p.tagName;
				if(!n) return null;
				if(tag && tag.toLowerCase() != n.toLowerCase()) return null;
			}
			i = WUX.getId(p);
			return getAction(i, c, n);
		}
	}

	export function action(name: string, ref?: string | number, ele?: string, comp?: WUX.WComponent, inner?: string, cls?: string) : string {
		if(typeof ref == 'string') ref = ref.replace(/\-/g, '$');
		if(!ele) ele = 'a';
		let id = comp ? comp.subId(name + '_' + ref) : name + '_' + ref;
		if(ele.indexOf('-') > 0) {
			// icon
			return '<i id="' + id + '" class="fa ' + ele + '" style="cursor:pointer;width:100%;"></i>';
		}
		else {
			// tag
			if(!inner) inner = '';
			if(cls) {
				if(cls.indexOf(':') > 0) {
					return '<' + ele + ' id="' + id + '" style="' + cls + '">' + inner + '</' + ele + '>';
				}
				return '<' + ele + ' id="' + id + '" class="' + cls + '">' + inner + '</' + ele + '>';
			}
			return '<' + ele + ' id="' + id + '" style="cursor:pointer;">' + inner + '</' + ele + '>';
		}
	}
}