namespace WUX {

    /** Shared data */
    let _data: { [key: string]: any } = {};
    /** DataChanged callbacks */
    let _dccb: { [key: string]: ((e?: any) => any)[] } = {};

    export let global: WGlobal = {
        locale: 'it',

        main_class: 'container-fluid',
        con_class: 'container',

        box_class: 'ibox',
        box_header: 'ibox-title',
        box_title: '<h5>$</h5>',
        box_tools: 'ibox-tools',
        box_content: 'ibox-content',
        box_footer: 'ibox-footer',

        chart_bg0: 'rgba(26,179,148,0.5)',
        chart_bg1: 'rgba(220,220,220,0.5)',
        chart_bg2: 'rgba(160,220,255,0.5)',

        chart_bc0: 'rgba(26,179,148,0.7)',
        chart_bc1: 'rgba(220,220,220,0.7)',
        chart_bc2: 'rgba(160,220,255,0.7)',

        chart_p0: 'rgba(26,179,148,1)',
        chart_p1: 'rgba(220,220,220,1)',
        chart_p2: 'rgba(160,220,255,1)',

        // section : { b: '#dddddd', m: '2px 0px 4px 0px', p: '0px 8px 8px 8px' },
        // section_title: { b: 'none', f: 'unset', w: 'unset', m: '-bottom:2px' },

        // section: { b: '-radius:8px', m: '0px 0px 0px 0px', p: '16px 7px 5px 7px', bg: 'white' },
        // section_title: { b: 'none', f: 14, fw: 'bold', w: 'unset', ps: 'relative', t: 12, l: 0, m: 0 },

        area: { b: '-radius:8px', m: '0px 0px 0px 0px', p: '16px 7px 5px 7px', bg: 'white' },
        area_title: { b: 'none', f: 14, fw: 'bold', w: 'unset', ps: 'relative', t: 12, l: 0, m: 0 },

        section: { b: '#e7eaec', m: '2px 0px 4px 0px', p: '8px 8px 8px 8px', bg: '#fafafa' },
        section_title: { b: 'none', f: 16, fw: '600', w: 'unset', m: '-bottom:2px', tt: 'uppercase' },

        window_top: { ps: 'fixed', t: 0, bg: '#ffffff', ml: - 10, p: '0 10px', z: 1001 },
        window_bottom: { ps: 'fixed', bt: 0, bg: '#ffffff', ml: - 10, p: '0 10px', z: 1001 },

        init: function _init(callback: () => any) {
            if (WUX.debug) console.log('[WUX] global.init...');
            // Initialization code
            if (WUX.debug) console.log('[WUX] global.init completed');
            if (callback) callback();
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

    // App utilities

    export function showMessage(m: string, title?: string, type?: string, dlg?: boolean) {
        // js/main.js
        _showMessage(m, title, type, dlg);
    }

    export function showInfo(m: string, title?: string, dlg?: boolean, f?: () => void) {
        // js/main.js
        _showInfo(m, title, dlg, f);
    }

    export function showSuccess(m: string, title?: string, dlg?: boolean) {
        // js/main.js
        _showSuccess(m, title, dlg);
    }

    export function showWarning(m: string, title?: string, dlg?: boolean) {
        // js/main.js
        _showWarning(m, title, dlg);
    }

    export function showError(m: string, title?: string, dlg?: boolean) {
        // js/main.js
        _showError(m, title, dlg);
    }

    export function confirm(m: string, f?: (response: any) => void) {
        // js/main.js
        _confirm(m, f);
    }

    export function getInput(m: string, f?: (response: any) => void, d?: any) {
        // js/main.js
        _getInput(m, f, d);
    }

    export function getPageTitle(): JQuery {
        return $('#ptitle');
    }

    export function getBreadcrump(): JQuery {
        return $('#pbreadcrumb');
    }

    export function getPageHeader(): JQuery {
        return $('#pheader');
    }

    export function getPageFooter(): JQuery {
        return $('#pfooter');
    }

    export function getPageMenu(): JQuery {
        return $('#side-menu');
    }

    export function getViewRoot(): JQuery {
        return $('#view-root');
    }

    export function sticky(c?: WUX.WComponent | JQuery) {
    }

    export function stickyRefresh() {
    }

    // Data format utilities

    export function formatDate(a: any, withDay: boolean = false, e: boolean = false): string {
        if (!a) return '';
        let d = WUtil.toDate(a);
        if (!d) return '';
        let m = d.getMonth() + 1;
        let sm = m < 10 ? '0' + m : '' + m;
        let sd = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
        if (withDay) {
            return WUX.formatDay(d.getDay(), e) + ', ' + sd + '/' + sm + '/' + d.getFullYear();
        }
        return sd + '/' + sm + '/' + d.getFullYear();
    }

    export function formatDateTime(a: any, withSec: boolean = false, withDay: boolean = false, e: boolean = false): string {
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
            if (withDay) {
                return WUX.formatDay(d.getDay(), e) + ', ' + sd + '/' + sm + '/' + d.getFullYear() + ' ' + sh + ':' + sp + ':' + ss;
            }
            return sd + '/' + sm + '/' + d.getFullYear() + ' ' + sh + ':' + sp + ':' + ss;
        }
        if (withDay) {
            return WUX.formatDay(d.getDay(), e) + ', ' + sd + '/' + sm + '/' + d.getFullYear() + ' ' + sh + ':' + sp;
        }
        return sd + '/' + sm + '/' + d.getFullYear() + ' ' + sh + ':' + sp;
    }

    export function formatTime(a: any, withSec: boolean = false): string {
        if (a == null) return '';
        if (typeof a == 'number') {
            if (withSec) {
                let hh = Math.floor(a / 10000);
                let mm = Math.floor((a % 10000) / 100);
                let is = (a % 10000) % 100;
                let sm = mm < 10 ? '0' + mm : '' + mm;
                let ss = is < 10 ? '0' + is : '' + is;
                return hh + ':' + sm + ':' + ss;
            }
            else {
                let hh = Math.floor(a / 100);
                let mm = a % 100;
                let sm = mm < 10 ? '0' + mm : '' + mm;
                return hh + ':' + sm;
            }
        }
        if (typeof a == 'string') {
            if (a.indexOf(':') > 0) return a;
            if (a.length < 3) return a + ':00';
            if (a.length >= 5) return a.substring(0, 2) + ':' + a.substring(2, 4) + ':' + a.substring(4);
            return a.substring(0, 2) + ':' + a.substring(2);
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
            if (a instanceof WUX.WCheck) {
                if (a.checked) return a.text;
                return '';
            }
            else if (a.rootTag == 'select') {
                let p = a.getProps();
                if (Array.isArray(p) && p.length > 1) {
                    let y = '';
                    for (let e of p) {
                        let v = '' + e;
                        if (!v) continue;
                        if (v.length > 9) {
                            let w = v.indexOf(' -');
                            if (w > 0) v = v.substring(0, w).trim();
                            y += ',' + v;
                        }
                        else {
                            y += ',' + v;
                        }
                    }
                    if (y.length) y = y.substring(1);
                    return y;
                }
                else {
                    let v = '' + a.getProps();
                    if (!v) v = a.getState();
                    return WUX.format(v);
                }
            }
            return WUX.format(a.getState());
        }
        return '' + a;
    }

    export function formatDay(d: number, e?: boolean): string {
        switch (d) {
            case 0: return e ? 'Domenica' : 'Dom';
            case 1: return e ? 'Luned&igrave;': 'Lun';
            case 2: return e ? 'Marted&igrave;': 'Mar';
            case 3: return e ? 'Mercoled&igrave;': 'Mer';
            case 4: return e ? 'Giove&igrave;': 'Gio';
            case 5: return e ? 'Venerd&igrave;': 'Ven';
            case 6: return e ? 'Sabato': 'Sab';
        }
        return '';
    }

    export function formatMonth(m: number, e?: boolean, y?: any): string {
        if (m > 100) {
            // YYYYMM
            y = Math.floor(m / 100);
            m = m % 100;
        }
        y = y ? ' ' + y : '';
        switch (m) {
            case 1: return e ? 'Gennaio' + y : 'Gen' + y;
            case 2: return e ? 'Febbraio' + y : 'Feb' + y;
            case 3: return e ? 'Marzo' + y : 'Mar' + y;
            case 4: return e ? 'Aprile' + y : 'Apr' + y;
            case 5: return e ? 'Maggio' + y : 'Mag' + y;
            case 6: return e ? 'Giugno' + y : 'Giu' + y;
            case 7: return e ? 'Luglio' + y : 'Lug' + y;
            case 8: return e ? 'Agosto' + y : 'Ago' + y;
            case 9: return e ? 'Settembre' + y : 'Set' + y;
            case 10: return e ? 'Ottobre' + y : 'Ott' + y;
            case 11: return e ? 'Novembre' + y : 'Nov' + y;
            case 12: return e ? 'Dicembre' + y : 'Dic' + y;
        }
        return '';
    }

    export function decodeMonth(m: any): number {
        if (!m) return 0;
        if (typeof m == 'number') {
            if (m > 0 && m < 13) return m;
            return 0;
        }
        let s = ('' + m).toLowerCase();
        if (s.length > 3) s = s.substring(0, 3);
        if (s == 'gen') return 1;
        if (s == 'feb') return 2;
        if (s == 'mar') return 3;
        if (s == 'apr') return 4;
        if (s == 'mag') return 5;
        if (s == 'giu') return 6;
        if (s == 'lug') return 7;
        if (s == 'ago') return 8;
        if (s == 'set') return 9;
        if (s == 'ott') return 10;
        if (s == 'nov') return 11;
        if (s == 'dic') return 12;
        let n = WUtil.toInt(s);
        if (n > 0 && n < 13) return n;
        return 0;
    }

    export function norm(t: any): string {
        if (!t) return '';
        t = '' + t;
        t = t.replace("\300", "A'").replace("\310", "E'").replace("\314", "I'").replace("\322", "O'").replace("\331", "U'");
        t = t.replace("\340", "a'").replace("\350", "e'").replace("\354", "i'").replace("\362", "o'").replace("\371", "u'");
        t = t.replace("\341", "a`").replace("\351", "e`").replace("\355", "i`").replace("\363", "o`").replace("\372", "u`");
        t = t.replace("\u20ac", "E").replace("\252", "a").replace("\260", "o");
        return t;
    }

    export function den(t: any): string {
        if (!t) return '';
        t = '' + t;
        t = t.replace("A'", "\300").replace("E'", "\310").replace("I'", "\314").replace("O'", "\322").replace("U'", "\331");
        t = t.replace("a'", "\340").replace("e'", "\350").replace("i'", "\354").replace("o'", "\362").replace("u'", "\371");
        t = t.replace("a`", "\341").replace("e`", "\351").replace("i`", "\355").replace("o`", "\363").replace("u`", "\372");
        t = t.replace(" p\362", " po'");
        return t;
    }

    export function text(t: any): string {
        if (!t) return '';
        t = '' + t;
        t = t.replace("&Agrave;", "A'").replace("&Egrave;", "E'").replace("&Igrave;", "I'").replace("&Ograve;", "O'").replace("&Ugrave;", "U'");
        t = t.replace("&agrave;", "a'").replace("&egrave;", "e'").replace("&igrave;", "i'").replace("&ograve;", "o'").replace("&ugrave;", "u'");
        t = t.replace("&aacute;", "a`").replace("&eacute;", "e`").replace("&iacute;", "i`").replace("&oacute;", "o`").replace("&uacute;", "u`");
        t = t.replace("&euro;", "E").replace("&nbsp;", " ").replace("&amp;", "&").replace("&gt;", ">").replace("&lt;", "<").replace("&quot;", "\"");
        return t;
    }

    let KEY = "@D:=E?('B;F)<=A>C@?):D';@=B<?C;)E:'@=?A(B<=;(?@>E:";

    export function encrypt(a: any): string {
        if (!a) return '';
        let t = '' + a;
        let s = '';
        let k = 0;
        for (let i = 0; i < t.length; i++) {
            k = k >= KEY.length - 1 ? 0 : k + 1;
            let c = t.charCodeAt(i);
            let d = KEY.charCodeAt(k);
            let r = c;
            if (c >= 32 && c <= 126) {
                r = r - d;
                if (r < 32) r = 127 + r - 32;
            }
            s += String.fromCharCode(r);
        }
        return s;
    }

    export function decrypt(a: any): string {
        if (!a) return '';
        let t = '' + a;
        let s = '';
        let k = 0;
        for (let i = 0; i < t.length; i++) {
            k = k >= KEY.length - 1 ? 0 : k + 1;
            let c = t.charCodeAt(i);
            let d = KEY.charCodeAt(k);
            let r = c;
            if (c >= 32 && c <= 126) {
                r = r + d;
                if (r > 126) r = 31 + r - 126;
            }
            s += String.fromCharCode(r);
        }
        return s;
    }

    // App Resources

    export enum BTN {
        // Defaults
        PRIMARY = 'btn btn-primary',
        SECONDARY = 'btn btn-secondary',
        SUCCESS = 'btn btn-success',
        DANGER = 'btn btn-danger',
        WARNING = 'btn btn-warning',
        INFO = 'btn btn-info',
        LIGHT = 'btn btn-light',
        DARK = 'btn btn-dark',
        LINK = 'btn btn-link',
        WHITE = 'btn btn-white',
        // Block
        SM_PRIMARY = 'btn btn-sm btn-primary btn-block',
        SM_DEFAULT = 'btn btn-sm btn-default btn-block',
        SM_SECONDARY = 'btn btn-sm btn-secondary btn-block',
        SM_INFO = 'btn btn-sm btn-info btn-block',
        SM_DANGER = 'btn btn-sm btn-danger btn-block',
        SM_WHITE = 'btn btn-sm btn-white btn-block',
        // Actions
        ACT_PRIMARY = 'btn btn-sm btn-primary',
        ACT_DEFAULT = 'btn btn-sm btn-default',
        ACT_SECONDARY = 'btn btn-sm btn-secondary',
        ACT_INFO = 'btn btn-sm btn-info',
        ACT_DANGER = 'btn btn-sm btn-danger',
        ACT_WHITE = 'btn btn-sm btn-white',
        // Actions Outline
        ACT_OUTLINE_PRIMARY = 'btn btn-sm btn-primary btn-outline',
        ACT_OUTLINE_DEFAULT = 'btn btn-sm btn-default btn-outline',
        ACT_OUTLINE_INFO = 'btn btn-sm btn-info btn-outline',
        ACT_OUTLINE_DANGER = 'btn btn-sm btn-danger btn-outline'
    }

    export class CSS {
        // Base
        static readonly NORMAL: WStyle = { bg: '#ffffff' };
        static readonly ERROR: WStyle = { bg: '#fce6e8' };
        static readonly WARNING: WStyle = { bg: '#fef3e6' };
        static readonly SUCCESS: WStyle = { bg: '#d1f0ea' };
        static readonly INFO: WStyle = { bg: '#ddedf6' };
        // Extra
        static readonly COMPLETED: WStyle = { bg: '#eeeeee' };
        static readonly MARKED: WStyle = { bg: '#fff0be' };
        
        static readonly BTN_MED: WStyle = { w: 110, f: 12, a: 'left' };
        static readonly BTN_SMALL: WStyle = { w: 90, f: 12, a: 'left' };

        static readonly STACK_BTNS: WStyle = { pt: 2, pb: 2, a: 'center' };
        static readonly LINE_BTNS: WStyle = { pl: 2, pr: 2, a: 'center' };

        static readonly FORM_CTRL = 'form-control';
        static readonly FORM_CTRL_SM = 'form-control input-sm';

        static readonly FIELD_REQUIRED: WStyle = { c: '#676a96' };
        static readonly FIELD_CRITICAL: WStyle = { c: '#aa6a6c' };
        static readonly FIELD_INTERNAL: WStyle = { c: '#aa6a6c' };

        static readonly LABEL_NOTICE: WStyle = { c: '#aa6a6c', fw: 'bold' };
        static readonly LABEL_INFO: WStyle = { c: '#676a96', fw: 'bold' };
    }

    export enum WIcon {
        /** Attributes */
        LARGE = 'fa-lg ',

        ADDRESS_CARD = 'fa-address-card',
        ANGLE_DOUBLE_LEFT = 'fa-angle-double-left',
        ANGLE_DOUBLE_RIGHT = 'fa-angle-double-right',
        ANGLE_LEFT = 'fa-angle-left',
        ANGLE_RIGHT = 'fa-angle-right',
        ARROW_CIRCLE_DOWN = 'fa-arrow-circle-down',
        ARROW_CIRCLE_LEFT = 'fa-arrow-circle-left',
        ARROW_CIRCLE_O_DOWN = 'fa-arrow-circle-o-down',
        ARROW_CIRCLE_O_LEFT = 'fa-arrow-circle-o-left',
        ARROW_CIRCLE_O_RIGHT = 'fa-arrow-circle-o-right',
        ARROW_CIRCLE_O_UP = 'fa-arrow-circle-o-up',
        ARROW_CIRCLE_RIGHT = 'fa-arrow-circle-right',
        ARROW_CIRCLE_UP = 'fa-arrow-circle-up',
        ARROW_DOWN = 'fa-arrow-down',
        ARROW_LEFT = 'fa-arrow-left',
        ARROW_RIGHT = 'fa-arrow-right',
        ARROW_UP = 'fa-arrow-up',
        BOLT = 'fa-bolt',
        BACKWARD = 'fa-backward',
        BOOKMARK = 'fa-bookmark',
        BOOKMARK_O = 'fa-bookmark-o',
        CALENDAR = 'fa-calendar',
        CALCULATOR = 'fa-calculator',
        CHAIN = 'fa-chain',
        CHAIN_BROKEN = 'fa-chain-broken',
        CHECK = 'fa-check',
        CHECK_CIRCLE = 'fa-check-circle',
        CHECK_CIRCLE_O = 'fa-check-circle-o',
        CHECK_SQUARE = 'fa-check-square',
        CHECK_SQUARE_O = 'fa-check-square-o',
        CHEVRON_DOWN = 'fa-chevron-down',
        CHEVRON_UP = 'fa-chevron-up',
        CLOCK_O = 'fa-clock-o', 
        CLOSE = 'fa-close',
        COG = 'fa-cog',
        COMMENT = 'fa-comment',
        COMMENTS_O = 'fa-comments-o',
        COPY = 'fa-copy',
        CUT = 'fa-cut',
        DATABASE = 'fa-database',
        EDIT = 'fa-edit',
        ENVELOPE_O = 'fa-envelope-o',
        EXCHANGE = 'fa-exchange',
        FILE = 'fa-file',
        FILE_O = 'fa-file-o',
        FILE_CODE_O = 'fa-file-code-o',
        FILE_PDF_O = 'fa-file-pdf-o',
        FILE_TEXT_O = 'fa-file-text-o',
        FILES = 'fa-files-o',
        FILTER = 'fa-filter',
        FOLDER = 'fa-folder',
        FOLDER_O = 'fa-folder-o',
        FOLDER_OPEN = 'fa-folder-open',
        FOLDER_OPEN_O = 'fa-folder-open-o',
        FORWARD = 'fa-forward',
        GRADUATION_CAP = 'fa-graduation-cap',
        INFO_CIRCLE = 'fa-info-circle',
        LIFE_RING = 'fa-life-ring',
        LINK = 'fa-link',
        LEGAL = 'fa-legal',
        LIST = 'fa-list',
        MINUS = 'fa-minus',
        MINUS_SQUARE_O = 'fa-minus-square-o',
        PASTE = 'fa-paste',
        PENCIL = 'fa-pencil',
        PIE_CHART = 'fa-pie-chart',
        PLUS = 'fa-plus',
        PLUS_SQUARE_O = 'fa-plus-square-o',
        PRINT = 'fa-print',
        QUESTION_CIRCLE = 'fa-question-circle',
        RANDOM = 'fa-random',
        RECYCLE = 'fa-recycle',
        REFRESH = 'fa-refresh',
        SEARCH = 'fa-search',
        SEARCH_MINUS = 'fa-search-minus',
        SEARCH_PLUS = 'fa-search-plus',
        SEND = 'fa-send',
        SHARE_SQUARE_O = 'fa-share-square-o',
        SHOPPING_CART = 'fa-shopping-cart',
        SIGN_IN = 'fa-sign-in',
        SIGN_OUT = 'fa-sign-out',
        SQUARE = 'fa-square',
        SQUARE_O = 'fa-square-o',
        TH_LIST = 'fa-th-list',
        THUMBS_O_DOWN = 'fa-thumbs-o-down',
        THUMBS_O_UP = 'fa-thumbs-o-up',
        TIMES = 'fa-times',
        TIMES_CIRCLE = 'fa-times-circle',
        TOGGLE_OFF = 'fa-toggle-off',
        TOGGLE_ON = 'fa-toggle-on',
        TRASH = 'fa-trash',
        TRUCK = 'fa-truck',
        UNDO = 'fa-undo',
        UPLOAD = 'fa-upload',
        USER = 'fa-user',
        USER_O = 'fa-user-o',
        USERS = 'fa-users',
        WARNING = 'fa-warning',
        WIFI = 'fa-wifi',
        WRENCH = 'fa-wrench'
    }

    export class RES {
        static OK = 'OK';
        static CLOSE = 'Chiudi';
        static CANCEL = 'Annulla';
        static ERR_DATE = 'Data non ammessa.';
    }
}