var WLaucher = /** @class */ (function () {
    function WLaucher(config) {
        this._cf = config;
        this._cs = [];
        this._ci = -1;
        this._js = [];
        this._ji = -1;
        this._cx = [];
        this._jx = [];
    }
    Object.defineProperty(WLaucher.prototype, "config", {
        get: function () {
            return this._cf;
        },
        set: function (s) {
            this._cf = s;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WLaucher.prototype, "loading", {
        get: function () {
            return this._le;
        },
        set: function (s) {
            this._le = s;
        },
        enumerable: false,
        configurable: true
    });
    WLaucher.prototype.css = function (href, v) {
        if (!href)
            return;
        if (v)
            href += '?' + v;
        this._cs.push(href);
    };
    WLaucher.prototype.js = function (src, v) {
        if (!src)
            return;
        if (v)
            src += '?' + v;
        this._js.push(src);
    };
    WLaucher.prototype.create = function (node, tag, id, cs, st, inner) {
        if (!tag)
            tag = 'div';
        if (id) {
            var c = document.getElementById(id);
            if (c)
                return c;
        }
        var n;
        if (typeof node == 'string') {
            n = document.getElementById(node);
            if (!n)
                n = document.querySelector(node);
        }
        else {
            n = node;
        }
        if (!n)
            return null;
        var e = document.createElement(tag);
        if (id)
            e.setAttribute('id', id);
        if (cs)
            e.setAttribute('class', cs);
        if (st)
            e.setAttribute('style', st);
        if (inner) {
            if (typeof inner == 'string') {
                e.innerHTML = inner;
            }
            else {
                e.append(inner);
            }
        }
        n.append(e);
        return e;
    };
    WLaucher.prototype.clear = function (node) {
        var n;
        if (typeof node == 'string') {
            n = document.getElementById(node);
            if (!n)
                n = document.querySelector(node);
        }
        else {
            n = node;
        }
        n.innerHTML = '';
        return n;
    };
    WLaucher.prototype.appendLinks = function () {
        var _this = this;
        var href = this.nextCss();
        // Se non vi sono ulteriori elementi si richiama la callback
        if (!href) {
            return;
        }
        // Si verifica che non sia gia' presente
        if (this._cx && this._cx.indexOf(href) >= 0) {
            this.appendLinks();
            return;
        }
        // Versionamento
        var vx = href.indexOf('?');
        if (vx) {
            var vk = href.substring(vx + 1);
            var vv = window[vk];
            if (vv)
                href = href.substring(0, vx + 1) + vv;
        }
        // Si procede con la creazione del tag link
        console.log('Load ' + href + '...');
        var e = document.createElement("link");
        e.rel = "stylesheet";
        e.type = "text/css";
        e.href = href;
        document.head.appendChild(e);
        e.onload = function () {
            _this.appendLinks();
        };
        e.onerror = function () {
            console.error(href + ' not loaded.');
            if (_this._ln) {
                _this._ln.innerHTML = '<span><em>' + href + ' not loaded.</em></span>';
            }
        };
        // Si aggiunge all'array complessivo
        this._cx.push(href);
    };
    WLaucher.prototype.appendScripts = function (cb) {
        var _this = this;
        var src = this.nextJs();
        // Se non vi sono ulteriori elementi si richiama la callback
        if (!src) {
            if (cb) {
                if (this._ln) {
                    this._ln.innerHTML = '';
                }
                console.log('Scripts callback...');
                cb();
            }
            return;
        }
        // Si verifica che non sia gia' presente
        if (this._jx && this._jx.indexOf(src) >= 0) {
            this.appendScripts(cb);
            return;
        }
        // Versionamento
        var vx = src.indexOf('?');
        if (vx) {
            var vk = src.substring(vx + 1);
            var vv = window[vk];
            if (vv)
                src = src.substring(0, vx + 1) + vv;
        }
        // Si procede con la creazione del tag script
        console.log('Load ' + src + '...');
        var e = document.createElement("script");
        e.type = "text/javascript";
        e.src = src;
        document.head.appendChild(e);
        e.onload = function () {
            _this.appendScripts(cb);
        };
        e.onerror = function () {
            console.error(src + ' not loaded.');
            if (_this._ln) {
                _this._ln.innerHTML = '<span><em>' + src + ' not loaded.</em></span>';
            }
        };
        // Si aggiunge all'array complessivo
        this._jx.push(src);
    };
    WLaucher.prototype.nextCss = function () {
        this._ci++;
        var lc = this._cs.length;
        if (lc && this._ci >= lc)
            return '';
        return this._cs[this._ci];
    };
    WLaucher.prototype.nextJs = function () {
        this._ji++;
        var lj = this._js.length;
        if (lj && this._ji >= lj)
            return '';
        return this._js[this._ji];
    };
    WLaucher.prototype.start = function (cb) {
        var _this = this;
        // Inizializzazione indici
        this._ci = -1;
        this._ji = -1;
        this._cx = [];
        this._jx = [];
        // Risoluzione elemento di loading
        this._ln = null;
        if (this._le) {
            if (typeof this._le == 'string') {
                this._ln = document.getElementById(this._le);
                if (!this._ln)
                    this._ln = document.querySelector(this._le);
            }
            else {
                this._ln = this._le;
            }
        }
        if (this._ln) {
            this._ln.innerHTML = '<span><em>Loading...</em></span>';
        }
        // Si caricano tutti i css e script presenti per effettuare il controllo.
        var ls = document.getElementsByTagName('link');
        for (var i = 0; i < ls.length; i++) {
            if (ls[i].href)
                this._cx.push(ls[i].href);
        }
        var ss = document.getElementsByTagName('script');
        for (var i = 0; i < ss.length; i++) {
            if (ss[i].src)
                this._jx.push(ss[i].src);
        }
        // Avvio applicazione
        window.addEventListener("load", function () {
            if (_this._cf && _this._jx.indexOf(_this._cf) < 0) {
                var src_1 = _this._cf + '?' + Date.now();
                console.log('Load ' + src_1 + '...');
                var e = document.createElement("script");
                e.type = "text/javascript";
                e.src = src_1;
                document.head.appendChild(e);
                e.onload = function () {
                    _this.appendLinks();
                    _this.appendScripts(cb);
                };
                e.onerror = function () {
                    console.error(src_1 + ' not loaded.');
                    if (_this._ln) {
                        _this._ln.innerHTML = '<span><em>' + src_1 + ' not loaded.</em></span>';
                    }
                };
            }
            else {
                _this.appendLinks();
                _this.appendScripts(cb);
            }
        });
    };
    return WLaucher;
}());
function wlaunch(script, loading, callback) {
    console.log('wlaunch(' + script + ', ' + loading + ', callback)...');
    var l = new WLaucher();
    // Configurazione
    l.config = '/webapp/config.js';
    // Feedback caricamento
    l.loading = loading;
    // Fogli di stile
    l.css('/webapp/devextreme/css/dx.common.css');
    l.css('/webapp/devextreme/css/dx.light.compact.css');
    // Script
    l.js('/webapp/js/plugins/filesaver/FileSaver.min.js');
    l.js('/webapp/cldr/cldr.min.js');
    l.js('/webapp/cldr/cldr/event.min.js');
    l.js('/webapp/cldr/cldr/supplemental.min.js');
    l.js('/webapp/cldr/cldr/unresolved.min.js');
    l.js('/webapp/globalize/globalize.min.js');
    l.js('/webapp/globalize/globalize/message.min.js');
    l.js('/webapp/globalize/globalize/number.min.js');
    l.js('/webapp/globalize/globalize/date.min.js');
    l.js('/webapp/globalize/globalize/currency.min.js');
    l.js('/webapp/devextreme/js/jszip.min.js');
    l.js('/webapp/devextreme/js/dx.web.js?');
    l.js('/webapp/devextreme/dx.messages.it.min.js');
    // WUX
    l.js('/webapp/wux/js/wux.min.js', 'appVersion');
    if (script) {
        l.js('/webapp/wux/js/' + script, 'appVersion');
    }
    // Elementi
    l.create(document.body, 'div', 'wux-waitpls', 'waitpls');
    // Avvio
    l.start(callback);
}
