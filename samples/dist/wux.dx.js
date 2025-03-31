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
var WUX;
(function (WUX) {
    function initDX(callback) {
        if (WUX.debug)
            console.log('[WUX] initDX...');
        var u = '/cldr/cldr-data-' + WUX.global.locale + '.json';
        fetch(u).then(function (response) {
            if (response.ok)
                return response.json();
            console.error('[WUX] initDX loading ' + u + ' failed', response);
        })
            .then(function (data) {
            Globalize.load(data);
            Globalize.locale(WUX.global.locale);
            DevExpress.localization.locale(WUX.global.locale);
            DevExpress.config({ defaultCurrency: 'EUR' });
            if (callback)
                callback();
        })
            .catch(function (error) {
            console.error('[WUX] initDX loading ' + u + ' failed', error);
        });
    }
    WUX.initDX = initDX;
    var WDX = /** @class */ (function (_super) {
        __extends(WDX, _super);
        function WDX(props, id, classStyle, style, attributes) {
            return _super.call(this, id, 'WDX', props, classStyle, style, attributes) || this;
        }
        Object.defineProperty(WDX.prototype, "options", {
            get: function () {
                return this.opts;
            },
            set: function (o) {
                this.opts = o;
                this.getInstance(o);
            },
            enumerable: false,
            configurable: true
        });
        WDX.prototype.componentDidMount = function () {
            if (!this.$r || !this.$r[this.props])
                return null;
            if (this.opts) {
                this.$r[this.props](this.opts);
            }
            else {
                this.$r[this.props]();
            }
            this.$i = this.$r[this.props]('instance');
            if (WUX.dxCompDidMount)
                WUX.dxCompDidMount(this);
        };
        WDX.prototype.updateState = function (nextState) {
            this.state = nextState;
            this.option('value', this.state);
        };
        WDX.prototype.getState = function () {
            var s = this.option('value');
            if (s != null)
                this.state = s;
            return this.state;
        };
        WDX.prototype.getInstance = function (o, c) {
            if (!this.$r || !this.$r[this.props])
                return null;
            if (o && typeof o != 'function')
                this.$r[this.props](o);
            this.$i = this.$r[this.props]('instance');
            if (this.$i) {
                if (c)
                    c(this.$i);
                if (typeof o == 'function')
                    o(this.$i);
            }
            return this.$i;
        };
        WDX.prototype.focus = function () {
            if (!this.$i)
                return this;
            this.$i.focus();
            return this;
        };
        WDX.prototype.dispose = function () {
            if (!this.$i)
                return this;
            this.$i.dispose();
            return this;
        };
        WDX.prototype.repaint = function (t, c) {
            var _this = this;
            if (t === void 0) { t = -1; }
            if (!this.$i)
                return this;
            if (t >= 0) {
                setTimeout(function () {
                    _this.$i.repaint();
                    if (c)
                        c(_this.$i);
                }, t);
            }
            else {
                this.$i.repaint();
                if (c)
                    c(this.$i);
            }
            return this;
        };
        WDX.prototype.option = function (n, v) {
            if (!this.$i)
                return this;
            if (v != undefined) {
                this.$i.option(n, v);
                return v;
            }
            return this.$i.option(n);
        };
        WDX.prototype._on = function (n, f) {
            if (!this.$i)
                return this;
            this.$i.on(n, f);
            return this;
        };
        WDX.prototype._off = function (n, f) {
            if (!this.$i)
                return this;
            this.$i.off(n, f);
            return this;
        };
        WDX.prototype._ = function (m) {
            var _a;
            var a = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                a[_i - 1] = arguments[_i];
            }
            if (!this.$i || !m)
                return null;
            var s = m.indexOf('.');
            if (s > 0) {
                var m0 = m.substring(0, s);
                var m1 = m.substring(s + 1);
                if (!this.$i[m0])
                    return null;
                var r0 = this.$i[m0]();
                if (!r0 || !r0[m1])
                    return null;
                return r0[m1].apply(r0, a);
            }
            if (!this.$i[m])
                return null;
            return (_a = this.$i)[m].apply(_a, a);
        };
        return WDX;
    }(WUX.WComponent));
    WUX.WDX = WDX;
    /**
     * Wrapper DxDataGrid. Required DevExpress.ui.dxDataGrid https://js.devexpress.com/
     */
    var WDXTable = /** @class */ (function (_super) {
        __extends(WDXTable, _super);
        function WDXTable(id, header, keys, classStyle, style, attributes, props) {
            var _this = 
            // WComponent init
            _super.call(this, id, 'WDXTable', props, classStyle, style, attributes) || this;
            // WDXTable init
            _this.header = header;
            _this.keys = [];
            if (keys) {
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var key = keys_1[_i];
                    _this.keys.push(WUX.WUtil.toString(key));
                }
            }
            else {
                if (_this.header)
                    for (var i = 0; i < _this.header.length; i++)
                        _this.keys.push(i.toString());
            }
            _this.types = [];
            _this.widths = [];
            _this.templates = [];
            _this.selectionMode = 'single';
            _this.filter = false;
            _this.keepSorting = false;
            _this.scrolling = 'virtual';
            _this.pageSize = 100;
            _this.paging = false;
            _this.sorting = true;
            _this.actions = [];
            _this.groups = [];
            _this.groupsCols = [];
            _this._editable = false;
            _this.editables = [];
            _this.editmap = {};
            _this.hiddenCols = [];
            return _this;
        }
        Object.defineProperty(WDXTable.prototype, "editable", {
            get: function () {
                return this._editable;
            },
            set: function (b) {
                this._editable = b;
                this.getInstance({ editing: { mode: "cell", allowUpdating: true } });
            },
            enumerable: false,
            configurable: true
        });
        WDXTable.prototype.setCellEditable = function (row, col, editable) {
            this.editmap[row + '_' + col] = editable;
            return this;
        };
        WDXTable.prototype.addHidden = function (col) {
            this.hiddenCols.push(col);
            return this;
        };
        WDXTable.prototype.refresh = function () {
            if (this.$i)
                this.$i.refresh();
            return this;
        };
        WDXTable.prototype.refreshAndEdit = function (row, col, t) {
            var _this = this;
            if (t === void 0) { t = 50; }
            if (!this.$i)
                return this;
            if (row == null || col == null || col == '' || col == -1) {
                this.$i.refresh();
            }
            else {
                this.$i.refresh().done([function () { setTimeout(function () { if (col)
                        _this.$i.editCell(row, col); }, t); }]);
            }
            return this;
        };
        WDXTable.prototype.repaintAndEdit = function (row, col, t) {
            var _this = this;
            if (t === void 0) { t = 50; }
            if (!this.$i)
                return this;
            if (row == null || col == null || col == '' || col == -1) {
                this.$i.repaint();
            }
            else {
                this.$i.repaintRows([row]);
                if (col != null)
                    setTimeout(function () { if (col)
                        _this.$i.editCell(row, col); }, t);
            }
            return this;
        };
        WDXTable.prototype.repaint = function () {
            var _this = this;
            if (this.$i)
                this.$i.repaint();
            if (this.handlers['_selectall'] && this.selectionMode == 'multiple') {
                setTimeout(function () {
                    var $cb = $('.dx-header-row .dx-checkbox').first();
                    if ($cb && $cb.length) {
                        if (!_this.$csa || !_this.$csa.is($cb)) {
                            _this.$csa = $cb;
                            var val_1 = _this.$csa.dxCheckBox('instance').option('value');
                            _this.$csa.on('click', function (e) {
                                e.data = val_1;
                                for (var _i = 0, _a = _this.handlers['_selectall']; _i < _a.length; _i++) {
                                    var h = _a[_i];
                                    h(e);
                                }
                            });
                        }
                    }
                }, 500);
            }
            return this;
        };
        WDXTable.prototype.closeEditCell = function () {
            if (this.$i)
                this.$i.closeEditCell();
            return this;
        };
        WDXTable.prototype.repaintRows = function (idxs) {
            if (this.$i)
                this.$i.repaintRows(idxs);
            return this;
        };
        WDXTable.prototype.repaintRowByKey = function (key) {
            if (!this.$i || !key)
                return this;
            var r = this.$i.getRowIndexByKey(key);
            if (r < 0)
                return this;
            this.$i.repaintRows([r]);
            return this;
        };
        WDXTable.prototype.addActions = function (key, field) {
            if (!field)
                return this;
            if (!key)
                key = '';
            field.key = key;
            this.actions.push(field);
            return this;
        };
        WDXTable.prototype.addGroupBefore = function (name, col) {
            if (!name)
                name = '';
            this.groups.push(name);
            var s = 0;
            var e = this.keys.length;
            if (col != null) {
                if (typeof col != 'number') {
                    var k = this.keys.indexOf(col);
                    if (k > 0)
                        e = k;
                }
                else {
                    e = col;
                }
            }
            var g = [];
            for (var i = s; i < e; i++)
                g.push(i);
            this.groupsCols.push(g);
        };
        WDXTable.prototype.addGroupAfter = function (name, col) {
            if (!name)
                name = '';
            this.groups.push(name);
            var s = 0;
            var e = this.keys.length;
            if (col != null) {
                if (typeof col != 'number') {
                    var k = this.keys.indexOf(col);
                    if (k >= 0)
                        s = k + 1;
                }
                else {
                    s = col + 1;
                }
            }
            var g = [];
            for (var i = s; i < e; i++)
                g.push(i);
            this.groupsCols.push(g);
        };
        WDXTable.prototype.addGroup = function (name, cols) {
            if (!cols || !cols.length)
                return;
            if (!name)
                name = '';
            this.groups.push(name);
            var c0 = cols[0];
            if (typeof c0 != 'number') {
                var coln = [];
                for (var i = 0; i < cols.length; i++) {
                    var k = this.keys.indexOf(cols[i]);
                    if (k >= 0)
                        coln.push(k);
                }
                this.groupsCols.push(coln);
            }
            else {
                this.groupsCols.push(cols);
            }
        };
        WDXTable.prototype.onClickAction = function (h) {
            if (!this.handlers['_clickaction'])
                this.handlers['_clickaction'] = [];
            this.handlers['_clickaction'].push(h);
        };
        WDXTable.prototype.onSelectionChanged = function (h) {
            // Single handler
            this.handlers['_selectionchanged'] = [h];
            this.getInstance({ onSelectionChanged: h });
        };
        WDXTable.prototype.onDoubleClick = function (h) {
            if (!this.handlers['_doubleclick'])
                this.handlers['_doubleclick'] = [];
            this.handlers['_doubleclick'].push(h);
        };
        WDXTable.prototype.onSelectAll = function (h) {
            if (!this.handlers['_selectall'])
                this.handlers['_selectall'] = [];
            this.handlers['_selectall'].push(h);
        };
        WDXTable.prototype.onDoneRefresh = function (h) {
            if (!this.handlers['_donerefresh'])
                this.handlers['_donerefresh'] = [];
            this.handlers['_donerefresh'].push(h);
        };
        WDXTable.prototype.onRowPrepared = function (h) {
            // Single handler
            this.handlers['_rowprepared'] = [h];
            this.getInstance({ onRowPrepared: h });
        };
        WDXTable.prototype.onCellPrepared = function (h) {
            // Single handler
            this.handlers['_cellprepared'] = [h];
            this.getInstance({ onCellPrepared: h });
        };
        WDXTable.prototype.onContentReady = function (h) {
            // Single handler
            this.handlers['_contentready'] = [h];
            this.getInstance({ onContentReady: h });
        };
        WDXTable.prototype.onRowUpdated = function (h) {
            // Single handler
            this.handlers['_rowupdated'] = [h];
            this.getInstance({ onRowUpdated: h });
        };
        WDXTable.prototype.onEditorPreparing = function (h) {
            // Single handler
            this.handlers['_editorpreparing'] = [h];
            this.getInstance({ onEditorPreparing: h });
        };
        WDXTable.prototype.onEditorPrepared = function (h) {
            // Single handler
            this.handlers['_editorprepared'] = [h];
            this.getInstance({ onEditorPrepared: h });
        };
        WDXTable.prototype.onEditingStart = function (h) {
            // Single handler
            this.handlers['_editingstart'] = [h];
            this.getInstance({ onEditingStart: h });
        };
        WDXTable.prototype.onCellClick = function (h) {
            // Single handler
            this.handlers['_cellclick'] = [h];
            this.getInstance({ onCellClick: h });
        };
        WDXTable.prototype.onScroll = function (h) {
            // Single handler
            this.handlers['_scroll'] = [h];
            if (this.$i)
                this.$i.getScrollable().on('scroll', h);
        };
        WDXTable.prototype.onKeyDown = function (h) {
            // Single handler
            this.handlers['_keydown'] = [h];
            this.getInstance({ onKeyDown: h });
        };
        WDXTable.prototype.onToolbarPreparing = function (h) {
            // Single handler
            this.handlers['_toolbarpreparing'] = [h];
            this.getInstance({ onToolbarPreparing: h });
        };
        WDXTable.prototype.scrollTo = function (location) {
            if (this.$i)
                this.$i.getScrollable().scrollTo(location);
        };
        WDXTable.prototype.scrollToRow = function (row, delta, timeOut) {
            if (delta === void 0) { delta = 0; }
            if (timeOut === void 0) { timeOut = 0; }
            if (!this.$i || !this.state)
                return;
            var l = this.state.length;
            if (l < 2)
                return;
            var s = this.$i.getScrollable();
            if (!s)
                return;
            var h = s.scrollHeight();
            if (!h)
                return;
            row = row - delta;
            if (row < 0)
                row = 0;
            var t = row * (h / l);
            if (timeOut) {
                setTimeout(function () {
                    s.scrollTo({ "top": t, "left": 0 });
                }, timeOut);
            }
            else {
                s.scrollTo({ "top": t, "left": 0 });
            }
        };
        WDXTable.prototype.clearFilter = function () {
            if (!this.$i || !this.state)
                return;
            this.$i.clearFilter();
        };
        WDXTable.prototype.off = function (events) {
            _super.prototype.off.call(this, events);
            if (!events)
                return this;
            var gopt = {};
            if (events.indexOf('_selectionchanged') >= 0)
                gopt.onSelectionChanged = null;
            if (events.indexOf('_rowprepared') >= 0)
                gopt.onRowPrepared = null;
            if (events.indexOf('_cellprepared') >= 0)
                gopt.onCellPrepared = null;
            if (events.indexOf('_contentready') >= 0)
                gopt.onContentReady = null;
            if (events.indexOf('_rowupdated') >= 0)
                gopt.onRowUpdated = null;
            if (events.indexOf('_editorprepared') >= 0)
                gopt.onEditorPrepared = null;
            if (events.indexOf('_editorpreparing') >= 0)
                gopt.onEditorPreparing = null;
            if (events.indexOf('_editingstart') >= 0)
                gopt.onEditingStart = null;
            if (events.indexOf('_cellclick') >= 0)
                gopt.onCellClick = null;
            if (events.indexOf('_keydown') >= 0)
                gopt.onKeyDown = null;
            if (events.indexOf('_toolbarpreparing') >= 0)
                gopt.onToolbarPreparing = null;
            this.getInstance(gopt);
            return this;
        };
        WDXTable.prototype.clearSelection = function () {
            if (!this.$i || !this.state)
                return this;
            this.$i.clearSelection();
            return this;
        };
        WDXTable.prototype.deselectAll = function () {
            if (this.$i)
                this.$i.deselectAll();
            return this;
        };
        WDXTable.prototype.select = function (idxs) {
            if (this.$i)
                this.$i.selectRowsByIndexes(idxs);
            return this;
        };
        WDXTable.prototype.selectRows = function (keys, preserve) {
            if (this.$i)
                this.$i.selectRows(keys, preserve);
            return this;
        };
        WDXTable.prototype.deselectRows = function (keys) {
            if (this.$i)
                this.$i.deselectRows(keys);
            return this;
        };
        WDXTable.prototype.selectAll = function (toggle) {
            if (!this.$i)
                return this;
            if (toggle) {
                var rsize = WUX.WUtil.size(this.getSelectedRows());
                var ssize = WUX.WUtil.size(this.state);
                if (rsize && rsize == ssize) {
                    this.$i.clearSelection();
                }
                else {
                    this.$i.selectAll();
                }
            }
            else {
                this.$i.selectAll();
            }
            return this;
        };
        WDXTable.prototype.setSelectionMode = function (s) {
            this.selectionMode = s;
            var gopt = {};
            if (this.selectionFilter && this.selectionFilter.length) {
                gopt.selection = { mode: this.selectionMode, deferred: true };
            }
            else {
                gopt.selection = { mode: this.selectionMode };
            }
            this.getInstance(gopt);
            return this;
        };
        WDXTable.prototype.setColVisible = function (col, vis) {
            if (!this.$r)
                return this;
            this.$r.dxDataGrid('columnOption', col, 'visible', vis);
            this.$i = this.$r.dxDataGrid('instance');
            return this;
        };
        WDXTable.prototype.edit = function (row, col, t) {
            var _this = this;
            if (t === void 0) { t = 200; }
            if (!this.$i)
                return this;
            setTimeout(function () {
                _this.$i.editCell(row, col);
            }, t);
            return this;
        };
        WDXTable.prototype.getFilter = function (key) {
            if (!this.$i)
                return '';
            var c = this.$i.getCombinedFilter(true);
            var s = WUX.WUtil.size(c);
            for (var i = 0; i < s; i++) {
                var f = c[i];
                if (Array.isArray(f)) {
                    if (f.length > 2) {
                        if (key != f[0])
                            continue;
                        return '' + f[1] + '' + f[2];
                    }
                }
                else if (typeof f == 'string') {
                    if (key == f && s > 2) {
                        return '' + c[1] + '' + c[2];
                    }
                }
            }
            return '';
        };
        WDXTable.prototype.getInstance = function (gopt) {
            if (!this.$r)
                return null;
            if (gopt)
                this.$r.dxDataGrid(gopt);
            this.$i = this.$r.dxDataGrid('instance');
            return this.$i;
        };
        WDXTable.prototype.pageIndex = function (p) {
            if (!this.$i)
                return this;
            this.$i.pageIndex(p);
            return this;
        };
        WDXTable.prototype.getSelectedKeys = function () {
            if (!this.$i)
                return [];
            return this.$i.getSelectedRowKeys();
        };
        WDXTable.prototype.getSelectedRows = function () {
            if (!this.$i)
                return [];
            var keys = this.$i.getSelectedRowKeys();
            if (!keys || !keys.length)
                return [];
            var rows = [];
            for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                var key = keys_2[_i];
                var idx = this.$i.getRowIndexByKey(key);
                if (idx < 0)
                    continue;
                rows.push(idx);
            }
            return rows;
        };
        WDXTable.prototype.isSelected = function (data) {
            if (!this.$i)
                return false;
            return this.$i.isRowSelected(data);
        };
        WDXTable.prototype.getSelectedRowsData = function () {
            if (!this.$i)
                return [];
            return this.$i.getSelectedRowsData();
        };
        WDXTable.prototype.getFilteredRowsData = function () {
            if (!this.$i)
                return this.state;
            var ds = this.$i.getDataSource();
            if (!ds)
                return this.state;
            var r = ds.items();
            if (!r || !r.length)
                return this.state;
            return r;
        };
        WDXTable.prototype.cellValue = function (rowIndex, dataField, value) {
            if (!this.$i)
                return null;
            if (value === undefined)
                return this.$i.cellValue(rowIndex, dataField);
            this.$i.cellValue(rowIndex, dataField, value);
        };
        WDXTable.prototype.saveEditData = function (r) {
            var _this = this;
            if (!this.$i)
                return this;
            if (r != null) {
                this.$i.saveEditData().done([function () { setTimeout(function () { _this.$i.repaintRows([r]); }, 0); }]);
            }
            else {
                this.$i.saveEditData();
            }
            return this;
        };
        WDXTable.prototype.count = function () {
            if (this.state)
                return this.state.length;
            return 0;
        };
        WDXTable.prototype.beforeInit = function (gopt) {
        };
        WDXTable.prototype.componentDidMount = function () {
            var _this = this;
            if (!this.header)
                this.header = [];
            var _self = this;
            // DataGrid Init Options
            var gopt;
            if (typeof (this.props) == 'object') {
                gopt = this.props;
            }
            else {
                gopt = {
                    showColumnLines: true,
                    showRowLines: true,
                    showBorders: true,
                    allowColumnResizing: true,
                    columnAutoWidth: true,
                    rowAlternationEnabled: false
                };
            }
            if (this._editable) {
                gopt.editing = { mode: "cell", allowUpdating: true };
            }
            if (this.hideHeader) {
                gopt.showColumnHeaders = false;
            }
            this.editmap = {};
            // Columns
            var cols = [];
            if (this.groups && this.groups.length) {
                for (var g = 0; g < this.groups.length; g++) {
                    var gname = this.groups[g];
                    var gcols = this.groupsCols[g];
                    var col = { caption: gname };
                    var subCols = [];
                    for (var s = 0; s < gcols.length; s++) {
                        var i = gcols[s];
                        var scol = void 0;
                        if (this.keys && this.keys.length) {
                            var k = this.keys[i];
                            if (this.hiddenCols.indexOf(k) >= 0)
                                continue;
                            scol = { caption: this.header[i], dataField: k };
                        }
                        else {
                            var k = i.toString();
                            if (this.hiddenCols.indexOf(k) >= 0)
                                continue;
                            scol = { caption: this.header[i], dataField: i.toString() };
                        }
                        scol.allowSorting = this.sorting;
                        var w = this.widths && this.widths.length > i ? this.widths[i] : 0;
                        if (w) {
                            if (w < 0) {
                                scol.allowSorting = false;
                            }
                            else {
                                scol.width = this.widthsPerc ? w + '%' : w;
                                if (i == 0)
                                    scol.fixed = true;
                            }
                        }
                        var x = this.filterOps && this.filterOps.length > i ? this.filterOps[i] : undefined;
                        if (x) {
                            if (x == '-') {
                                scol.allowFiltering = false;
                            }
                            else {
                                // "as any" to pass compiling checks added in ver. 18.1
                                scol.selectedFilterOperation = x;
                            }
                        }
                        var f = this.templates && this.templates.length > i ? this.templates[i] : undefined;
                        if (f)
                            scol.cellTemplate = f;
                        scol.allowEditing = this.editables && this.editables.length > i ? this.editables[i] : false;
                        var t = WUX.WUtil.getItem(this.types, i);
                        switch (t) {
                            case 's':
                                scol.dataType = 'string';
                                break;
                            case 'w':
                                scol.dataType = 'string';
                                scol.alignment = 'center';
                                break;
                            case 'c':
                                scol.dataType = 'number';
                                scol.format = { type: 'currency', precision: 2 };
                                break;
                            case 'c5':
                                scol.dataType = 'number';
                                scol.format = { type: 'currency', precision: 5 };
                                break;
                            case 'i':
                                scol.dataType = 'number';
                                scol.format = { precision: 0 };
                                break;
                            case 'n':
                                scol.dataType = 'number';
                                scol.format = { precision: 2 };
                                break;
                            case 'd':
                                scol.dataType = 'date';
                                scol.format = 'dd/MM/yyyy';
                                break;
                            case 't':
                                scol.dataType = 'date';
                                scol.format = 'dd/MM/yyyy HH:mm:ss';
                                break;
                            case 'b':
                                scol.dataType = 'boolean';
                                break;
                        }
                        subCols.push(scol);
                    }
                    if (gname != '-' && subCols.length) {
                        col.columns = subCols;
                        cols.push(col);
                    }
                    else {
                        for (var _i = 0, subCols_1 = subCols; _i < subCols_1.length; _i++) {
                            var scol = subCols_1[_i];
                            cols.push(scol);
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < this.header.length; i++) {
                    var col = void 0;
                    if (this.keys && this.keys.length) {
                        var k = this.keys[i];
                        if (this.hiddenCols.indexOf(k) >= 0)
                            continue;
                        col = { caption: this.header[i], dataField: k };
                    }
                    else {
                        var k = i.toString();
                        if (this.hiddenCols.indexOf(k) >= 0)
                            continue;
                        col = { caption: this.header[i], dataField: k };
                    }
                    col.allowSorting = this.sorting;
                    var w = this.widths && this.widths.length > i ? this.widths[i] : 0;
                    if (w) {
                        if (w < 0) {
                            col.allowSorting = false;
                        }
                        else {
                            col.width = this.widthsPerc ? w + '%' : w;
                            if (i == 0)
                                col.fixed = true;
                        }
                    }
                    var x = this.filterOps && this.filterOps.length > i ? this.filterOps[i] : undefined;
                    if (x) {
                        if (x == '-') {
                            col.allowFiltering = false;
                        }
                        else {
                            // "as any" to pass compiling checks added in ver. 18.1
                            col.selectedFilterOperation = x;
                        }
                    }
                    var f = this.templates && this.templates.length > i ? this.templates[i] : undefined;
                    if (f)
                        col.cellTemplate = f;
                    col.allowEditing = this.editables && this.editables.length > i ? this.editables[i] : false;
                    var t = WUX.WUtil.getItem(this.types, i);
                    switch (t) {
                        case 's':
                            col.dataType = 'string';
                            break;
                        case 'w':
                            col.dataType = 'string';
                            col.alignment = 'center';
                            break;
                        case 'c':
                            col.dataType = 'number';
                            col.format = { type: 'currency', precision: 2 };
                            break;
                        case 'c5':
                            col.dataType = 'number';
                            col.format = { type: 'currency', precision: 5 };
                            break;
                        case 'i':
                            col.dataType = 'number';
                            col.format = { precision: 0 };
                            break;
                        case 'n':
                            col.dataType = 'number';
                            col.format = { precision: 2 };
                            break;
                        case 'd':
                            col.dataType = 'date';
                            col.format = 'dd/MM/yyyy';
                            break;
                        case 't':
                            col.dataType = 'date';
                            col.format = 'dd/MM/yyyy HH:mm:ss';
                            break;
                        case 'b':
                            col.dataType = 'boolean';
                            break;
                    }
                    cols.push(col);
                }
            }
            // Actions
            if (this.actions && this.actions.length) {
                if (!this.actionsTitle)
                    this.actionsTitle = '';
                var aw = this.actionWidth ? this.actionWidth : 'auto';
                cols.push({
                    caption: this.actionsTitle,
                    width: aw,
                    alignment: 'center',
                    allowFiltering: false,
                    allowReordering: false,
                    allowResizing: false,
                    allowSorting: false,
                    allowEditing: false,
                    cellTemplate: function (container, options) {
                        if (_self.actionsStyle) {
                            WUX.setJQCss(container, _self.actionsStyle);
                        }
                        else {
                            container.addClass('actions');
                        }
                        for (var i = 0; i < _self.actions.length; i++) {
                            var f = _self.actions[i];
                            if (f.build) {
                                f.build(container, options.row.data);
                                continue;
                            }
                            var cid = void 0;
                            if (f.key)
                                cid = WUX.WUtil.getValue(options.row.data, f.key);
                            if (!cid)
                                cid = '_' + options.row.rowIndex;
                            var s = WUX.style(f.labelCss);
                            s = s ? ' style="' + s + '"' : '';
                            var $a = $('<a id="' + f.id + '-' + cid + '" class="' + f.classStyle + '"' + s + '>' + WUX.buildIcon(f.icon, '', '', 0, WUX.cls(f.style), f.label) + '</a>');
                            container.append($a);
                            $a.on('click', function (e) {
                                if (!_self.handlers['_clickaction'])
                                    return;
                                for (var _i = 0, _a = _self.handlers['_clickaction']; _i < _a.length; _i++) {
                                    var h = _a[_i];
                                    h(e);
                                }
                            });
                        }
                    }
                });
            }
            // dxDataGrid config
            gopt.columns = cols;
            if (this.dataSource) {
                gopt.dataSource = this.dataSource;
            }
            else {
                gopt.dataSource = this.state;
            }
            gopt.filterRow = { visible: this.filter };
            gopt.paging = { enabled: this.paging, pageSize: this.pageSize };
            if (this.paging) {
                gopt.pager = { showPageSizeSelector: false, allowedPageSizes: [this.pageSize], showInfo: true };
            }
            else {
                // "as any" to pass compiling checks added in ver. 18.1
                gopt.scrolling = { mode: this.scrolling };
            }
            gopt.onRowClick = function (e) {
                var lastClick = e.component['lastClick'];
                var currClick = e.component['lastClick'] = new Date();
                if (lastClick && (currClick.getTime() - lastClick.getTime() < 300)) {
                    if (!_this.handlers['_doubleclick'])
                        return;
                    for (var _i = 0, _a = _this.handlers['_doubleclick']; _i < _a.length; _i++) {
                        var handler = _a[_i];
                        handler({ element: _this.root, data: e.data });
                    }
                }
            };
            if (this.selectionMode && this.selectionMode != 'none') {
                if (this.selectionFilter && this.selectionFilter.length) {
                    gopt.selection = { mode: this.selectionMode, deferred: true };
                }
                else {
                    gopt.selection = { mode: this.selectionMode };
                }
            }
            if (this.selectionFilter && this.selectionFilter.length) {
                gopt.selectionFilter = this.selectionFilter;
            }
            if (this.exportFile) {
                gopt.export = { enabled: true, fileName: this.exportFile };
            }
            // Event handlers
            if (this.handlers['_selectionchanged'] && this.handlers['_selectionchanged'].length) {
                gopt.onSelectionChanged = this.handlers['_selectionchanged'][0];
            }
            if (this.handlers['_rowprepared'] && this.handlers['_rowprepared'].length) {
                gopt.onRowPrepared = this.handlers['_rowprepared'][0];
            }
            if (this.handlers['_cellprepared'] && this.handlers['_cellprepared'].length) {
                gopt.onCellPrepared = this.handlers['_cellprepared'][0];
            }
            if (this.handlers['_contentready'] && this.handlers['_contentready'].length) {
                gopt.onContentReady = this.handlers['_contentready'][0];
            }
            if (this.handlers['_rowupdated'] && this.handlers['_rowupdated'].length) {
                gopt.onRowUpdated = this.handlers['_rowupdated'][0];
            }
            if (this.handlers['_cellclick'] && this.handlers['_cellclick'].length) {
                gopt.onCellClick = this.handlers['_cellclick'][0];
            }
            if (this.handlers['_editorprepared'] && this.handlers['_editorprepared'].length) {
                gopt.onEditorPrepared = this.handlers['_editorprepared'][0];
            }
            if (this.handlers['_editorpreparing'] && this.handlers['_editorpreparing'].length) {
                gopt.onEditorPreparing = this.handlers['_editorpreparing'][0];
            }
            if (this.handlers['_editingstart'] && this.handlers['_editingstart'].length) {
                gopt.onEditingStart = this.handlers['_editingstart'][0];
            }
            if (this.handlers['_keydown'] && this.handlers['_keydown'].length) {
                gopt.onKeyDown = this.handlers['_keydown'][0];
            }
            if (this.handlers['_toolbarpreparing'] && this.handlers['_toolbarpreparing'].length) {
                gopt.onToolbarPreparing = this.handlers['_toolbarpreparing'][0];
            }
            this.beforeInit(gopt);
            this.$r.dxDataGrid(gopt);
            this.$i = this.$r.dxDataGrid('instance');
            if (this.handlers['_scroll'] && this.handlers['_scroll'].length) {
                this.$i.getScrollable().on('scroll', this.handlers['_scroll'][0]);
            }
            if (WUX.dxTableDidMount)
                WUX.dxTableDidMount(this);
        };
        WDXTable.prototype.componentWillUpdate = function (nextProps, nextState) {
            var _this = this;
            if (!nextState)
                nextState = [];
            this.editmap = {};
            var gopt;
            if (this.storeKey) {
                var ds = new DevExpress.data.DataSource(new DevExpress.data.ArrayStore({
                    data: nextState,
                    key: this.storeKey
                }));
                gopt = { dataSource: ds };
            }
            else {
                gopt = { dataSource: nextState };
            }
            gopt.paging = { enabled: this.paging, pageSize: this.pageSize };
            if (this.paging)
                gopt.pager = { showPageSizeSelector: false, allowedPageSizes: [this.pageSize], showInfo: true };
            if (!this.keepSorting) {
                this.$i.clearSorting();
            }
            if (!this.selectionFilter || !this.selectionFilter.length) {
                this.$i.clearSelection();
            }
            this.$r.dxDataGrid(gopt);
            this.$i = this.$r.dxDataGrid('instance');
            this.$i.refresh().done(function () {
                if (_this.handlers['_donerefresh']) {
                    for (var _i = 0, _a = _this.handlers['_donerefresh']; _i < _a.length; _i++) {
                        var h = _a[_i];
                        h(_this.createEvent('_donerefresh'));
                    }
                }
                if (_this.handlers['_selectall'] && _this.selectionMode == 'multiple') {
                    var $cb = $('.dx-header-row .dx-checkbox').first();
                    if ($cb && $cb.length) {
                        if (!_this.$csa || !_this.$csa.is($cb)) {
                            _this.$csa = $cb;
                            var val_2 = _this.$csa.dxCheckBox('instance').option('value');
                            _this.$csa.on('click', function (e) {
                                e.data = val_2;
                                for (var _i = 0, _a = _this.handlers['_selectall']; _i < _a.length; _i++) {
                                    var h = _a[_i];
                                    h(e);
                                }
                            });
                        }
                    }
                }
            });
            // Work around bug dx-loadpanel
            this.$r.find('.dx-loadpanel-content').hide();
        };
        return WDXTable;
    }(WUX.WComponent));
    WUX.WDXTable = WDXTable;
    /*
    * Wrapper dxTreeView. Required DevExpress.ui.dxTreeView https://js.devexpress.com/
    */
    var WDxTreeView = /** @class */ (function (_super) {
        __extends(WDxTreeView, _super);
        function WDxTreeView(id) {
            return _super.call(this, id ? id : '*', 'WDxTreeView') || this;
        }
        WDxTreeView.prototype.getInstance = function (opt) {
            if (!this.$r)
                return null;
            if (opt)
                this.$r.dxTreeView(opt);
            return this.$r.dxTreeView('instance');
        };
        /**
            To expand on click:
            e.component.expandItem(e.node.key);
        */
        WDxTreeView.prototype.onItemClick = function (h) {
            // Single handler
            this.handlers['_onItemClick'] = [h];
            if (this.mounted) {
                var opt = {
                    onItemClick: h
                };
                this.$r.dxTreeView(opt);
            }
        };
        WDxTreeView.prototype.onSelectionChanged = function (h) {
            // Single handler
            this.handlers['_onSelectionChanged'] = [h];
            if (this.mounted) {
                var opt = {
                    onSelectionChanged: h
                };
                this.$r.dxTreeView(opt);
            }
        };
        WDxTreeView.prototype.onItemRendered = function (h) {
            // Single handler
            this.handlers['_onItemRendered'] = [h];
            if (this.mounted) {
                var opt = {
                    onItemRendered: h
                };
                this.$r.dxTreeView(opt);
            }
        };
        WDxTreeView.prototype.getSelectedItems = function () {
            if (!this.mounted)
                return [];
            var n = this.$r.dxTreeView('instance').getSelectedNodes();
            if (!n)
                return [];
            return n.map(function (node) { return node.itemData; });
        };
        WDxTreeView.prototype.select = function (item) {
            if (!this.mounted)
                return this;
            this.$r.dxTreeView('selectItem', item);
            return this;
        };
        WDxTreeView.prototype.off = function (events) {
            _super.prototype.off.call(this, events);
            if (!events)
                return this;
            var opt = {};
            if (events.indexOf('_onItemClick') >= 0)
                opt.onItemClick = null;
            if (events.indexOf('_onSelectionChanged') >= 0)
                opt.onSelectionChanged = null;
            if (events.indexOf('_onItemRendered') >= 0)
                opt.onItemRendered = null;
            this.$r.dxTreeView(opt);
            return this;
        };
        WDxTreeView.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.$r && this.$r.length) {
                var opt = {
                    items: nextState
                };
                this.$r.dxTreeView(opt);
            }
        };
        WDxTreeView.prototype.updateProps = function (nextProps) {
            _super.prototype.updateProps.call(this, nextProps);
            if (!this.mounted)
                return;
            if (this.props) {
                this.$r.dxTreeView('instance').option('searchMode', this.props);
            }
        };
        WDxTreeView.prototype.beforeInit = function (opt) {
        };
        WDxTreeView.prototype.expandAll = function () {
            if (!this.mounted)
                return this;
            this.$r.dxTreeView('expandAll');
            return this;
        };
        WDxTreeView.prototype.collapseAll = function () {
            if (!this.mounted)
                return this;
            this.$r.dxTreeView('collapseAll');
            return this;
        };
        WDxTreeView.prototype.componentDidMount = function () {
            var opt = {
                height: this.height,
                width: this.width,
                searchEnabled: this.searchEnabled,
                items: this.state
            };
            if (this.selectionMode == "multiple") {
                opt.selectionMode = "multiple";
                opt.showCheckBoxesMode = "normal";
                opt.selectByClick = this.selectByClick;
            }
            if (this.handlers['_onItemClick'] && this.handlers['_onItemClick'].length) {
                opt.onItemClick = this.handlers['_onItemClick'][0];
            }
            if (this.handlers['_onSelectionChanged'] && this.handlers['_onSelectionChanged'].length) {
                opt.onSelectionChanged = this.handlers['_onSelectionChanged'][0];
            }
            if (this.handlers['_onItemRendered'] && this.handlers['_onItemRendered'].length) {
                opt.onItemRendered = this.handlers['_onItemRendered'][0];
            }
            this.beforeInit(opt);
            var t = this.$r.dxTreeView(opt);
            if (this.props) {
                t.option('searchMode', this.props);
            }
            if (WUX.dxTreeDidMount)
                WUX.dxTreeDidMount(this);
        };
        return WDxTreeView;
    }(WUX.WComponent));
    WUX.WDxTreeView = WDxTreeView;
})(WUX || (WUX = {}));
// Internal init
WUX.init0 = WUX.initDX;
