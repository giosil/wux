var WUX;
(function (WUX) {
    var _data = {};
    var _dccb = {};
    WUX.global = {
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
        area: { b: '-radius:8px', m: '0px 0px 0px 0px', p: '16px 7px 5px 7px', bg: 'white' },
        area_title: { b: 'none', f: 14, fw: 'bold', w: 'unset', ps: 'relative', t: 12, l: 0, m: 0 },
        section: { b: '#e7eaec', m: '2px 0px 4px 0px', p: '8px 8px 8px 8px', bg: '#fafafa' },
        section_title: { b: 'none', f: 16, fw: '600', w: 'unset', m: '-bottom:2px', tt: 'uppercase' },
        window_top: { ps: 'fixed', t: 0, bg: '#ffffff', ml: -10, p: '0 10px', z: 1001 },
        window_bottom: { ps: 'fixed', bt: 0, bg: '#ffffff', ml: -10, p: '0 10px', z: 1001 },
        init: function _init(callback) {
            if (WUX.debug)
                console.log('[WUX] global.init...');
            if (WUX.debug)
                console.log('[WUX] global.init completed');
            if (callback)
                callback();
        },
        setData: function (key, data, dontTrigger) {
            if (dontTrigger === void 0) { dontTrigger = false; }
            if (!key)
                key = 'global';
            _data[key] = data;
            if (dontTrigger)
                return;
            if (!_dccb[key])
                return;
            for (var _i = 0, _a = _dccb[key]; _i < _a.length; _i++) {
                var cb = _a[_i];
                cb(data);
            }
        },
        getData: function (key, def) {
            if (!key)
                key = 'global';
            var r = _data[key];
            if (r == null)
                return def;
            return r;
        },
        onDataChanged: function (key, callback) {
            if (!key)
                key = 'global';
            if (!_dccb[key])
                _dccb[key] = [];
            _dccb[key].push(callback);
        }
    };
    function showMessage(m, title, type, dlg) {
        _showMessage(m, title, type, dlg);
    }
    WUX.showMessage = showMessage;
    function showInfo(m, title, dlg, f) {
        _showInfo(m, title, dlg, f);
    }
    WUX.showInfo = showInfo;
    function showSuccess(m, title, dlg) {
        _showSuccess(m, title, dlg);
    }
    WUX.showSuccess = showSuccess;
    function showWarning(m, title, dlg) {
        _showWarning(m, title, dlg);
    }
    WUX.showWarning = showWarning;
    function showError(m, title, dlg) {
        _showError(m, title, dlg);
    }
    WUX.showError = showError;
    function confirm(m, f) {
        _confirm(m, f);
    }
    WUX.confirm = confirm;
    function getInput(m, f, d) {
        _getInput(m, f, d);
    }
    WUX.getInput = getInput;
    function getPageTitle() {
        return $('#ptitle');
    }
    WUX.getPageTitle = getPageTitle;
    function getBreadcrump() {
        return $('#pbreadcrumb');
    }
    WUX.getBreadcrump = getBreadcrump;
    function getPageHeader() {
        return $('#pheader');
    }
    WUX.getPageHeader = getPageHeader;
    function getPageFooter() {
        return $('#pfooter');
    }
    WUX.getPageFooter = getPageFooter;
    function getPageMenu() {
        return $('#side-menu');
    }
    WUX.getPageMenu = getPageMenu;
    function getViewRoot() {
        return $('#view-root');
    }
    WUX.getViewRoot = getViewRoot;
    function sticky(c) {
    }
    WUX.sticky = sticky;
    function stickyRefresh() {
    }
    WUX.stickyRefresh = stickyRefresh;
    function formatDate(a, withDay, e) {
        if (withDay === void 0) { withDay = false; }
        if (e === void 0) { e = false; }
        if (!a)
            return '';
        var d = WUX.WUtil.toDate(a);
        if (!d)
            return '';
        var m = d.getMonth() + 1;
        var sm = m < 10 ? '0' + m : '' + m;
        var sd = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
        if (withDay) {
            return WUX.formatDay(d.getDay(), e) + ', ' + sd + '/' + sm + '/' + d.getFullYear();
        }
        return sd + '/' + sm + '/' + d.getFullYear();
    }
    WUX.formatDate = formatDate;
    function formatDateTime(a, withSec, withDay, e) {
        if (withSec === void 0) { withSec = false; }
        if (withDay === void 0) { withDay = false; }
        if (e === void 0) { e = false; }
        if (!a)
            return '';
        var d = WUX.WUtil.toDate(a);
        if (!d)
            return '';
        var m = d.getMonth() + 1;
        var sm = m < 10 ? '0' + m : '' + m;
        var sd = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
        var sh = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours();
        var sp = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes();
        if (withSec) {
            var ss = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds();
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
    WUX.formatDateTime = formatDateTime;
    function formatTime(a, withSec) {
        if (withSec === void 0) { withSec = false; }
        if (a == null)
            return '';
        if (typeof a == 'number') {
            if (withSec) {
                var hh = Math.floor(a / 10000);
                var mm = Math.floor((a % 10000) / 100);
                var is = (a % 10000) % 100;
                var sm = mm < 10 ? '0' + mm : '' + mm;
                var ss = is < 10 ? '0' + is : '' + is;
                return hh + ':' + sm + ':' + ss;
            }
            else {
                var hh = Math.floor(a / 100);
                var mm = a % 100;
                var sm = mm < 10 ? '0' + mm : '' + mm;
                return hh + ':' + sm;
            }
        }
        if (typeof a == 'string') {
            if (a.indexOf(':') > 0)
                return a;
            if (a.length < 3)
                return a + ':00';
            if (a.length >= 5)
                return a.substring(0, 2) + ':' + a.substring(2, 4) + ':' + a.substring(4);
            return a.substring(0, 2) + ':' + a.substring(2);
        }
        if (a instanceof Date) {
            var sh = a.getHours() < 10 ? '0' + a.getHours() : '' + a.getHours();
            var sp = a.getMinutes() < 10 ? '0' + a.getMinutes() : '' + a.getMinutes();
            if (withSec) {
                var ss = a.getSeconds() < 10 ? '0' + a.getSeconds() : '' + a.getSeconds();
                return sh + ':' + sp + ':' + ss;
            }
            return sh + ':' + sp;
        }
        return '';
    }
    WUX.formatTime = formatTime;
    function formatNum2(a, nz, z, neg) {
        if (a === '' || a == null)
            return '';
        var n = WUX.WUtil.toNumber(a);
        var r = ('' + (Math.round(n * 100) / 100)).replace('.', ',');
        if (nz != null && n != 0) {
            if (neg != null && n < 0)
                return neg.replace('$', r);
            return nz.replace('$', r);
        }
        if (z != null && n == 0)
            return z.replace('$', r);
        return r;
    }
    WUX.formatNum2 = formatNum2;
    function formatNum(a, nz, z, neg) {
        if (a === '' || a == null)
            return '';
        var n = WUX.WUtil.toNumber(a);
        var r = ('' + n).replace('.', ',');
        if (nz != null && n != 0) {
            if (neg != null && n < 0) {
                if (neg == 'l')
                    return n.toLocaleString('it-IT');
                return neg.replace('$', r);
            }
            if (nz == 'l')
                return n.toLocaleString('it-IT');
            return nz.replace('$', r);
        }
        if (z != null && n == 0)
            return z.replace('$', r);
        return r;
    }
    WUX.formatNum = formatNum;
    function formatCurr(a, nz, z, neg) {
        if (a === '' || a == null)
            return '';
        var n = WUX.WUtil.toNumber(a);
        var r = (Math.round(n * 100) / 100).toLocaleString('it-IT');
        var d = r.indexOf(',');
        if (d < 0)
            r += ',00';
        if (d == r.length - 2)
            r += '0';
        if (nz != null && n != 0) {
            if (neg != null && n < 0)
                return neg.replace('$', r);
            return nz.replace('$', r);
        }
        if (z != null && n == 0)
            return z.replace('$', r);
        return r;
    }
    WUX.formatCurr = formatCurr;
    function formatCurr5(a, nz, z, neg) {
        if (a === '' || a == null)
            return '';
        var n = WUX.WUtil.toNumber(a);
        var r = ('' + (Math.round(n * 100000) / 100000)).replace('.', ',');
        var d = r.indexOf(',');
        if (d < 0)
            r += ',00';
        if (d == r.length - 2)
            r += '0';
        if (d > 0) {
            var s1 = r.substring(0, d);
            var s2 = r.substring(d);
            var s3 = '';
            for (var i = 1; i <= s1.length; i++) {
                if (i > 3 && (i - 1) % 3 == 0)
                    s3 = '.' + s3;
                s3 = s1.charAt(s1.length - i) + s3;
            }
            r = s3 + s2;
        }
        if (nz != null && n != 0) {
            if (neg != null && n < 0)
                return neg.replace('$', r);
            return nz.replace('$', r);
        }
        if (z != null && n == 0)
            return z.replace('$', r);
        return r;
    }
    WUX.formatCurr5 = formatCurr5;
    function formatBoolean(a) {
        if (a == null)
            return '';
        return a ? 'S' : 'N';
    }
    WUX.formatBoolean = formatBoolean;
    function format(a) {
        if (a == null)
            return '';
        if (typeof a == 'string')
            return a;
        if (typeof a == 'boolean')
            return WUX.formatBoolean(a);
        if (typeof a == 'number') {
            var r = ('' + a);
            if (r.indexOf('.') >= 0)
                return WUX.formatCurr(a);
            return WUX.formatNum(a);
        }
        if (a instanceof Date)
            return WUX.formatDate(a);
        if (a instanceof WUX.WComponent) {
            if (a instanceof WUX.WCheck) {
                if (a.checked)
                    return a.text;
                return '';
            }
            else if (a.rootTag == 'select') {
                var p = a.getProps();
                if (Array.isArray(p) && p.length > 1) {
                    var y = '';
                    for (var _i = 0, p_1 = p; _i < p_1.length; _i++) {
                        var e = p_1[_i];
                        var v = '' + e;
                        if (!v)
                            continue;
                        if (v.length > 9) {
                            var w = v.indexOf(' -');
                            if (w > 0)
                                v = v.substring(0, w).trim();
                            y += ',' + v;
                        }
                        else {
                            y += ',' + v;
                        }
                    }
                    if (y.length)
                        y = y.substring(1);
                    return y;
                }
                else {
                    var v = '' + a.getProps();
                    if (!v)
                        v = a.getState();
                    return WUX.format(v);
                }
            }
            return WUX.format(a.getState());
        }
        return '' + a;
    }
    WUX.format = format;
    function formatDay(d, e) {
        switch (d) {
            case 0: return e ? 'Domenica' : 'Dom';
            case 1: return e ? 'Luned&igrave;' : 'Lun';
            case 2: return e ? 'Marted&igrave;' : 'Mar';
            case 3: return e ? 'Mercoled&igrave;' : 'Mer';
            case 4: return e ? 'Giove&igrave;' : 'Gio';
            case 5: return e ? 'Venerd&igrave;' : 'Ven';
            case 6: return e ? 'Sabato' : 'Sab';
        }
        return '';
    }
    WUX.formatDay = formatDay;
    function formatMonth(m, e, y) {
        if (m > 100) {
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
    WUX.formatMonth = formatMonth;
    function decodeMonth(m) {
        if (!m)
            return 0;
        if (typeof m == 'number') {
            if (m > 0 && m < 13)
                return m;
            return 0;
        }
        var s = ('' + m).toLowerCase();
        if (s.length > 3)
            s = s.substring(0, 3);
        if (s == 'gen')
            return 1;
        if (s == 'feb')
            return 2;
        if (s == 'mar')
            return 3;
        if (s == 'apr')
            return 4;
        if (s == 'mag')
            return 5;
        if (s == 'giu')
            return 6;
        if (s == 'lug')
            return 7;
        if (s == 'ago')
            return 8;
        if (s == 'set')
            return 9;
        if (s == 'ott')
            return 10;
        if (s == 'nov')
            return 11;
        if (s == 'dic')
            return 12;
        var n = WUX.WUtil.toInt(s);
        if (n > 0 && n < 13)
            return n;
        return 0;
    }
    WUX.decodeMonth = decodeMonth;
    function norm(t) {
        if (!t)
            return '';
        t = '' + t;
        t = t.replace("\300", "A'").replace("\310", "E'").replace("\314", "I'").replace("\322", "O'").replace("\331", "U'");
        t = t.replace("\340", "a'").replace("\350", "e'").replace("\354", "i'").replace("\362", "o'").replace("\371", "u'");
        t = t.replace("\341", "a`").replace("\351", "e`").replace("\355", "i`").replace("\363", "o`").replace("\372", "u`");
        t = t.replace("\u20ac", "E").replace("\252", "a").replace("\260", "o");
        return t;
    }
    WUX.norm = norm;
    function den(t) {
        if (!t)
            return '';
        t = '' + t;
        t = t.replace("A'", "\300").replace("E'", "\310").replace("I'", "\314").replace("O'", "\322").replace("U'", "\331");
        t = t.replace("a'", "\340").replace("e'", "\350").replace("i'", "\354").replace("o'", "\362").replace("u'", "\371");
        t = t.replace("a`", "\341").replace("e`", "\351").replace("i`", "\355").replace("o`", "\363").replace("u`", "\372");
        t = t.replace(" p\362", " po'");
        return t;
    }
    WUX.den = den;
    function text(t) {
        if (!t)
            return '';
        t = '' + t;
        t = t.replace("&Agrave;", "A'").replace("&Egrave;", "E'").replace("&Igrave;", "I'").replace("&Ograve;", "O'").replace("&Ugrave;", "U'");
        t = t.replace("&agrave;", "a'").replace("&egrave;", "e'").replace("&igrave;", "i'").replace("&ograve;", "o'").replace("&ugrave;", "u'");
        t = t.replace("&aacute;", "a`").replace("&eacute;", "e`").replace("&iacute;", "i`").replace("&oacute;", "o`").replace("&uacute;", "u`");
        t = t.replace("&euro;", "E").replace("&nbsp;", " ").replace("&amp;", "&").replace("&gt;", ">").replace("&lt;", "<").replace("&quot;", "\"");
        return t;
    }
    WUX.text = text;
    var KEY = "@D:=E?('B;F)<=A>C@?):D';@=B<?C;)E:'@=?A(B<=;(?@>E:";
    function encrypt(a) {
        if (!a)
            return '';
        var t = '' + a;
        var s = '';
        var k = 0;
        for (var i = 0; i < t.length; i++) {
            k = k >= KEY.length - 1 ? 0 : k + 1;
            var c = t.charCodeAt(i);
            var d = KEY.charCodeAt(k);
            var r = c;
            if (c >= 32 && c <= 126) {
                r = r - d;
                if (r < 32)
                    r = 127 + r - 32;
            }
            s += String.fromCharCode(r);
        }
        return s;
    }
    WUX.encrypt = encrypt;
    function decrypt(a) {
        if (!a)
            return '';
        var t = '' + a;
        var s = '';
        var k = 0;
        for (var i = 0; i < t.length; i++) {
            k = k >= KEY.length - 1 ? 0 : k + 1;
            var c = t.charCodeAt(i);
            var d = KEY.charCodeAt(k);
            var r = c;
            if (c >= 32 && c <= 126) {
                r = r + d;
                if (r > 126)
                    r = 31 + r - 126;
            }
            s += String.fromCharCode(r);
        }
        return s;
    }
    WUX.decrypt = decrypt;
    var BTN;
    (function (BTN) {
        BTN["PRIMARY"] = "btn btn-primary";
        BTN["SECONDARY"] = "btn btn-secondary";
        BTN["SUCCESS"] = "btn btn-success";
        BTN["DANGER"] = "btn btn-danger";
        BTN["WARNING"] = "btn btn-warning";
        BTN["INFO"] = "btn btn-info";
        BTN["LIGHT"] = "btn btn-light";
        BTN["DARK"] = "btn btn-dark";
        BTN["LINK"] = "btn btn-link";
        BTN["WHITE"] = "btn btn-white";
        BTN["SM_PRIMARY"] = "btn btn-sm btn-primary btn-block";
        BTN["SM_DEFAULT"] = "btn btn-sm btn-default btn-block";
        BTN["SM_SECONDARY"] = "btn btn-sm btn-secondary btn-block";
        BTN["SM_INFO"] = "btn btn-sm btn-info btn-block";
        BTN["SM_DANGER"] = "btn btn-sm btn-danger btn-block";
        BTN["SM_WHITE"] = "btn btn-sm btn-white btn-block";
        BTN["ACT_PRIMARY"] = "btn btn-sm btn-primary";
        BTN["ACT_DEFAULT"] = "btn btn-sm btn-default";
        BTN["ACT_SECONDARY"] = "btn btn-sm btn-secondary";
        BTN["ACT_INFO"] = "btn btn-sm btn-info";
        BTN["ACT_DANGER"] = "btn btn-sm btn-danger";
        BTN["ACT_WHITE"] = "btn btn-sm btn-white";
        BTN["ACT_OUTLINE_PRIMARY"] = "btn btn-sm btn-primary btn-outline";
        BTN["ACT_OUTLINE_DEFAULT"] = "btn btn-sm btn-default btn-outline";
        BTN["ACT_OUTLINE_INFO"] = "btn btn-sm btn-info btn-outline";
        BTN["ACT_OUTLINE_DANGER"] = "btn btn-sm btn-danger btn-outline";
    })(BTN = WUX.BTN || (WUX.BTN = {}));
    var CSS = (function () {
        function CSS() {
        }
        CSS.NORMAL = { bg: '#ffffff' };
        CSS.ERROR = { bg: '#fce6e8' };
        CSS.WARNING = { bg: '#fef3e6' };
        CSS.SUCCESS = { bg: '#d1f0ea' };
        CSS.INFO = { bg: '#ddedf6' };
        CSS.COMPLETED = { bg: '#eeeeee' };
        CSS.MARKED = { bg: '#fff0be' };
        CSS.BTN_MED = { w: 110, f: 12, a: 'left' };
        CSS.BTN_SMALL = { w: 90, f: 12, a: 'left' };
        CSS.STACK_BTNS = { pt: 2, pb: 2, a: 'center' };
        CSS.LINE_BTNS = { pl: 2, pr: 2, a: 'center' };
        CSS.FORM_CTRL = 'form-control';
        CSS.FORM_CTRL_SM = 'form-control input-sm';
        CSS.FIELD_REQUIRED = { c: '#676a96' };
        CSS.FIELD_CRITICAL = { c: '#aa6a6c' };
        CSS.FIELD_INTERNAL = { c: '#aa6a6c' };
        CSS.LABEL_NOTICE = { c: '#aa6a6c', fw: 'bold' };
        CSS.LABEL_INFO = { c: '#676a96', fw: 'bold' };
        return CSS;
    }());
    WUX.CSS = CSS;
    var WIcon;
    (function (WIcon) {
        WIcon["LARGE"] = "fa-lg ";
        WIcon["ADDRESS_CARD"] = "fa-address-card";
        WIcon["ANGLE_DOUBLE_LEFT"] = "fa-angle-double-left";
        WIcon["ANGLE_DOUBLE_RIGHT"] = "fa-angle-double-right";
        WIcon["ANGLE_LEFT"] = "fa-angle-left";
        WIcon["ANGLE_RIGHT"] = "fa-angle-right";
        WIcon["ARROW_CIRCLE_DOWN"] = "fa-arrow-circle-down";
        WIcon["ARROW_CIRCLE_LEFT"] = "fa-arrow-circle-left";
        WIcon["ARROW_CIRCLE_O_DOWN"] = "fa-arrow-circle-o-down";
        WIcon["ARROW_CIRCLE_O_LEFT"] = "fa-arrow-circle-o-left";
        WIcon["ARROW_CIRCLE_O_RIGHT"] = "fa-arrow-circle-o-right";
        WIcon["ARROW_CIRCLE_O_UP"] = "fa-arrow-circle-o-up";
        WIcon["ARROW_CIRCLE_RIGHT"] = "fa-arrow-circle-right";
        WIcon["ARROW_CIRCLE_UP"] = "fa-arrow-circle-up";
        WIcon["ARROW_DOWN"] = "fa-arrow-down";
        WIcon["ARROW_LEFT"] = "fa-arrow-left";
        WIcon["ARROW_RIGHT"] = "fa-arrow-right";
        WIcon["ARROW_UP"] = "fa-arrow-up";
        WIcon["BOLT"] = "fa-bolt";
        WIcon["BACKWARD"] = "fa-backward";
        WIcon["BOOKMARK"] = "fa-bookmark";
        WIcon["BOOKMARK_O"] = "fa-bookmark-o";
        WIcon["CALENDAR"] = "fa-calendar";
        WIcon["CALCULATOR"] = "fa-calculator";
        WIcon["CHAIN"] = "fa-chain";
        WIcon["CHAIN_BROKEN"] = "fa-chain-broken";
        WIcon["CHECK"] = "fa-check";
        WIcon["CHECK_CIRCLE"] = "fa-check-circle";
        WIcon["CHECK_CIRCLE_O"] = "fa-check-circle-o";
        WIcon["CHECK_SQUARE"] = "fa-check-square";
        WIcon["CHECK_SQUARE_O"] = "fa-check-square-o";
        WIcon["CHEVRON_DOWN"] = "fa-chevron-down";
        WIcon["CHEVRON_UP"] = "fa-chevron-up";
        WIcon["CLOCK_O"] = "fa-clock-o";
        WIcon["CLOSE"] = "fa-close";
        WIcon["COG"] = "fa-cog";
        WIcon["COMMENT"] = "fa-comment";
        WIcon["COMMENTS_O"] = "fa-comments-o";
        WIcon["COPY"] = "fa-copy";
        WIcon["CUT"] = "fa-cut";
        WIcon["DATABASE"] = "fa-database";
        WIcon["EDIT"] = "fa-edit";
        WIcon["ENVELOPE_O"] = "fa-envelope-o";
        WIcon["EXCHANGE"] = "fa-exchange";
        WIcon["FILE"] = "fa-file";
        WIcon["FILE_O"] = "fa-file-o";
        WIcon["FILE_CODE_O"] = "fa-file-code-o";
        WIcon["FILE_PDF_O"] = "fa-file-pdf-o";
        WIcon["FILE_TEXT_O"] = "fa-file-text-o";
        WIcon["FILES"] = "fa-files-o";
        WIcon["FILTER"] = "fa-filter";
        WIcon["FOLDER"] = "fa-folder";
        WIcon["FOLDER_O"] = "fa-folder-o";
        WIcon["FOLDER_OPEN"] = "fa-folder-open";
        WIcon["FOLDER_OPEN_O"] = "fa-folder-open-o";
        WIcon["FORWARD"] = "fa-forward";
        WIcon["GRADUATION_CAP"] = "fa-graduation-cap";
        WIcon["INFO_CIRCLE"] = "fa-info-circle";
        WIcon["LIFE_RING"] = "fa-life-ring";
        WIcon["LINK"] = "fa-link";
        WIcon["LEGAL"] = "fa-legal";
        WIcon["LIST"] = "fa-list";
        WIcon["MINUS"] = "fa-minus";
        WIcon["MINUS_SQUARE_O"] = "fa-minus-square-o";
        WIcon["PASTE"] = "fa-paste";
        WIcon["PENCIL"] = "fa-pencil";
        WIcon["PIE_CHART"] = "fa-pie-chart";
        WIcon["PLUS"] = "fa-plus";
        WIcon["PLUS_SQUARE_O"] = "fa-plus-square-o";
        WIcon["PRINT"] = "fa-print";
        WIcon["QUESTION_CIRCLE"] = "fa-question-circle";
        WIcon["RANDOM"] = "fa-random";
        WIcon["RECYCLE"] = "fa-recycle";
        WIcon["REFRESH"] = "fa-refresh";
        WIcon["SEARCH"] = "fa-search";
        WIcon["SEARCH_MINUS"] = "fa-search-minus";
        WIcon["SEARCH_PLUS"] = "fa-search-plus";
        WIcon["SEND"] = "fa-send";
        WIcon["SHARE_SQUARE_O"] = "fa-share-square-o";
        WIcon["SHOPPING_CART"] = "fa-shopping-cart";
        WIcon["SIGN_IN"] = "fa-sign-in";
        WIcon["SIGN_OUT"] = "fa-sign-out";
        WIcon["SQUARE"] = "fa-square";
        WIcon["SQUARE_O"] = "fa-square-o";
        WIcon["TH_LIST"] = "fa-th-list";
        WIcon["THUMBS_O_DOWN"] = "fa-thumbs-o-down";
        WIcon["THUMBS_O_UP"] = "fa-thumbs-o-up";
        WIcon["TIMES"] = "fa-times";
        WIcon["TIMES_CIRCLE"] = "fa-times-circle";
        WIcon["TOGGLE_OFF"] = "fa-toggle-off";
        WIcon["TOGGLE_ON"] = "fa-toggle-on";
        WIcon["TRASH"] = "fa-trash";
        WIcon["TRUCK"] = "fa-truck";
        WIcon["UNDO"] = "fa-undo";
        WIcon["UPLOAD"] = "fa-upload";
        WIcon["USER"] = "fa-user";
        WIcon["USER_O"] = "fa-user-o";
        WIcon["USERS"] = "fa-users";
        WIcon["WARNING"] = "fa-warning";
        WIcon["WIFI"] = "fa-wifi";
        WIcon["WRENCH"] = "fa-wrench";
    })(WIcon = WUX.WIcon || (WUX.WIcon = {}));
    var RES = (function () {
        function RES() {
        }
        RES.OK = 'OK';
        RES.CLOSE = 'Chiudi';
        RES.CANCEL = 'Annulla';
        RES.ERR_DATE = 'Data non ammessa.';
        return RES;
    }());
    WUX.RES = RES;
})(WUX || (WUX = {}));
//# sourceMappingURL=wux.cfg.js.map