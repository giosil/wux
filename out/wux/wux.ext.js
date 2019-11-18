var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var WUX;
(function (WUX) {
    var WSelect2 = (function (_super) {
        __extends(WSelect2, _super);
        function WSelect2(id, options, multiple, classStyle, style, attributes, props) {
            var _this = _super.call(this, id ? id : '*', 'WSelect2', props, classStyle, style, attributes) || this;
            _this.rootTag = 'select';
            _this.options = options;
            _this.multiple = multiple;
            _this.openOnFocus = true;
            _this.dontOpen = false;
            _this.lastChange = 0;
            _this.count = options ? options.length : 0;
            _this._init = false;
            return _this;
        }
        Object.defineProperty(WSelect2.prototype, "visible", {
            set: function (b) {
                this._visible = b;
                if (this.internal)
                    this.internal.visible = b;
                if (this.root && this.root.length) {
                    if (!this.$cb)
                        this.$cb = this.root.parent().find('span[role="combobox"]').first();
                    if (this._visible) {
                        if (this.$cb && this.$cb.length) {
                            this.$cb.show();
                        }
                        else {
                            this.root.show();
                        }
                    }
                    else {
                        if (this.$cb && this.$cb.length) {
                            this.$cb.hide();
                        }
                        else {
                            this.root.hide();
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        WSelect2.prototype.focus = function () {
            if (!this.mounted)
                return this;
            if (!this._enabled)
                return this;
            this.root.focus();
            if (!this.$cb)
                this.$cb = this.root.parent().find('span[role="combobox"]').first();
            if (this.$cb && this.$cb.length)
                this.$cb.focus();
            return this;
        };
        WSelect2.prototype.getProps = function () {
            var _this = this;
            if (!this.root)
                return this.props;
            this.props = [];
            this.root.find('option:selected').each(function (i, e) {
                var t = $(e).text();
                if (_this.prefix)
                    t = _this.prefix + ' ' + t;
                if (_this.suffix)
                    t = t + ' ' + _this.suffix;
                _this.props.push(t);
            });
            return this.props;
        };
        WSelect2.prototype.getState = function () {
            if (!this.root)
                return this.state;
            return this.state = this.root.val();
        };
        WSelect2.prototype.getValue = function () {
            var id = this.getState();
            if (id == null)
                return null;
            var text = WUX.WUtil.toString(this.getProps());
            if (!text)
                text = '' + id;
            return { id: id, text: text };
        };
        WSelect2.prototype.select = function (i) {
            if (!this.root)
                return this;
            var val = this.root.find('option:eq(' + i + ')').val();
            if (val == null)
                return this;
            this.root.select2('val', val);
            return this;
        };
        WSelect2.prototype.setOptions = function (items) {
            this.options = items;
            if (!this.root)
                return this;
            this.root.empty();
            var data = [];
            if (this.options) {
                for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
                    var opt = _a[_i];
                    if (typeof opt == 'string') {
                        data.push({ id: opt, text: opt });
                    }
                    else {
                        data.push(opt);
                    }
                }
            }
            var options = { data: data, placeholder: "", allowClear: true };
            this.init(options);
            return this;
        };
        WSelect2.prototype.reload = function (clear) {
            if (clear)
                this.setState(null);
            if (!this.mounted)
                return this;
            this.root.empty();
            this.componentDidMount();
            return this;
        };
        WSelect2.prototype.render = function () {
            if (this.multiple)
                return this.buildRoot(this.rootTag, '', 'multiple="multiple"', 'form-control');
            return this.buildRoot(this.rootTag, '', '', 'form-control');
        };
        WSelect2.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (!this.root)
                return;
            if (Array.isArray(this.state) && this.state.length > 1) {
                this.root.append('<option value="' + this.state[0] + '">' + this.state[this.state.length - 1] + '</option>');
                this.root.val(this.state[0]).trigger('change');
            }
            else if (this.state) {
                if (typeof this.state == 'object') {
                    this.root.append('<option value="' + this.state.id + '">' + this.state.text + '</option>');
                    this.root.val(this.state.id).trigger('change');
                }
                else {
                    this.root.val(this.state).trigger('change');
                }
            }
            else {
                this.root.val([]).trigger('change');
            }
            this.dontTrigger = true;
            this.lastChange = new Date().getTime();
        };
        WSelect2.prototype.componentDidMount = function () {
            if (this._tooltip)
                this.root.attr('title', this._tooltip);
            if (this.options) {
                for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
                    var opt = _a[_i];
                    if (typeof opt == 'string') {
                        this.root.append('<option>' + WUX.WUtil.toText(opt) + '</option>');
                    }
                    else {
                        this.root.append('<option value="' + opt.id + '">' + WUX.WUtil.toText(opt.text) + '</option>');
                    }
                }
            }
            var options = { placeholder: "", allowClear: true };
            this.init(options);
        };
        WSelect2.prototype.init = function (options) {
            var _this = this;
            this.root.select2(options);
            this.updateState(this.state);
            if (options) {
                if (options.data) {
                    this.count = WUX.WUtil.size(options.data);
                }
            }
            else {
                this.count = 0;
            }
            if (this._init)
                return;
            this.$cb = this.root.parent().find('span[role="combobox"]').first();
            if (this.$cb.length) {
                this.$cb.on('focus', function (e) {
                    if (e.relatedTarget == null)
                        return;
                    if (_this.dontOpen) {
                        _this.dontOpen = false;
                        return;
                    }
                    if (_this.openOnFocus)
                        setTimeout(function () {
                            if (_this.multiple) {
                                if (_this.$cb && _this.$cb.length) {
                                    var $sf = _this.$cb.find('input.select2-search__field').first();
                                    if ($sf && $sf.length && !$sf.is(':focus'))
                                        $sf.focus();
                                }
                            }
                            else {
                                var d = new Date().getTime() - _this.lastChange;
                                if (d > 900)
                                    _this.root.select2('open');
                                _this.dontOpen = true;
                            }
                        }, 50);
                });
            }
            else {
                this.root.on('focus', function (e) {
                    if (_this.dontOpen) {
                        _this.dontOpen = false;
                        return;
                    }
                    if (_this.openOnFocus)
                        setTimeout(function () {
                            var d = new Date().getTime() - _this.lastChange;
                            if (d > 900)
                                _this.root.select2('open');
                            _this.dontOpen = true;
                        }, 50);
                });
            }
            if (this.multiple) {
                this.root.on('select2:select', function (e) {
                    _this.lastChange = new Date().getTime();
                    _this.trigger('statechange');
                });
                this.root.on('select2:unselect', function (e) {
                    setTimeout(function () {
                        _this.lastChange = new Date().getTime();
                        _this.trigger('statechange');
                    }, 0);
                });
            }
            else {
                this.root.on('change', function (e) {
                    _this.lastChange = new Date().getTime();
                    _this.trigger('statechange');
                });
            }
            this._init = true;
        };
        WSelect2.prototype.transferTo = function (dest, force, callback) {
            if (dest instanceof WSelect2) {
                dest.setState(this.getValue(), force, callback);
                return true;
            }
            return _super.prototype.transferTo.call(this, dest, force, callback);
        };
        return WSelect2;
    }(WUX.WComponent));
    WUX.WSelect2 = WSelect2;
    var WLookupDialog = (function (_super) {
        __extends(WLookupDialog, _super);
        function WLookupDialog(id, title, keys, onlyTable) {
            var _this = _super.call(this, id, 'WLookupDialog') || this;
            _this.title = title;
            if (!onlyTable) {
                _this.fp = new WUX.WFormPanel(_this.subId('fp'));
                _this.fp.addRow();
                _this.fp.addTextField('c', WUX.TXT.CODE);
                _this.fp.addRow();
                _this.fp.addTextField('d', WUX.TXT.DESCRIPTION);
                _this.fp.on('statechange', function (e) {
                    if (_this.lookup) {
                        _this.lookup(_this.getFilter(), function (result) {
                            _this.table.setState(result);
                        });
                    }
                });
            }
            _this.table = new WUX.WTable(_this.subId('table'), [WUX.TXT.CODE, WUX.TXT.DESCRIPTION], keys);
            _this.table.widths[0] = 200;
            _this.table.css({ h: 360 });
            _this.table.onDoubleClick(function (e) {
                var rd = _this.table.getSelectedRowsData();
                _this.selected = rd && rd.length ? rd[0] : undefined;
                if (_this.selected) {
                    _this.hide();
                    _this.trigger('_selected', _this.selected);
                }
            });
            if (onlyTable) {
                _this.body
                    .addRow()
                    .addCol('12', { pt: 8, pb: 8 })
                    .add(_this.table);
            }
            else {
                _this.body
                    .addRow()
                    .addCol('12')
                    .add(_this.fp)
                    .addRow()
                    .addCol('12', { pt: 8, pb: 8 })
                    .add(_this.table);
            }
            return _this;
        }
        WLookupDialog.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.table) {
                this.table.setState(this.state);
            }
        };
        WLookupDialog.prototype.setFilter = function (params) {
            if (!this.fp)
                return;
            this.fp.setValue('c', WUX.WUtil.getItem(params, 0));
            this.fp.setValue('d', WUX.WUtil.getItem(params, 1));
        };
        WLookupDialog.prototype.getFilter = function () {
            var r = [];
            if (!this.fp) {
                r.push('');
                r.push('');
                return r;
            }
            r.push(this.fp.getValue('c'));
            r.push(this.fp.getValue('d'));
            return r;
        };
        WLookupDialog.prototype.onSelected = function (handler) {
            if (!this.handlers['_selected'])
                this.handlers['_selected'] = [];
            this.handlers['_selected'].push(handler);
        };
        WLookupDialog.prototype.onShown = function () {
            this.startup = true;
            this.table.refresh();
            if (this.fp) {
                var d = this.fp.getValue('d');
                if (d) {
                    this.fp.focusOn('d');
                }
                else {
                    this.fp.focusOn('c');
                }
            }
        };
        WLookupDialog.prototype.onClickOk = function () {
            var _this = this;
            var rd = this.table.getSelectedRowsData();
            this.selected = rd && rd.length ? rd[0] : undefined;
            if (!this.selected) {
                WUX.showWarning('Selezionare un elemento.');
                return;
            }
            setTimeout(function () {
                _this.trigger('_selected', _this.selected);
            }, 100);
            return true;
        };
        return WLookupDialog;
    }(WUX.WDialog));
    WUX.WLookupDialog = WLookupDialog;
    var WMenu = (function (_super) {
        __extends(WMenu, _super);
        function WMenu(id, classStyle) {
            if (classStyle === void 0) { classStyle = 'btn-group'; }
            var _this = _super.call(this, id ? id : '*', 'WMenu', '', classStyle) || this;
            _this.items = [];
            _this.title = 'Seleziona';
            return _this;
        }
        WMenu.prototype.addItem = function (id, icon, text, bdef) {
            if (typeof id == 'string') {
                this.items.push({ id: id, icon: icon, text: text, marked: bdef });
            }
            else {
                this.items.push(id);
            }
            return this;
        };
        WMenu.prototype.addSep = function () {
            this.items.push({ id: '', type: 'b' });
            return this;
        };
        WMenu.prototype.addSection = function (name) {
            this.items.push({ id: '', type: 's', text: name });
            return this;
        };
        WMenu.prototype.onClick = function (handler) {
            this.handler = handler;
        };
        WMenu.prototype.buildItem = function (node, code, icon, text, bdef) {
            var _this = this;
            var $li = $('<li></li>');
            $li.appendTo(node);
            var $a;
            if (bdef) {
                $a = $('<a href="#"><i class="fa ' + icon + '"></i> &nbsp;<strong>' + text + '</strong></a>');
            }
            else {
                $a = $('<a href="#"><i class="fa ' + icon + '"></i> &nbsp;' + text + '</a>');
            }
            $a.appendTo($li);
            $a.on('click', function (e) {
                e.data = _this.data;
                e.key = code;
                _this.handler(e);
            });
        };
        WMenu.prototype.componentDidMount = function () {
            if (this.title == null)
                this.title = 'Seleziona';
            var dt = $('<a class="btn btn-link btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + this.title + ' <span class="caret"></span></a>');
            dt.appendTo(this.root);
            var dm = $('<ul class="dropdown-menu dropdown-menu-right"></ul>');
            dm.appendTo(this.root);
            if (!this.items)
                this.items = [];
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                if (!item.type || item.type == 'i') {
                    this.buildItem(dm, item.id, item.icon, item.text, item.marked);
                }
                else if (item.type == 'b') {
                    dm.append($('<li role="separator" class="divider"></li>'));
                }
                else if (item.type == 's') {
                    dm.append($('<li class="dropdown-header">' + item.text + '</li>'));
                }
            }
        };
        return WMenu;
    }(WUX.WComponent));
    WUX.WMenu = WMenu;
})(WUX || (WUX = {}));
//# sourceMappingURL=wux.ext.js.map