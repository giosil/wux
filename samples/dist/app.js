WUX.RES.CLOSE = 'Close';
WUX.RES.CANCEL = 'Cancel';
WUX.formWillMount = function (c) {
    if (!c.leg)
        c.legend('Form legend', 'sr-only');
};
var APP;
(function (APP) {
    var WUtil = WUX.WUtil;
    function showInfo(m, title) {
        if (!title)
            title = "Message";
        window["BSIT"].notify({ "state": 'info', "title": title, "message": m });
    }
    APP.showInfo = showInfo;
    function showSuccess(m, title) {
        if (!title)
            title = "Message";
        window["BSIT"].notify({ "state": 'success', "title": title, "message": m });
    }
    APP.showSuccess = showSuccess;
    function showWarning(m, title) {
        if (!title)
            title = "Message";
        window["BSIT"].notify({ "state": 'warning', "title": title, "message": m });
    }
    APP.showWarning = showWarning;
    function showError(m, title) {
        if (!title)
            title = "Message";
        window["BSIT"].notify({ "state": 'error', "title": title, "message": m });
    }
    APP.showError = showError;
    var _dc;
    function confirm(m, f) {
        if (!_dc)
            _dc = new APP.DlgConfirm('', m);
        _dc.onHiddenModal(function (e) { if (f)
            f(_dc.ok); });
        _dc.message = m;
        _dc.show();
    }
    APP.confirm = confirm;
    function dropdownBtn(id, t, items, cls) {
        if (cls === void 0) { cls = 'btn btn-outline-primary'; }
        var r = '<button id="' + id + '-b" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="dropdown-toggle ' + cls + '">' + t + '</i></button>';
        var a = ' tabindex="-1"';
        var s = ' style="max-height:180px;overflow-y:auto;"';
        r += '<div id="' + id + '-m"' + a + ' role="menu" aria-hidden="true" class="dropdown-menu"' + s + '>';
        r += '<div class="link-list-wrapper">';
        r += '<ul id="' + id + '-l" class="link-list">';
        if (items)
            r += items;
        r += '</ul></div></div>';
        return r;
    }
    APP.dropdownBtn = dropdownBtn;
    function addItem(r, t) {
        if (!r || !t)
            return;
        var s = t.getState();
        if (!s)
            s = [];
        s.push(r);
        t.setState(s);
    }
    APP.addItem = addItem;
    function updItem(r, c, f, a) {
        if (!r || !c || !f)
            return;
        var s = c.getState();
        if (!s || s.length == 0)
            return;
        var x = WUtil.indexOf(s, f, r[f]);
        if (x < 0)
            return;
        s[x] = r;
        if (a) {
            c.setState([]);
            setTimeout(function () { c.setState(s); }, 0);
        }
        c.setState(s);
    }
    APP.updItem = updItem;
    function delItem(i, c) {
        if (i < 0)
            return;
        var s = c.getState();
        if (!s || s.length <= i)
            return;
        s.splice(i, 1);
        c.setState(s);
    }
    APP.delItem = delItem;
    function delItemBy(f, v, c) {
        if (!f || !v || !c)
            return;
        var s = c.getState();
        if (!s || s.length == 0)
            return;
        var x = WUtil.indexOf(s, f, v);
        if (x < 0)
            return;
        s.splice(x, 1);
        c.setState(s);
    }
    APP.delItemBy = delItemBy;
})(APP || (APP = {}));
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var APP;
(function (APP) {
    var Mock = /** @class */ (function () {
        function Mock() {
            this.dat = JSON.parse(localStorage.getItem("mockd"));
            this.seq = JSON.parse(localStorage.getItem("mocks"));
            if (!this.dat)
                this.dat = {};
            if (!this.seq)
                this.seq = {};
        }
        Mock.prototype.clean = function (coll) {
            coll = this.norm(coll);
            this.dat[coll] = [];
            this.seq[coll] = 0;
            localStorage.setItem('mockd', JSON.stringify(this.dat));
            localStorage.setItem('mocks', JSON.stringify(this.seq));
        };
        Mock.prototype.clear = function () {
            this.dat = {};
            this.seq = {};
            localStorage.setItem('mockd', JSON.stringify(this.dat));
            localStorage.setItem('mocks', JSON.stringify(this.seq));
        };
        Mock.prototype.inc = function (coll) {
            coll = this.norm(coll);
            var r = this.seq[coll];
            if (!r) {
                this.seq[coll] = 1;
                localStorage.setItem('mocks', JSON.stringify(this.seq));
                return 1;
            }
            this.seq[coll] = ++r;
            localStorage.setItem('mocks', JSON.stringify(this.seq));
            return r;
        };
        Mock.prototype.find = function (coll, filter) {
            coll = this.norm(coll);
            console.log('[Mock] find ' + coll, filter);
            var r = this.dat[coll];
            if (!r)
                return [];
            if (filter) {
                var rf = [];
                for (var i = 0; i < r.length; i++) {
                    if (this.match(r[i], filter)) {
                        rf.push(r[i]);
                    }
                }
                return rf;
            }
            return r;
        };
        Mock.prototype.ins = function (coll, ent, key) {
            coll = this.norm(coll);
            console.log('[Mock] ins ' + coll, ent);
            if (!ent)
                return null;
            var r = this.dat[coll];
            if (!r)
                r = [];
            if (key && !ent[key]) {
                ent[key] = this.inc(coll);
            }
            r.push(ent);
            this.dat[coll] = r;
            localStorage.setItem('mockd', JSON.stringify(this.dat));
            return ent;
        };
        Mock.prototype.upd = function (coll, ent, key) {
            coll = this.norm(coll);
            console.log('[Mock] upd ' + coll, ent);
            if (!ent || !key)
                return null;
            var r = this.dat[coll];
            if (!r)
                return null;
            for (var i = 0; i < r.length; i++) {
                if (r[i][key] == ent[key]) {
                    r[i] = __assign(__assign({}, r[i]), ent);
                    localStorage.setItem('mockd', JSON.stringify(this.dat));
                    return r[i];
                }
            }
            return null;
        };
        Mock.prototype.del = function (coll, val, key) {
            coll = this.norm(coll);
            console.log('[Mock] del ' + coll + ', ' + val + ', ' + key);
            if (!key || !val)
                return false;
            var r = this.dat[coll];
            if (!r)
                return false;
            if (typeof val == 'object') {
                val = val[key];
            }
            var x = -1;
            for (var i = 0; i < r.length; i++) {
                if (r[i][key] == val) {
                    x = i;
                    break;
                }
            }
            if (x < 0)
                return false;
            r.splice(x, 1);
            this.dat[coll] = r;
            localStorage.setItem('mockd', JSON.stringify(this.dat));
            if (r.length == 0) {
                this.seq[coll] = 0;
                localStorage.setItem('mocks', JSON.stringify(this.seq));
            }
            return true;
        };
        Mock.prototype.read = function (coll, key, val) {
            coll = this.norm(coll);
            console.log('[Mock] read ' + coll + ', ' + key + ', ' + val);
            if (!key || !val)
                return null;
            var r = this.dat[coll];
            if (!r)
                return null;
            for (var i = 0; i < r.length; i++) {
                if (r[i][key] == val)
                    return r[i];
            }
            return null;
        };
        Mock.prototype.match = function (rec, flt) {
            if (!rec)
                return false;
            if (!flt)
                return true;
            for (var f in flt) {
                if (flt.hasOwnProperty(f)) {
                    var a = rec[f];
                    var b = flt[f];
                    if (typeof a == 'string') {
                        if (b && a.indexOf(b) < 0)
                            return false;
                    }
                    else if (a == undefined || a == null) {
                        if (b == undefined || b == null || b == '')
                            return true;
                        return false;
                    }
                    else if (b == undefined || b == null) {
                        return true;
                    }
                    else if (a != b) {
                        return false;
                    }
                }
            }
            return true;
        };
        Mock.prototype.norm = function (coll) {
            if (!coll)
                return 'default';
            var s = coll.indexOf('/');
            if (s > 0)
                coll = coll.substring(0, s);
            return coll.trim().toLowerCase();
        };
        return Mock;
    }());
    APP.Mock = Mock;
})(APP || (APP = {}));
var APP;
(function (APP) {
    function getURLServices() {
        var h = window.location.hostname;
        var p = window.location.protocol;
        if (!p)
            p = "http:";
        if (!h || h.indexOf('localhost') >= 0)
            return "http://localhost:8081";
        var s = h.indexOf('.');
        if (s < 1)
            return "http://localhost:8081";
        return p + '//api' + h.substring(s);
    }
    APP.getURLServices = getURLServices;
    var HttpClient = /** @class */ (function () {
        function HttpClient(url, auth) {
            this.url = url ? url : window.location.origin;
            this.auth = auth ? auth : '';
        }
        HttpClient.prototype.before = function () {
            window['BSIT'].showLoader();
        };
        HttpClient.prototype.after = function () {
            window['BSIT'].hideLoader();
        };
        HttpClient.prototype.sim = function (method, entity, params, success, failure) {
            var _this = this;
            console.log('sim(' + method + "," + entity + ')', params);
            method = method ? method.toLowerCase() : 'get';
            this.before();
            setTimeout(function () {
                _this.after();
                var d = null;
                if (_this.mres) {
                    var r = _this.mres[method + "_" + entity];
                    if (!r)
                        r = _this.mres[method];
                    d = (typeof r === 'function') ? r(entity, params) : r;
                }
                if (d != null && d != undefined) {
                    if (success)
                        success(d);
                }
                else {
                    if (failure) {
                        failure({ "message": 'No mock data for ' + method + ' ' + entity });
                    }
                    else {
                        APP.showError('No mock data for ' + method + ' ' + entity, 'Errore simulazione');
                    }
                }
            }, 500);
        };
        HttpClient.prototype.get = function (entity, params, success, failure) {
            if (this.mock) {
                this.sim('get', entity, params, success, failure);
                return;
            }
            this._get('GET', entity, params, success, failure);
        };
        HttpClient.prototype.delete = function (entity, params, success, failure) {
            if (this.mock) {
                this.sim('delete', entity, params, success, failure);
                return;
            }
            this._send('DELETE', entity, params, success, failure);
        };
        HttpClient.prototype.remove = function (entity, params, success, failure) {
            if (this.mock) {
                this.sim('delete', entity, params, success, failure);
                return;
            }
            this._get('DELETE', entity, params, success, failure);
        };
        HttpClient.prototype.post = function (entity, data, success, failure) {
            if (this.mock) {
                this.sim('post', entity, data, success, failure);
                return;
            }
            this._send('POST', entity, data, success, failure);
        };
        HttpClient.prototype.put = function (entity, data, success, failure) {
            if (this.mock) {
                this.sim('put', entity, data, success, failure);
                return;
            }
            this._send('PUT', entity, data, success, failure);
        };
        HttpClient.prototype.patch = function (entity, data, success, failure) {
            if (this.mock) {
                this.sim('patch', entity, data, success, failure);
                return;
            }
            this._send('PATCH', entity, data, success, failure);
        };
        HttpClient.prototype._get = function (method, entity, params, success, failure) {
            var _this = this;
            if (!method)
                method = 'GET';
            if (params) {
                for (var k in params) {
                    if (params[k] == null)
                        params[k] = '';
                }
            }
            var search = params ? new URLSearchParams(params).toString() : "";
            var requrl = search ? this.url + "/" + entity + "?" + search : this.url + "/" + entity;
            this.before();
            fetch(requrl, {
                "method": method,
                "headers": {
                    "Authorization": this.auth
                }
            })
                .then(function (response) {
                _this.after();
                if (!response.ok) {
                    console.error('[HttpClient] ' + method + ' ' + entity + ': HTTP ' + response.status);
                }
                return response.json().then(function (body) { return ({
                    status: response.status,
                    body: body
                }); });
            })
                .then(function (data) {
                if (!data)
                    return;
                var s = data.status;
                var b = data.body;
                if (s >= 200 && s < 300) {
                    if (success)
                        success(b);
                }
                else {
                    if (!b)
                        b = {};
                    var m = b.message;
                    if (!m) {
                        m = 'Errore HTTP ' + s;
                        b["message"] = m;
                    }
                    if (failure) {
                        failure(b);
                    }
                    else {
                        APP.showError(m, 'Errore servizio');
                    }
                }
            })
                .catch(function (error) {
                console.error('[HttpClient] ' + method + ' ' + entity + ':', error);
                _this.after();
                if (failure) {
                    failure(error);
                }
                else {
                    APP.showError('Servizio non disponibile.', 'Errore chiamata');
                }
            });
        };
        HttpClient.prototype._send = function (method, entity, data, success, failure) {
            var _this = this;
            if (!method)
                method = 'POST';
            var requrl = this.url + "/" + entity;
            this.before();
            fetch(requrl, {
                "method": method,
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": this.auth
                },
                body: JSON.stringify(data)
            })
                .then(function (response) {
                _this.after();
                if (!response.ok) {
                    console.error('[HttpClient] ' + method + ' ' + entity + ': HTTP ' + response.status);
                }
                return response.json().then(function (body) { return ({
                    status: response.status,
                    body: body
                }); });
            })
                .then(function (data) {
                if (!data)
                    return;
                var s = data.status;
                var b = data.body;
                if (s >= 200 && s < 300) {
                    if (success)
                        success(b);
                }
                else {
                    if (!b)
                        b = {};
                    var m = b.message;
                    if (!m) {
                        m = 'Errore HTTP ' + s;
                        b["message"] = m;
                    }
                    if (failure) {
                        failure(b);
                    }
                    else {
                        APP.showError(m, 'Errore servizio');
                    }
                }
            })
                .catch(function (error) {
                console.error('[HttpClient] ' + method + ' ' + entity + ':', error);
                _this.after();
                if (failure) {
                    failure(error);
                }
                else {
                    APP.showError('Servizio non disponibile.', 'Errore chiamata');
                }
            });
        };
        return HttpClient;
    }());
    APP.HttpClient = HttpClient;
    APP.http = new HttpClient(getURLServices(), 'Basic dXNlcjpwYXNzd29yZA==');
})(APP || (APP = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var APP;
(function (APP) {
    var Breadcrumb = /** @class */ (function (_super) {
        __extends(Breadcrumb, _super);
        function Breadcrumb(id, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'Breadcrumb', '/', classStyle, style, attributes) || this;
            _this.rootTag = 'nav';
            return _this;
        }
        Breadcrumb.prototype.add = function (link) {
            if (!this.state)
                this.state = [];
            if (link)
                this.state.push(link);
            return this;
        };
        Breadcrumb.prototype.status = function (t, cls) {
            if (cls === void 0) { cls = 'bg-primary'; }
            if (!this.leid)
                return this;
            if (!this.lhtm)
                this.lhtm = '';
            var l = document.getElementById(this.leid);
            var h = t ? ' <span class="badge ' + cls + '" style="margin-left:0.5rem;">' + t + '</span>' : '';
            if (l)
                l.innerHTML = this.lhtm + h;
            return this;
        };
        Breadcrumb.prototype.render = function () {
            if (!this.home)
                this.home = 'index.html';
            if (!this._classStyle)
                this._classStyle = 'mb-5 breadcrumb-container';
            if (!this.props)
                this.props = '/';
            var s = this._style ? ' style="' + this._style + '"' : '';
            var a = this._attributes ? ' ' + this._attributes : '';
            var r = '<nav class="' + this._classStyle + '" aria-label="breadcrumb"' + s + a + '>';
            r += '<ol class="breadcrumb"><li class="breadcrumb-item"><a href="' + this.home + '">Homepage</a><span class="separator">/</span></li>';
            if (this.state) {
                var l = this.state.length;
                for (var i = 0; i < l; i++) {
                    var e = this.state[i];
                    var s_1 = i < l - 1 ? '<span class="separator">/</span>' : '';
                    if (e[0] == '<') {
                        r += '<li class="breadcrumb-item" id="' + this.id + '-' + i + '">' + e + s_1 + '</li>';
                    }
                    else {
                        r += '<li class="breadcrumb-item"><a href="#" id="' + this.id + '-' + i + '">' + e + s_1 + '</a></li>';
                    }
                    if (i == l - 1) {
                        this.lhtm = e;
                        this.leid = this.id + '-' + i;
                    }
                }
            }
            r += '</ol></nav>';
            return r;
        };
        return Breadcrumb;
    }(WUX.WComponent));
    APP.Breadcrumb = Breadcrumb;
    // Props: Pages
    // State: Current page
    var ResPages = /** @class */ (function (_super) {
        __extends(ResPages, _super);
        function ResPages(id, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'ResPages', 0, classStyle, style, attributes) || this;
            _this.rootTag = 'nav';
            _this.max = 5;
            return _this;
        }
        ResPages.prototype.refresh = function (rows, lim, tot, curr) {
            if (!tot)
                return this.clear();
            var pages = Math.floor(tot / lim);
            var rem = tot % lim;
            if (rem > 0)
                pages++;
            this.state = curr;
            this.props = pages;
            this.forceUpdate();
            return this;
        };
        ResPages.prototype.clear = function () {
            this.state = 0;
            this.props = 0;
            this.forceUpdate();
            return this;
        };
        ResPages.prototype.updateState = function (nextState) {
            if (this.state) {
                var ap = document.getElementById(this.id + '-' + this.state);
                if (ap) {
                    WUX.removeClassOf(ap.parentElement, 'active');
                }
            }
            if (!nextState)
                nextState = 1;
            _super.prototype.updateState.call(this, nextState);
            var an = document.getElementById(this.id + '-' + nextState);
            if (an) {
                WUX.addClassOf(an.parentElement, 'active');
            }
        };
        ResPages.prototype.componentDidMount = function () {
            var _this = this;
            if (this.props < 1) {
                this.root.innerHTML = '<nav id="' + this.id + '" class="pagination-wrapper" aria-label="Pagination"></nav>';
                return;
            }
            var r = '<nav id="' + this.id + '" class="pagination-wrapper" aria-label="Pagination">';
            r += '<ul class="pagination">';
            if (this.state == 1) {
                r += '<li class="page-item disabled">' + this.getBtnPrev() + '</li>';
            }
            else {
                r += '<li class="page-item">' + this.getBtnPrev() + '</li>';
            }
            if (this.max > 0 && this.props > this.max) {
                var b = this.state - (this.max - 2);
                if (b < 2) {
                    b = 1;
                }
                else {
                    var x = this.props - this.max + 1;
                    if (b > x)
                        b = x;
                }
                for (var i = b; i < b + this.max; i++) {
                    r += this.getPageItem(i, i == this.state);
                }
            }
            else {
                for (var i = 1; i <= this.props; i++) {
                    r += this.getPageItem(i, i == this.state);
                }
            }
            if (this.state == this.props) {
                r += '<li class="page-item disabled">' + this.getBtnNext() + '</li>';
            }
            else {
                r += '<li class="page-item">' + this.getBtnNext() + '</li>';
            }
            r += '</ul></nav>';
            this.root.innerHTML = r;
            var ap = document.getElementById(this.id + '-p');
            if (ap) {
                ap.addEventListener("click", function (e) {
                    var cs = _this.state;
                    if (cs > 1)
                        cs--;
                    _this.setState(cs);
                });
            }
            var an = document.getElementById(this.id + '-n');
            if (an) {
                an.addEventListener("click", function (e) {
                    var cs = _this.state;
                    if (cs < _this.props)
                        cs++;
                    _this.setState(cs);
                });
            }
            var _loop_1 = function (i) {
                var a = document.getElementById(this_1.id + '-' + i);
                if (!a)
                    return "continue";
                a.addEventListener("click", function (e) {
                    _this.setState(i);
                });
            };
            var this_1 = this;
            for (var i = 1; i <= this.props; i++) {
                _loop_1(i);
            }
        };
        ResPages.prototype.getBtnPrev = function () {
            return '<button id="' + this.id + '-p" class="page-link" aria-label="Precedente"><span aria-hidden="true"><i class="fa fa-angle-left fa-lg"></i></span><span class="sr-only">Precedente</span></button>';
        };
        ResPages.prototype.getBtnNext = function () {
            return '<button id="' + this.id + '-n" class="page-link" aria-label="Successiva"><span aria-hidden="true"><i class="fa fa-angle-right fa-lg"></i></span><span class="sr-only">Successiva</span></button>';
        };
        ResPages.prototype.getPageItem = function (i, a, t) {
            if (!t)
                t = '' + i;
            if (a)
                return '<li id="' + this.id + '-' + i + '" class="page-item" style="cursor:pointer;"><button aria-current="true" class="page-link" title="Page ' + i + '">' + t + '</button></i>';
            return '<li id="' + this.id + '-' + i + '" class="page-item" style="cursor:pointer;"><button class="page-link" title="Page ' + i + '">' + t + '</button></i>';
        };
        return ResPages;
    }(WUX.WComponent));
    APP.ResPages = ResPages;
    // Props: Pages
    // State: Current page
    var BtnPages = /** @class */ (function (_super) {
        __extends(BtnPages, _super);
        function BtnPages(id) {
            return _super.call(this, id ? id : '*', 'BtnPages') || this;
        }
        BtnPages.prototype.refresh = function (page, pages) {
            this.state = page;
            this.props = pages;
            this.forceUpdate();
            return;
        };
        BtnPages.prototype.updateState = function (n) {
            var p = document.getElementById(this.id + '-' + this.state);
            if (p)
                WUX.removeClassOf(p, 'active');
            _super.prototype.updateState.call(this, n);
            var a = document.getElementById(this.id + '-' + this.state);
            if (a)
                WUX.addClassOf(a, 'active');
        };
        BtnPages.prototype.render = function () {
            if (!this.props) {
                return '<div id="' + this.id + '"></div>';
            }
            if (!this.state)
                this.state = 1;
            var items = '';
            for (var i = 1; i <= this.props; i++) {
                items += '<li><a id="' + this.id + '-' + i + '" class="list-item" style="cursor:pointer;">Page ' + i + '</a></li>';
            }
            var r = '<div id="' + this.id + '" class="page-dropdown dropdown">';
            r += APP.dropdownBtn(this.id, 'Page ' + this.state + ' di ' + this.props, items);
            r += '</div>';
            return r;
        };
        BtnPages.prototype.componentDidMount = function () {
            var _this = this;
            var a = document.getElementById(this.id + '-' + this.state);
            if (a)
                WUX.addClassOf(a, 'active');
            var _loop_2 = function (i) {
                var a_1 = document.getElementById(this_2.id + '-' + i);
                if (!a_1)
                    return "continue";
                a_1.addEventListener("click", function (e) {
                    console.log('[BtnPages] click (i=' + i + ')', e);
                    _this.setState(i);
                });
            };
            var this_2 = this;
            for (var i = 1; i <= this.props; i++) {
                _loop_2(i);
            }
        };
        return BtnPages;
    }(WUX.WComponent));
    APP.BtnPages = BtnPages;
    // State: items per page
    var BtnItems = /** @class */ (function (_super) {
        __extends(BtnItems, _super);
        function BtnItems(id) {
            var _this = _super.call(this, id ? id : '*', 'BtnItems') || this;
            _this.IPP = [5, 10, 20, 50, 100];
            _this.state = _this.IPP[0];
            return _this;
        }
        BtnItems.prototype.render = function () {
            if (!this.state)
                this.state = this.IPP[0];
            var items = '';
            for (var i = 0; i < this.IPP.length; i++) {
                var v = this.IPP[i];
                items += '<li><a id="' + this.id + '-' + v + '" class="list-item" style="cursor:pointer;">' + v + ' items</a></li>';
            }
            var r = '<div class="page-dropdown dropdown">';
            r += APP.dropdownBtn(this.id, 'Items per page', items);
            r += '</div>';
            return r;
        };
        BtnItems.prototype.updateState = function (n) {
            var p = document.getElementById(this.id + '-' + this.state);
            if (p)
                WUX.removeClassOf(p, 'active');
            _super.prototype.updateState.call(this, n);
            var a = document.getElementById(this.id + '-' + this.state);
            if (a)
                WUX.addClassOf(a, 'active');
        };
        BtnItems.prototype.componentDidMount = function () {
            var _this = this;
            var a = document.getElementById(this.id + '-' + this.state);
            if (a)
                WUX.addClassOf(a, 'active');
            var _loop_3 = function (i) {
                var v = this_3.IPP[i];
                var a_2 = document.getElementById(this_3.id + '-' + v);
                if (!a_2)
                    return "continue";
                a_2.addEventListener("click", function (e) {
                    console.log('[BtnItems] click (v=' + v + ')', e);
                    _this.setState(v);
                });
            };
            var this_3 = this;
            for (var i = 0; i < this.IPP.length; i++) {
                _loop_3(i);
            }
        };
        return BtnItems;
    }(WUX.WComponent));
    APP.BtnItems = BtnItems;
    var DlgConfirm = /** @class */ (function (_super) {
        __extends(DlgConfirm, _super);
        function DlgConfirm(id, msg) {
            var _this = _super.call(this, id ? id : '*', 'DlgConfirm') || this;
            _this.DEF_MSG = 'Do you want to proceed with the operation?';
            _this.title = "Confirm";
            _this._msg = msg;
            if (!_this._msg)
                _this._msg = _this.DEF_MSG;
            _this.body.addRow().addCol('12').add(_this._msg);
            return _this;
        }
        Object.defineProperty(DlgConfirm.prototype, "message", {
            get: function () {
                return this._msg;
            },
            set: function (s) {
                this._msg = s;
                if (!this._msg)
                    this._msg = this.DEF_MSG;
                var em = this.body.getElement(0, 0);
                if (em)
                    em.innerText = this._msg;
            },
            enumerable: false,
            configurable: true
        });
        DlgConfirm.prototype.buildBtnOK = function () {
            return new WUX.WButton(this.subId('bfo'), 'Yes', '', 'btn btn-primary button-sm', '', '');
        };
        DlgConfirm.prototype.buildBtnCancel = function () {
            return new WUX.WButton(this.subId('bfc'), 'No', '', 'btn btn-secondary button-sm', '', '');
        };
        return DlgConfirm;
    }(WUX.WDialog));
    APP.DlgConfirm = DlgConfirm;
})(APP || (APP = {}));
var APP;
(function (APP) {
    var WUtil = WUX.WUtil;
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
    APP.formatDay = formatDay;
    function formatMonth(m, e, y) {
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
    APP.formatMonth = formatMonth;
    var WCalendar = /** @class */ (function (_super) {
        __extends(WCalendar, _super);
        function WCalendar(id, classStyle, style, attributes) {
            var _this = 
            // WComponent init
            _super.call(this, id ? id : '*', 'WCalendar', 1, classStyle, style, attributes) || this;
            // Array of marker
            _this.am = [];
            // Map date - title
            _this.mt = {};
            // Prev month
            _this.pm = 'Mese precedente';
            // Next month
            _this.nm = 'Mese successivo';
            // Class table
            _this.ct = 'table table-sm';
            // Class div table
            _this.cd = 'table-responsive';
            // Style previous
            _this.sp = 'padding:1rem;text-align:center;font-weight:bold;background-color:#eeeeee;';
            // Style month
            _this.sm = _this.sp;
            // Style next
            _this.sn = _this.sp;
            // Row (<tr>) style
            _this.tr = 'height:3rem;';
            // Style week day
            _this.sw = 'text-align:center;';
            // Style day
            _this.sd = 'text-align:center;vertical-align:middle;';
            // Style day over
            _this.so = 'text-align:center;vertical-align:middle;background-color:#f6f6f6;cursor:pointer;';
            // Style day selected (table-primary)
            _this.ss = 'text-align:center;vertical-align:middle;background-color:#b8d4f1;';
            // Style day marked (table-warning)
            _this.sk = 'text-align:center;vertical-align:middle;background-color:#ffeebc;';
            // Style empty
            _this.se = 'background-color:#f0f0f0;';
            // Style today
            _this.st = 'font-weight:bold;';
            // Today
            _this.td = _this.str(new Date());
            return _this;
        }
        WCalendar.prototype.onDoubleClick = function (handler) {
            if (!this.handlers['_doubleclick'])
                this.handlers['_doubleclick'] = [];
            this.handlers['_doubleclick'].push(handler);
        };
        WCalendar.prototype.updateState = function (nextState) {
            this.state = nextState;
            if (!this.state)
                this.state = new Date();
            var d = this.state.getDate();
            var m = this.state.getMonth();
            var y = this.state.getFullYear();
            this.ls = (y * 10000 + (m + 1) * 100 + d) + '';
        };
        WCalendar.prototype.render = function () {
            if (!this.state)
                this.state = new Date();
            // Build table
            var t = '<table id="' + this.subId('t') + '" class="' + this.ct + '"><thead><tr>';
            for (var x = 0; x < 7; x++) {
                var k_1 = x == 6 ? 0 : x + 1;
                t += '<th id="' + this.subId(k_1 + '') + '" style="' + this.sw + '">' + formatDay(k_1, false) + '</th>';
            }
            t += '</tr></thead><tbody id="' + this.subId('b') + '">';
            t += this.body();
            t += '</tbody></table>';
            // Build component
            var m = this.state.getMonth();
            var y = this.state.getFullYear();
            var k = y * 100 + m + 1;
            var p = '<a id="' + this.subId('p') + '" title="' + this.pm + '"><i class="fa fa-arrow-circle-left"></i></a>';
            var n = '<a id="' + this.subId('n') + '" title="' + this.nm + '"><i class="fa fa-arrow-circle-right"></i></a>';
            var i = '<div class="row"><div class="col-2" style="' + this.sp + '">' + p + '</div><div id="' + this.subId('m') + '" class="col-8" style="' + this.sm + '">' + formatMonth(k, true, true) + '</div><div class="col-2" style="' + this.sn + '">' + n + '</div></div>';
            if (this.cd) {
                i += '<div class="row"><div class="' + this.cd + '">' + t + '</div></div>';
            }
            else {
                i += '<div class="row"><div class="col-12">' + t + '</div></div>';
            }
            return this.buildRoot(this.rootTag, i);
        };
        WCalendar.prototype.add = function (a) {
            if (!this.state)
                this.state = new Date();
            var d = this.state.getDate();
            var m = this.state.getMonth();
            var y = this.state.getFullYear();
            var r = m + a;
            var n = new Date(y, r, d);
            var nm = n.getMonth();
            if (nm != r) {
                n = new Date(y, r + 1, 0);
                nm = n.getMonth();
            }
            var ny = n.getFullYear();
            // Invocare prima del metodo body
            this.setState(n);
            if (this.eb) {
                this.eb.innerHTML = this.body();
            }
            if (this.em) {
                var w = ny * 100 + nm + 1;
                this.em.innerText = formatMonth(w, true, true);
            }
            return n;
        };
        WCalendar.prototype.mark = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            if (!p || !p.length)
                return this;
            for (var _a = 0, p_1 = p; _a < p_1.length; _a++) {
                var o = p_1[_a];
                var dt = WUtil.toDate(o);
                if (!dt)
                    continue;
                var k = this.str(dt);
                this.am.push(k);
                if (k == this.ls)
                    continue;
                var e = document.getElementById(this.subId(k));
                if (e)
                    e.setAttribute('style', this.sk);
            }
            return this;
        };
        WCalendar.prototype.unmark = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            if (!p || !p.length)
                return this;
            for (var _a = 0, p_2 = p; _a < p_2.length; _a++) {
                var o = p_2[_a];
                var dt = WUtil.toDate(o);
                if (!dt)
                    continue;
                var k = this.str(dt);
                this.unm(this.am.indexOf(k));
            }
            return this;
        };
        WCalendar.prototype.title = function (d, t) {
            var dt = WUtil.toDate(d);
            if (!dt)
                return this;
            var k = this.str(dt);
            this.mt[k] = t;
            var e = document.getElementById(this.subId(k));
            if (e)
                e.setAttribute('title', t);
            return this;
        };
        WCalendar.prototype.unm = function (i, r) {
            if (r === void 0) { r = true; }
            if (i < 0)
                return;
            var k = this.am[i];
            if (!k)
                return;
            if (r)
                this.am.splice(i, 1);
            var e = document.getElementById(this.subId(k));
            if (e) {
                var s = this.str(this.state);
                if (s == k) {
                    e.setAttribute('style', this.ss);
                }
                else {
                    e.setAttribute('style', this.sd);
                }
            }
        };
        WCalendar.prototype.clear = function () {
            if (this.am && this.am.length) {
                for (var i = 0; i < this.am.length; i++) {
                    this.unm(i, false);
                }
                this.am = [];
            }
            if (this.mt) {
                for (var k in this.mt) {
                    var e = document.getElementById(this.subId(k));
                    if (e)
                        e.setAttribute('title', null);
                }
                this.mt = {};
            }
            return this;
        };
        WCalendar.prototype.prev = function () {
            return this.add(-1);
        };
        WCalendar.prototype.next = function () {
            return this.add(1);
        };
        WCalendar.prototype.ele = function (dt) {
            if (!dt)
                return null;
            return document.getElementById(this.subId(this.str(dt)));
        };
        WCalendar.prototype.str = function (dt) {
            if (!dt)
                return null;
            return (dt.getFullYear() * 10000 + (dt.getMonth() + 1) * 100 + dt.getDate()) + '';
        };
        WCalendar.prototype.from = function () {
            if (!this.state)
                this.state = new Date();
            var m = this.state.getMonth();
            var y = this.state.getFullYear();
            return (y * 10000 + (m + 1) * 100 + 1) + '';
        };
        WCalendar.prototype.to = function () {
            if (!this.state)
                this.state = new Date();
            var m = this.state.getMonth();
            var y = this.state.getFullYear();
            // Last day
            var n = new Date(y, m + 1, 0);
            var d = n.getDate();
            return (y * 10000 + (m + 1) * 100 + d) + '';
        };
        WCalendar.prototype.body = function () {
            if (!this.state)
                this.state = new Date();
            var b = '';
            // Current state
            var d = this.state.getDate();
            var m = this.state.getMonth();
            var y = this.state.getFullYear();
            this.ls = (y * 10000 + (m + 1) * 100 + d) + '';
            // First day of month
            var h = new Date(y, m, 1);
            var w = h.getDay();
            if (w == 0)
                w = 7;
            // Last day of month
            var j = new Date(y, m + 1, 0);
            var l = j.getDate();
            var z = 1;
            for (var r = 1; r <= 6; r++) {
                if (this.tr) {
                    b += '<tr style="' + this.tr + '">';
                }
                else {
                    b += '<tr>';
                }
                // rows
                for (var c = 1; c <= 7; c++) {
                    // cols
                    if (r == 1 && c < w) {
                        // empty cell in first row
                        b += '<td style="' + this.se + '"></td>';
                    }
                    else if (z > l) {
                        // empty cell in last row
                        b += '<td style="' + this.se + '"></td>';
                    }
                    else {
                        var k = (y * 10000 + (m + 1) * 100 + z) + '';
                        var t = k == this.td ? this.st : '';
                        var a = this.mt[k];
                        a = a ? ' title="' + a + '"' : '';
                        if (k == this.ls) {
                            b += '<td id="' + this.subId(k) + '" style="' + this.ss + t + '"' + a + '>' + z + '</td>';
                        }
                        else {
                            if (this.am.indexOf(k) >= 0) {
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
                if (z > l)
                    break;
            }
            return b;
        };
        WCalendar.prototype.componentDidMount = function () {
            var _this = this;
            this.ep = document.getElementById(this.subId('p'));
            this.em = document.getElementById(this.subId('m'));
            this.en = document.getElementById(this.subId('n'));
            this.et = document.getElementById(this.subId('t'));
            this.eb = document.getElementById(this.subId('b'));
            if (this.ep) {
                this.ep.addEventListener('click', function (e) {
                    _this.prev();
                });
            }
            if (this.en) {
                this.en.addEventListener('click', function (e) {
                    _this.next();
                });
            }
            this.root.addEventListener('click', function (e) {
                var s = WUX.lastSub(e.target);
                if (!s)
                    return;
                if (s.length == 8) {
                    var n = parseInt(s);
                    var t = s == _this.td ? _this.st : '';
                    // Date
                    var se = _this.ele(_this.state);
                    if (se) {
                        var p = _this.str(_this.state);
                        var q = p == _this.td ? _this.st : '';
                        if (_this.am.indexOf(p) >= 0) {
                            se.setAttribute('style', _this.sk + q);
                        }
                        else {
                            se.setAttribute('style', _this.sd + q);
                        }
                    }
                    e.target['style'] = _this.ss + t;
                    if (_this.ls == s)
                        return;
                    _this.setState(new Date(n / 10000, ((n % 10000) / 100) - 1, (n % 10000) % 100));
                }
            });
            this.root.addEventListener('dblclick', function (e) {
                var s = WUX.lastSub(e.target);
                if (!s)
                    return;
                if (s.length == 8) {
                    _this.trigger('_doubleclick', s);
                }
            });
            this.root.addEventListener('mouseover', function (e) {
                var s = WUX.lastSub(e.target);
                if (!s)
                    return;
                if (s.length == 8) {
                    var t = s == _this.td ? _this.st : '';
                    // Over date
                    e.target['style'] = _this.so + t;
                }
            });
            this.root.addEventListener('mouseout', function (e) {
                var s = WUX.lastSub(e.target);
                if (!s)
                    return;
                if (s.length == 8) {
                    var t = s == _this.td ? _this.st : '';
                    var i = _this.str(_this.state);
                    if (s == i) {
                        // Selected date
                        e.target['style'] = _this.ss + t;
                    }
                    else {
                        if (_this.am.indexOf(s) >= 0) {
                            // Marked date
                            e.target['style'] = _this.sk + t;
                        }
                        else {
                            // Normal date
                            e.target['style'] = _this.sd + t;
                        }
                    }
                }
            });
        };
        return WCalendar;
    }(WUX.WComponent));
    APP.WCalendar = WCalendar;
})(APP || (APP = {}));
var APP;
(function (APP) {
    /**
        Chart Component.
        P: string - Chart type (bar, line)
        S: WChartData - Chart data
    */
    var WChart = /** @class */ (function (_super) {
        __extends(WChart, _super);
        function WChart(id, type, classStyle, style) {
            var _this = _super.call(this, id ? id : '*', 'WChart', type, classStyle, style) || this;
            _this.rootTag = 'canvas';
            _this.forceOnChange = true;
            var iw = window.innerWidth;
            _this._w = 750;
            _this._h = 370;
            if (iw < 900 || iw > 1920) {
                _this._w = Math.round(750 * iw / 1400);
                _this._h = Math.round(370 * _this._w / 750);
            }
            _this._attributes = 'width="' + _this._w + '" height="' + _this._h + '"';
            _this.fontSize = 14;
            _this.fontName = 'Arial';
            _this.axis = '#808080';
            _this.grid = '#a0a0a0';
            _this.line = '#e23222';
            _this.offx = 30;
            _this.offy = 30;
            _this.barw = 16;
            return _this;
        }
        WChart.prototype.size = function (width, height) {
            this._w = width;
            this._h = height;
            if (this._w < 40)
                this._w = 40;
            if (this._h < 40)
                this._h = 40;
            this._attributes = 'width="' + this._w + '" height="' + this._h + '"';
            return this;
        };
        Object.defineProperty(WChart.prototype, "width", {
            get: function () {
                return this._w;
            },
            set: function (v) {
                this._w = v;
                if (this._w < 40)
                    this._w = 40;
                this._attributes = 'width="' + this._w + '" height="' + this._h + '"';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WChart.prototype, "height", {
            get: function () {
                return this._h;
            },
            set: function (v) {
                this._h = v;
                if (this._h < 40)
                    this._h = 40;
                this._attributes = 'width="' + this._w + '" height="' + this._h + '"';
            },
            enumerable: false,
            configurable: true
        });
        WChart.prototype.componentDidMount = function () {
            // Get data
            if (!this.state)
                return;
            var s = this.state.series;
            if (!s || !s.length)
                return;
            var d0 = s[0];
            if (!d0 || d0.length < 2)
                return;
            var cs = this.state.styles;
            // Get Context
            var r = this.root;
            var ctx = r.getContext('2d');
            if (!ctx)
                return;
            // Check labels (arguments)
            var labels = this.state.labels;
            var pady = 0;
            var padx = 0;
            var drawL = false;
            if (labels && labels.length == d0.length) {
                var t0 = labels[0];
                var l0 = t0 ? t0.length : 0;
                var dl = l0 > 4 ? Math.ceil(l0 / 2) : 2;
                pady = this.fontSize * dl + 4;
                padx = this.fontSize * 2 + 4;
                drawL = true;
            }
            // Boundary
            var cw = r.width - this.offx - padx;
            var ch = r.height - this.offy - pady;
            var bw = cw / (d0.length - 1);
            // Max Y
            var my = Math.max.apply(Math, d0);
            if (!my)
                my = 4;
            if (this.maxy && this.maxy > my) {
                my = this.maxy;
            }
            // Intermediate Y
            var iy = [Math.round(my / 4), Math.round(my / 2), Math.round(my * 3 / 4)];
            // Step Y
            var sy = ch / my;
            // Axis
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = this.axis;
            // Origin
            ctx.moveTo(this.offx, this.offy);
            // Y
            ctx.lineTo(this.offx, r.height - pady);
            // X
            ctx.lineTo(r.width - padx, r.height - pady);
            ctx.stroke();
            // Grid
            ctx.beginPath();
            ctx.setLineDash([4, 8]);
            ctx.lineWidth = 1;
            ctx.strokeStyle = this.grid;
            for (var i = 1; i < d0.length; i++) {
                var x = this.offx + i * bw;
                // X
                ctx.moveTo(x, this.offy);
                ctx.lineTo(x, r.height - pady);
            }
            // Max Y
            ctx.moveTo(this.offx, this.offy);
            ctx.lineTo(r.width - padx, this.offy);
            // Intermediate Y
            for (var _i = 0, iy_1 = iy; _i < iy_1.length; _i++) {
                var vy = iy_1[_i];
                ctx.moveTo(this.offx, r.height - pady - (vy * sy));
                ctx.lineTo(r.width - padx, r.height - pady - (vy * sy));
            }
            ctx.stroke();
            // Labels
            ctx.fillStyle = this.axis;
            ctx.font = this.fontSize + 'px ' + this.fontName;
            ctx.fillText('0', 0, r.height - pady);
            for (var _a = 0, iy_2 = iy; _a < iy_2.length; _a++) {
                var vy = iy_2[_a];
                ctx.fillText('' + vy, 0, r.height - pady - (vy * sy));
            }
            ctx.fillText('' + my, 0, this.offy);
            if (drawL) {
                for (var i = 0; i < labels.length; i++) {
                    var x = this.offx + i * bw;
                    // Etichetta inclinata sull'asse X
                    ctx.save();
                    ctx.translate(x - this.fontSize, r.height);
                    ctx.rotate(-Math.PI / 3);
                    ctx.fillStyle = this.axis;
                    ctx.fillText(labels[i], 0, 0);
                    ctx.restore();
                }
            }
            // Chart
            var type = this.props;
            if (!type)
                type = this.state.type;
            if (!type)
                type = 'line';
            if (type != 'bar') {
                ctx.setLineDash([]);
                for (var j = 0; j < s.length; j++) {
                    var dj = s[j];
                    // Mind this: < d0.length
                    if (!dj || dj.length < d0.length)
                        return;
                    var sl = this.line;
                    if (cs && cs.length > j) {
                        sl = cs[j];
                        if (!sl)
                            sl = this.line;
                    }
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = sl;
                    ctx.moveTo(this.offx, r.height - pady - (dj[0] * sy));
                    // Mind this: < d0.length
                    for (var i = 1; i < d0.length; i++) {
                        var x = this.offx + i * bw;
                        var y = r.height - pady - (dj[i] * sy);
                        ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                }
            }
            else {
                if (this.barw < 4)
                    this.barw = 4;
                for (var j = 0; j < s.length; j++) {
                    var dj = s[j];
                    // Mind this: < d0.length
                    if (!dj || dj.length < d0.length)
                        return;
                    var sl = this.line;
                    if (cs && cs.length > j) {
                        sl = cs[j];
                        if (!sl)
                            sl = this.line;
                    }
                    ctx.fillStyle = sl;
                    var sx = j * (this.barw + 1);
                    // Mind this: < d0.length
                    for (var i = 0; i < d0.length; i++) {
                        var x = this.offx + i * bw;
                        var y = r.height - pady - (dj[i] * sy);
                        if (i == 0) {
                            // Review first bar drawing!
                            ctx.fillRect(x + sx, y, this.barw, dj[i] * sy);
                        }
                        else if (s.length < 3) {
                            ctx.fillRect(x + sx - (this.barw / 2), y, this.barw, dj[i] * sy);
                        }
                        else {
                            ctx.fillRect(x + sx - (this.barw / 2) - ((this.barw + 1) * (s.length - 2)), y, this.barw, dj[i] * sy);
                        }
                    }
                }
            }
        };
        return WChart;
    }(WUX.WComponent));
    APP.WChart = WChart;
})(APP || (APP = {}));
var APP;
(function (APP) {
    var WUtil = WUX.WUtil;
    var action = WUX.action;
    var getAction = WUX.getAction;
    var DlgEntity = /** @class */ (function (_super) {
        __extends(DlgEntity, _super);
        function DlgEntity(id) {
            var _this = _super.call(this, id, 'DlgEntity') || this;
            _this.title = 'Entity';
            _this.form = new WUX.WForm(_this.subId('form'));
            _this.form.addRow();
            _this.form.addTextField('code', 'Code');
            _this.form.addRow();
            _this.form.addTextField('name', 'Name');
            _this.form.addInternalField('id');
            _this.form.setMandatory('code', 'name');
            _this.body
                .addRow()
                .addCol('col-md-12')
                .add(_this.form);
            return _this;
        }
        DlgEntity.prototype.updateState = function (nextState) {
            this.state = nextState;
            if (this.form) {
                this.form.clear();
                this.form.setState(this.state);
            }
        };
        DlgEntity.prototype.getState = function () {
            if (this.form)
                this.state = this.form.getState();
            return this.state;
        };
        DlgEntity.prototype.onClickOk = function () {
            if (this.props == 'new' || this.props == 'edit') {
                var m = this.form.checkMandatory(true, true);
                if (m) {
                    APP.showWarning('Check: ' + m);
                    return false;
                }
            }
            return true;
        };
        DlgEntity.prototype.onShown = function () {
            var _this = this;
            if (this.props == 'view') {
                this.form.enabled = false;
                this.updButtons('Close', '');
            }
            else {
                this.form.enabled = true;
                this.updButtons('Save');
                if (this.props == 'edit') {
                    this.form.setReadOnly('code', true);
                    setTimeout(function () { _this.form.focusOn('name'); });
                }
                else {
                    this.form.setReadOnly('code', false);
                    setTimeout(function () { _this.form.focusOn('code'); });
                }
            }
        };
        return DlgEntity;
    }(WUX.WDialog));
    APP.DlgEntity = DlgEntity;
    var GUIEntities = /** @class */ (function (_super) {
        __extends(GUIEntities, _super);
        function GUIEntities() {
            var _this = _super.call(this) || this;
            _this.page = 1;
            _this.mock = new APP.Mock();
            APP.http.mock = true;
            APP.http.mres = {
                "get": function (e, p) {
                    return _this.mock.find(e, p);
                },
                "post": function (e, p) {
                    return _this.mock.ins(e, p, 'id');
                },
                "put": function (e, p) {
                    return _this.mock.upd(e, p, 'id');
                },
                "delete": function (e, p) {
                    return _this.mock.del(e, p, 'id');
                }
            };
            _this.dlg = new DlgEntity(_this.subId('dlg'));
            // this.dlg.fullscreen = true;
            _this.dlg.onHiddenModal(function (e) {
                if (!_this.dlg.ok)
                    return;
                // Action
                var a = _this.dlg.getProps();
                // Data
                var s = _this.dlg.getState();
                if (!a || !s)
                    return;
                console.log('dlg action,state', a, s);
                switch (a) {
                    case 'new':
                        APP.http.post('entities/insert', s, function (res) {
                            if (res) {
                                APP.showSuccess('Item inserted successfully');
                                APP.addItem(_this.addActions(res), _this.table);
                                _this.refresh();
                            }
                            else {
                                APP.showWarning('Item not inserted');
                            }
                        });
                        break;
                    case 'edit':
                        APP.http.put('entities/update', s, function (res) {
                            if (res) {
                                APP.showSuccess('Item updated successfully');
                                APP.updItem(_this.addActions(res), _this.table, 'id');
                            }
                            else {
                                APP.showWarning('Item not updated');
                            }
                        });
                        break;
                }
            });
            return _this;
        }
        GUIEntities.prototype.render = function () {
            var _this = this;
            this.brcr = new APP.Breadcrumb();
            this.brcr.add('Entities');
            this.form = new WUX.WForm(this.subId('form'));
            this.form
                .legend('Filter')
                .addRow()
                .addTextField('code', 'Code')
                .addTextField('name', 'Name', { "span": 2 });
            this.btnFind = new WUX.WButton(this.subId('btnFind'), 'Search', 'fa-search', 'btn-icon btn btn-primary', 'margin-right: 0.5rem;');
            this.btnFind.on('click', function (e) {
                _this.doFind();
            });
            this.btnReset = new WUX.WButton(this.subId('btnReset'), 'Cancel', 'fa-undo', 'btn-icon btn btn-secondary');
            this.btnReset.on('click', function (e) {
                _this.form.clear();
                _this.form.focus();
                _this.table.setState([]);
                _this.refresh();
            });
            this.btnNew = new WUX.WButton(this.subId('btnNew'), 'New', 'fa-plus-circle', 'btn-icon btn btn-primary', 'margin-right: 0.5rem;');
            this.btnNew.on('click', function (e) {
                _this.dlg.setProps('new');
                _this.dlg.setState(null);
                _this.dlg.show(_this);
            });
            var h = ['Code', 'Name', 'View', 'Edit', 'Delete'];
            var k = ['code', 'name', '_v', '_m', '_d'];
            this.table = new WUX.WTable(this.subId('tapp'), h, k);
            this.table.selectionMode = 'single';
            this.table.div = 'table-responsive';
            this.table.types = ['s', 's', 'w', 'w', 'w'];
            this.table.sortable = [0, 1];
            this.table.paging = true;
            this.table.on('click', function (e) {
                var a = getAction(e, _this);
                console.log('click a=', a);
                if (!a || !a.ref)
                    return;
                if (a.name == 'sort')
                    return;
                var s = _this.table.getState();
                var x = WUtil.indexOf(s, 'id', a.ref);
                if (x < 0)
                    return;
                if (a.name == 'delete') {
                    APP.confirm('Do you want to delete the item?', function (cr) {
                        if (!cr)
                            return;
                        APP.http.delete('entities/delete', s[x], function (res) {
                            if (res) {
                                APP.showSuccess('Item successfully deleted');
                                APP.delItem(x, _this.table);
                                _this.refresh();
                            }
                            else {
                                APP.showWarning('Item not deleted');
                            }
                        });
                    });
                    return;
                }
                _this.dlg.setProps(a.name);
                _this.dlg.setState(s[x]);
                _this.dlg.show(_this);
            });
            this.table.onDoubleClick(function (e) {
                _this.dlg.setProps('view');
                _this.dlg.setState(e.data);
                _this.dlg.show(_this);
            });
            this.table.onRowPrepared(function (e) {
                var n = WUtil.getString(e.data, 'name');
                if (n == 'NA') {
                    WUX.setCss(e.rowElement, { bg: '#ffeebc' });
                }
            });
            this.table.onSelectionChanged(function (e) {
                var srd = _this.table.getSelectedRowsData();
                console.log('selection changed', srd);
            });
            // Pagination components
            // Link to page
            this.respg = new APP.ResPages(this.subId('respg'));
            this.respg.on('statechange', function (e) {
                _this.table.page = _this.respg.getState();
                _this.refresh(true);
            });
            // Page selection
            this.btnpg = new APP.BtnPages(this.subId('btnpg'));
            this.btnpg.on('statechange', function (e) {
                _this.table.page = _this.btnpg.getState();
                _this.refresh(true);
            });
            // Items per page
            this.btnip = new APP.BtnItems(this.subId('btnip'));
            this.btnip.on('statechange', function (e) {
                _this.table.page = 1;
                _this.table.plen = _this.btnip.getState();
                _this.refresh(true);
            });
            this.main = new WUX.WContainer();
            this.main
                .before(this.brcr)
                .addRow()
                .addCol('col-md-12')
                .add(this.form)
                .addRow()
                .addCol('col-md-8')
                .addGroup({ "classStyle": "form-row" }, this.btnFind, this.btnReset)
                .addCol('col-md-4', { a: 'right' })
                .addGroup({ "classStyle": "form-row" }, this.btnNew)
                .addRow()
                .addCol('col-md-12')
                .add(this.table)
                .addRow()
                .addCol('col-md-6')
                .add(this.respg)
                .addCol('col-md-3')
                .add(this.btnpg)
                .addCol('col-md-3')
                .add(this.btnip);
            return this.main;
        };
        GUIEntities.prototype.doFind = function () {
            var _this = this;
            // Validation
            var m = this.form.checkMandatory(true, true, true);
            if (m) {
                APP.showWarning('Check: ' + m);
                return;
            }
            // Search
            var filter = this.form.getState();
            APP.http.get('entities/find', filter, function (data) {
                if (!data)
                    data = [];
                var l = data.length;
                if (!l)
                    APP.showWarning('No items found');
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var r = data_1[_i];
                    _this.addActions(r);
                }
                _this.table.page = 1;
                _this.table.plen = _this.btnip.getState();
                _this.table.setState(data);
                _this.refresh();
            });
        };
        GUIEntities.prototype.addActions = function (r) {
            if (!r)
                return r;
            r["_v"] = action('view', r["id"], 'fa-search');
            r["_m"] = action('edit', r["id"], 'fa-edit');
            r["_d"] = action('delete', r["id"], 'fa-trash');
            return r;
        };
        GUIEntities.prototype.refresh = function (updTable) {
            if (updTable === void 0) { updTable = false; }
            if (updTable)
                this.table.forceUpdate();
            var data = this.table.getState();
            var l = data ? data.length : 0;
            this.respg.refresh(this.table.rows, this.table.plen, l, this.table.page);
            this.btnpg.refresh(this.table.page, this.respg.getProps());
        };
        return GUIEntities;
    }(WUX.WComponent));
    APP.GUIEntities = GUIEntities;
})(APP || (APP = {}));
