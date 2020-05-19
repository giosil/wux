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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var WUX;
(function (WUX) {
    var WContainer = (function (_super) {
        __extends(WContainer, _super);
        function WContainer(id, classStyle, style, attributes, inline, type, addClassStyle) {
            var _this = _super.call(this, id, 'WContainer', type, classStyle, WUX.style(style), attributes) || this;
            _this.inline = false;
            _this.components = [];
            _this.inline = inline;
            if (addClassStyle)
                _this._classStyle = _this._classStyle ? _this._classStyle + ' ' + addClassStyle : addClassStyle;
            _this.rootTag = inline ? 'span' : 'div';
            if (type == 'aside')
                _this.rootTag = 'aside';
            return _this;
        }
        WContainer.create = function (w) {
            if (!w)
                return new WContainer();
            var ctype = w.type ? '<' + w.type + '>' : '';
            var c = new WContainer(w.id, w.classStyle, w.style, w.attributes, false, ctype);
            c.wrapper = w.wrapper;
            return c;
        };
        WContainer.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.stateComp)
                this.stateComp.setState(this.state);
        };
        WContainer.prototype.getState = function () {
            if (this.stateComp)
                this.state = this.stateComp.getState();
            return this.state;
        };
        WContainer.prototype.on = function (events, handler) {
            _super.prototype.on.call(this, events, handler);
            if (events == 'statechange') {
                if (this.stateComp)
                    this.stateComp.on('statechange', handler);
            }
            return this;
        };
        WContainer.prototype.off = function (events) {
            _super.prototype.off.call(this, events);
            if (events == 'statechange') {
                if (this.stateComp)
                    this.stateComp.off('statechange');
            }
            return this;
        };
        WContainer.prototype.trigger = function (eventType) {
            var _a;
            var extParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                extParams[_i - 1] = arguments[_i];
            }
            _super.prototype.trigger.apply(this, __spreadArrays([eventType], extParams));
            if (eventType == 'statechange') {
                if (this.stateComp)
                    (_a = this.stateComp).trigger.apply(_a, __spreadArrays(['statechange'], extParams));
            }
            return this;
        };
        WContainer.prototype.setLayout = function (layoutManager) {
            this.layoutManager = layoutManager;
        };
        WContainer.prototype.section = function (title, secStyle, legStyle) {
            this.legend = title;
            this.fieldsetStyle = secStyle ? WUX.css(WUX.global.section, secStyle) : WUX.global.section;
            this.legendStyle = legStyle ? WUX.css(WUX.global.section_title, legStyle) : WUX.global.section_title;
            return this;
        };
        WContainer.prototype.area = function (title, areaStyle, legStyle) {
            this.legend = title;
            this.fieldsetStyle = areaStyle ? WUX.css(WUX.global.area, areaStyle) : WUX.global.area;
            this.legendStyle = legStyle ? WUX.css(WUX.global.area_title, legStyle) : WUX.global.area_title;
            return this;
        };
        WContainer.prototype.end = function () {
            if (this.parent instanceof WContainer)
                return this.parent.end();
            return this;
        };
        WContainer.prototype.grid = function () {
            if (this.props == 'row' && this.parent instanceof WContainer)
                return this.parent;
            if (this.parent instanceof WContainer)
                return this.parent.grid();
            return this;
        };
        WContainer.prototype.row = function () {
            if (this.props == 'row')
                return this;
            if (!this.parent) {
                if (!this.components || !this.components.length)
                    return this;
                for (var i = this.components.length - 1; i >= 0; i--) {
                    var c = this.components[i];
                    if (c instanceof WContainer && c.getProps() == 'row')
                        return c;
                }
                return this;
            }
            if (this.parent instanceof WContainer)
                return this.parent.row();
            return this;
        };
        WContainer.prototype.col = function () {
            if (this.props == 'col')
                return this;
            if (this.parent instanceof WContainer)
                return this.parent.col();
            return this;
        };
        WContainer.prototype.addDiv = function (hcss, inner, cls_att, id) {
            if (typeof hcss == 'number') {
                if (hcss < 1)
                    return this;
                var r = WUX.build('div', inner, { h: hcss, n: cls_att });
                return this.add($(r));
            }
            else {
                var r = WUX.build('div', inner, hcss, cls_att, id);
                return this.add($(r));
            }
        };
        WContainer.prototype.addSpan = function (wcss, inner, cls_att, id) {
            if (typeof wcss == 'number') {
                var r = WUX.build('span', inner, { w: wcss, d: 'inline-block', a: 'center', n: cls_att });
                return this.add($(r));
            }
            else {
                var r = WUX.build('span', inner, wcss, cls_att, id);
                return this.add($(r));
            }
        };
        WContainer.prototype.addGroup = function (w) {
            var ac = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                ac[_i - 1] = arguments[_i];
            }
            if (w) {
                var cnt = this.addContainer(w);
                if (!ac || !ac.length)
                    return this;
                for (var _a = 0, ac_1 = ac; _a < ac_1.length; _a++) {
                    var c = ac_1[_a];
                    cnt.add(c);
                }
                return this;
            }
            if (!ac || !ac.length)
                return this;
            for (var _b = 0, ac_2 = ac; _b < ac_2.length; _b++) {
                var c = ac_2[_b];
                this.add(c);
            }
            return this;
        };
        WContainer.prototype.add = function (component, constraints) {
            if (!component)
                return this;
            if (component instanceof WUX.WComponent) {
                if (!component.parent)
                    component.parent = this;
            }
            var c;
            if (typeof component == 'string' && component.length > 0) {
                if (component.charAt(0) == '<' && component.charAt(component.length - 1) == '>') {
                    c = $(component);
                }
            }
            if (!c)
                c = component;
            this.components.push(c);
            if (this.layoutManager)
                this.layoutManager.addLayoutComponent(c, constraints);
            return this;
        };
        WContainer.prototype.remove = function (index) {
            if (index < 0)
                index = this.components.length + index;
            if (index < 0 || index >= this.components.length)
                return undefined;
            var removed = this.components.splice(index, 1);
            if (this.layoutManager && removed.length)
                this.layoutManager.removeLayoutComponent(removed[0]);
            return this;
        };
        WContainer.prototype.removeAll = function () {
            if (this.layoutManager) {
                for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
                    var element = _a[_i];
                    this.layoutManager.removeLayoutComponent(element);
                }
            }
            if (this.mounted) {
                this.parent = null;
                for (var _b = 0, _c = this.components; _b < _c.length; _b++) {
                    var c = _c[_b];
                    if (c instanceof WUX.WComponent)
                        c.unmount();
                }
            }
            this.components = [];
            return this;
        };
        WContainer.prototype.addRow = function (classStyle, style, id, attributes) {
            var classRow = classStyle == null ? 'row' : classStyle;
            var row = new WContainer(id, classRow, style, attributes, false, 'row');
            row.name = row.name + '_row';
            return this.grid().addContainer(row);
        };
        WContainer.prototype.addCol = function (classStyle, style, id, attributes) {
            if (WUX.WUtil.isNumeric(classStyle))
                classStyle = 'col-md-' + classStyle;
            var classCol = classStyle == null ? 'col' : classStyle;
            var col = new WContainer(id, classCol, style, attributes, false, 'col');
            col.name = col.name + '_col';
            return this.row().addContainer(col);
        };
        WContainer.prototype.addASide = function (classStyle, style, id, attributes) {
            var c = new WContainer(id, classStyle, style, attributes, false, 'aside');
            c.name = c.name + '_aside';
            return this.end().addContainer(c);
        };
        WContainer.prototype.addBox = function (title, classStyle, style, id, attributes) {
            var box = new WBox(id, title, classStyle, style, attributes);
            this.addContainer(box);
            return box;
        };
        WContainer.prototype.addText = function (text, rowTag, classStyle, style, id, attributes) {
            if (!text || !text.length)
                return this;
            var endRow = '';
            if (rowTag) {
                var i = rowTag.indexOf(' ');
                endRow = i > 0 ? rowTag.substring(0, i) : rowTag;
            }
            var s = '';
            for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
                var r = text_1[_i];
                if (r && r.length > 3) {
                    var b = r.substring(0, 3);
                    if (b == '<ul' || b == '<ol' || b == '<li' || b == '<di') {
                        s += r;
                        continue;
                    }
                }
                if (rowTag && rowTag != 'br') {
                    s += '<' + rowTag + '>' + r + '</' + endRow + '>';
                }
                else {
                    s += r + '<br>';
                }
            }
            if (classStyle || style || id || attributes) {
                this.add(WUX.build('div', s, style, attributes, id, classStyle));
            }
            else {
                this.add(s);
            }
            return this;
        };
        WContainer.prototype.findBox = function (title_id) {
            var bid = '';
            if (title_id && title_id.length > 1 && title_id.charAt(0) == '#')
                bid = title_id.substring(1);
            for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
                var c = _a[_i];
                if (c instanceof WBox) {
                    if (bid) {
                        if (c.id == bid)
                            return c;
                    }
                    else if (title_id) {
                        if (c.title == title_id || c.id == title_id)
                            return c;
                    }
                    else {
                        return c;
                    }
                }
                else if (c instanceof WContainer) {
                    var b = c.findBox(title_id);
                    if (!b)
                        return b;
                }
            }
            return null;
        };
        WContainer.prototype.addStack = function (style) {
            var ac = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                ac[_i - 1] = arguments[_i];
            }
            if (!ac || ac.length == 0)
                return this;
            var rowStyle = WUX.style(style);
            var rowClass = WUX.cls(style);
            for (var i = 0; i < ac.length; i++) {
                var row = new WContainer(this.subId(), rowClass, rowStyle).add(ac[i]);
                row.name = row.name + '_stack_' + i;
                this.addContainer(row);
            }
            return this;
        };
        WContainer.prototype.addLine = function (style) {
            var ac = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                ac[_i - 1] = arguments[_i];
            }
            if (!ac || ac.length == 0)
                return this;
            var colStyle = WUX.style(style);
            var colClass = WUX.cls(style);
            for (var i = 0; i < ac.length; i++) {
                var c = ac[i];
                var s = this.subId();
                var col = void 0;
                if (!colClass && !colStyle) {
                    col = new WContainer(s, '', null, null, true).add(c);
                }
                else if (colClass) {
                    col = new WContainer(s, colClass, null, null, true).add(c);
                }
                else {
                    col = new WContainer(s, '', colStyle, null, true).add(c);
                }
                col.name = col.name + '_line_' + i;
                this.addContainer(col);
            }
            return this;
        };
        WContainer.prototype.addContainer = function (conid, classStyle, style, attributes, inline, props) {
            if (conid instanceof WContainer) {
                if (this._classStyle == null) {
                    if (conid._classStyle && conid._classStyle.indexOf('row') == 0) {
                        if (this.parent instanceof WContainer) {
                            this._classStyle = WUX.global.con_class;
                        }
                        else {
                            this._classStyle = WUX.global.main_class;
                        }
                    }
                }
                conid.parent = this;
                if (!conid.layoutManager)
                    conid.layoutManager = this.layoutManager;
                this.components.push(conid);
                if (this.layoutManager)
                    this.layoutManager.addLayoutComponent(conid, classStyle);
                return conid;
            }
            else if (typeof conid == 'string') {
                var container = new WContainer(conid, classStyle, style, attributes, inline, props);
                if (!container.layoutManager)
                    container.layoutManager = this.layoutManager;
                this.components.push(container);
                if (this.layoutManager)
                    this.layoutManager.addLayoutComponent(container);
                return container;
            }
            else {
                if (!conid)
                    return this;
                var c = WContainer.create(conid);
                c.parent = this;
                c.layoutManager = this.layoutManager;
                this.components.push(c);
                if (this.layoutManager)
                    this.layoutManager.addLayoutComponent(c, classStyle);
                return c;
            }
        };
        WContainer.prototype.render = function () {
            if (this.parent || this._classStyle || this._style) {
                return this.build(this.rootTag);
            }
            return this.buildRoot(this.rootTag);
        };
        WContainer.prototype.make = function () {
            if (this.legend == null)
                return '';
            var fss = this.fieldsetStyle ? ' style="' + WUX.style(this.fieldsetStyle) + '"' : '';
            var lgs = this.legendStyle ? ' style="' + WUX.style(this.legendStyle) + '"' : '';
            return '<fieldset id="' + this.subId('fs') + '"' + fss + '><legend' + lgs + '>' + this.legend + '</legend></fieldset>';
        };
        WContainer.prototype.componentDidMount = function () {
            var node = this.root;
            if (this.legend != null) {
                var $fs = $('#' + this.subId('fs'));
                if ($fs && $fs.length)
                    node = $fs;
            }
            if (this.wrapper)
                node = WUX.addWrapper(node, this.wrapper);
            if (this.layoutManager) {
                this.layoutManager.layoutContainer(this, node);
                return;
            }
            for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
                var element = _a[_i];
                if (element instanceof WUX.WComponent) {
                    element.mount(node);
                }
                else {
                    node.append(element);
                }
            }
        };
        WContainer.prototype.componentWillUnmount = function () {
            for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
                var c = _a[_i];
                if (c instanceof WUX.WComponent)
                    c.unmount();
            }
        };
        WContainer.prototype.rebuild = function () {
            var node = this.root;
            if (this.legend != null) {
                var $fs = $('#' + this.subId('fs'));
                if ($fs && $fs.length)
                    node = $fs;
            }
            node.empty();
            if (this.wrapper)
                node = WUX.addWrapper(node, this.wrapper);
            if (this.layoutManager) {
                this.layoutManager.layoutContainer(this, node);
                return;
            }
            for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
                var element = _a[_i];
                if (element instanceof WUX.WComponent) {
                    element.mount(node);
                }
                else {
                    node.append(element);
                }
            }
            return this;
        };
        return WContainer;
    }(WUX.WComponent));
    WUX.WContainer = WContainer;
    var WCardLayout = (function () {
        function WCardLayout() {
            this.mapConstraints = {};
            this.mapComponents = {};
        }
        WCardLayout.prototype.addLayoutComponent = function (component, constraints) {
            if (!component || !constraints)
                return;
            var cmpId = WUX.getId(component);
            if (!cmpId)
                return;
            this.mapConstraints[cmpId] = constraints;
            this.mapComponents[constraints] = component;
        };
        WCardLayout.prototype.removeLayoutComponent = function (component) {
            var cmpId = WUX.getId(component);
            if (!cmpId)
                return;
            var constraints = this.mapConstraints[cmpId];
            delete this.mapConstraints[cmpId];
            if (constraints)
                delete this.mapComponents[constraints];
        };
        WCardLayout.prototype.layoutContainer = function (container, root) {
            var curId = WUX.getId(this.currComp);
            for (var _i = 0, _a = container.components; _i < _a.length; _i++) {
                var c = _a[_i];
                var eleId = WUX.getId(c);
                var ehide = false;
                if (eleId && eleId != curId && this.mapConstraints[eleId])
                    ehide = true;
                if (c instanceof WUX.WComponent) {
                    if (ehide)
                        c.visible = false;
                    c.mount(root);
                }
                else if (c instanceof jQuery) {
                    if (ehide)
                        c.hide();
                }
            }
        };
        WCardLayout.prototype.show = function (container, name) {
            var c = this.mapComponents[name];
            if (!c)
                return;
            if (this.currComp instanceof WUX.WComponent) {
                this.currComp.visible = false;
            }
            else if (this.currComp instanceof jQuery) {
                this.currComp.show();
            }
            if (c instanceof WUX.WComponent) {
                c.visible = true;
                this.currComp = c;
            }
            else if (this.currComp instanceof jQuery) {
                c.show();
                this.currComp = c;
            }
            else {
                this.currComp = undefined;
            }
        };
        return WCardLayout;
    }());
    WUX.WCardLayout = WCardLayout;
    var WBox = (function (_super) {
        __extends(WBox, _super);
        function WBox(id, title, classStyle, style, attributes) {
            var _this = _super.call(this, id, WUX.global.box_class, style, attributes, false, 'box') || this;
            _this.TOOL_COLLAPSE = 'collapse-link';
            _this.TOOL_CLOSE = 'close-link';
            _this.TOOL_FILTER = 'filter-link';
            _this.name = 'WBox';
            _this._addClassStyle = classStyle;
            _this.title = title;
            return _this;
        }
        Object.defineProperty(WBox.prototype, "title", {
            get: function () {
                return this._title;
            },
            set: function (s) {
                if (this._title) {
                    this.header.remove(0);
                }
                this._title = s;
                if (s) {
                    if (s.charAt(0) != '<' && WUX.global.box_title) {
                        this.header.add(WUX.global.box_title.replace('$', s));
                    }
                    else {
                        this.header.add(s);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        WBox.prototype.addTool = function (tool, icon, attributes, handler) {
            var _this = this;
            if (!tool)
                return this;
            if (typeof tool == 'string') {
                if (!icon)
                    icon = WUX.WIcon.WRENCH;
                if (!this.cntls) {
                    this.cntls = new WContainer('', WUX.global.box_tools);
                    this.header.add(this.cntls);
                    this.tools = {};
                }
                var $r = $('<a class="' + tool + '">' + WUX.buildIcon(icon) + '</a>');
                this.cntls.add($r);
                this.tools[tool] = $r;
                if (handler) {
                    if (tool == this.TOOL_COLLAPSE) {
                        this.handlers['_' + this.TOOL_COLLAPSE] = [function (e) { _this.collapse(handler); }];
                    }
                    else {
                        this.handlers['_' + tool] = [handler];
                    }
                }
                else {
                    if (tool == this.TOOL_COLLAPSE)
                        this.handlers['_' + this.TOOL_COLLAPSE] = [function (e) { _this.collapse(); }];
                    if (tool == this.TOOL_CLOSE)
                        this.handlers['_' + this.TOOL_CLOSE] = [function (e) { _this.close(); }];
                }
            }
            else {
                this.header.add(tool);
            }
            return this;
        };
        WBox.prototype.addCollapse = function (handler) {
            this.addTool(this.TOOL_COLLAPSE, WUX.WIcon.CHEVRON_UP, '', handler);
            return this;
        };
        WBox.prototype.addClose = function (handler) {
            this.addTool(this.TOOL_CLOSE, WUX.WIcon.TIMES, '', handler);
            return this;
        };
        WBox.prototype.addFilter = function (handler) {
            this.addTool(this.TOOL_FILTER, WUX.WIcon.FILTER, '', handler);
            return this;
        };
        Object.defineProperty(WBox.prototype, "header", {
            get: function () {
                if (this._header)
                    return this._header;
                return this._header = new WContainer('', WUX.cls(WUX.global.box_header, this._addClassStyle));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WBox.prototype, "content", {
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WBox.prototype, "footer", {
            get: function () {
                if (this._footer)
                    return this._footer;
                return this._footer = new WContainer('', WUX.cls(WUX.global.box_footer, this._addClassStyle));
            },
            enumerable: true,
            configurable: true
        });
        WBox.prototype.componentDidMount = function () {
            if (this._header)
                this._header.mount(this.root);
            var boxContent = $(this.build('div', '', '', WUX.cls(WUX.global.box_content, this._addClassStyle), undefined, null));
            this.root.append(boxContent);
            for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
                var element = _a[_i];
                if (element instanceof WUX.WComponent) {
                    element.mount(boxContent);
                }
                else {
                    boxContent.append(element);
                }
            }
            if (this._footer)
                this._footer.mount(this.root);
            if (!this.tools)
                return;
            for (var t in this.tools) {
                var hs = this.handlers['_' + t];
                if (!hs || !hs.length)
                    continue;
                for (var _b = 0, hs_1 = hs; _b < hs_1.length; _b++) {
                    var h = hs_1[_b];
                    this.tools[t].click(h);
                }
            }
        };
        WBox.prototype.componentWillUnmount = function () {
            _super.prototype.componentWillUnmount.call(this);
            if (this._header)
                this._header.unmount();
            if (this._footer)
                this._footer.unmount();
        };
        WBox.prototype.end = function () {
            if (this.parent instanceof WContainer)
                return this.parent;
            return this;
        };
        WBox.prototype.addRow = function (classStyle, style, id, attributes) {
            var classRow = classStyle == null ? 'row' : classStyle;
            var row = new WContainer(id, classRow, style, attributes, false, 'row');
            row.name = row.name + '_row';
            return this.content.addContainer(row);
        };
        WBox.prototype.collapse = function (handler) {
            if (!this.root)
                return this;
            if (handler) {
                var e = this.createEvent('_' + this.TOOL_COLLAPSE, { collapsed: this.isCollapsed() });
                handler(e);
            }
            if (this.tools && this.tools[this.TOOL_COLLAPSE]) {
                this.tools[this.TOOL_COLLAPSE].find('i').toggleClass(WUX.WIcon.CHEVRON_UP).toggleClass(WUX.WIcon.CHEVRON_DOWN);
            }
            var d = this.root;
            d.children('.ibox-content').slideToggle(200);
            d.toggleClass('').toggleClass('border-bottom');
            setTimeout(function () {
                d.resize();
                d.find('[id^=map-]').resize();
            }, 50);
            return this;
        };
        WBox.prototype.expand = function (handler) {
            if (this.isCollapsed())
                this.collapse(handler);
            return this;
        };
        WBox.prototype.isCollapsed = function () {
            if (!this.root)
                return false;
            return this.tools[this.TOOL_COLLAPSE].find('i').hasClass(WUX.WIcon.CHEVRON_DOWN);
        };
        WBox.prototype.close = function () {
            if (!this.root)
                return this;
            this.root.remove();
        };
        return WBox;
    }(WContainer));
    WUX.WBox = WBox;
    var WDialog = (function (_super) {
        __extends(WDialog, _super);
        function WDialog(id, name, btnOk, btnClose, classStyle, style, attributes) {
            if (name === void 0) { name = 'WDialog'; }
            if (btnOk === void 0) { btnOk = true; }
            if (btnClose === void 0) { btnClose = true; }
            var _this = _super.call(this, id, name, undefined, classStyle, style, attributes) || this;
            _this.buttons = [];
            _this.tagTitle = 'h3';
            if (btnClose) {
                if (!btnOk)
                    _this.txtCancel = WUX.RES.CLOSE;
                _this.buttonCancel();
            }
            if (btnOk)
                _this.buttonOk();
            _this.ok = false;
            _this.cancel = false;
            _this.isShown = false;
            if (_this.id && _this.id != '*') {
                if ($('#' + _this.id).length)
                    $('#' + _this.id).remove();
            }
            WuxDOM.onRender(function (e) {
                if (_this.mounted)
                    return;
                _this.mount(e.element);
            });
            return _this;
        }
        WDialog.prototype.onShownModal = function (handler) {
            this.on('shown.bs.modal', handler);
        };
        WDialog.prototype.onHiddenModal = function (handler) {
            this.on('hidden.bs.modal', handler);
        };
        Object.defineProperty(WDialog.prototype, "header", {
            get: function () {
                if (this.cntHeader)
                    return this.cntHeader;
                this.cntHeader = new WContainer('', 'modal-header');
                this.btnCloseHeader = new WButton(this.subId('bhc'), '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>', undefined, 'close', '', 'data-dismiss="modal"');
                this.cntHeader.add(this.btnCloseHeader);
                return this.cntHeader;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WDialog.prototype, "body", {
            get: function () {
                if (this.cntBody)
                    return this.cntBody;
                this.cntBody = new WContainer('', WUX.cls('modal-body', this._classStyle), '', this._attributes);
                return this.cntBody;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WDialog.prototype, "footer", {
            get: function () {
                if (this.cntFooter)
                    return this.cntFooter;
                this.cntFooter = new WContainer('', 'modal-footer');
                return this.cntFooter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WDialog.prototype, "title", {
            get: function () {
                return this._title;
            },
            set: function (s) {
                if (this._title && this.cntHeader) {
                    this._title = s;
                    this.cntHeader.getRoot().children(this.tagTitle + ':first').text(s);
                }
                else {
                    this._title = s;
                    this.header.add(this.buildTitle(s));
                }
            },
            enumerable: true,
            configurable: true
        });
        WDialog.prototype.onClickOk = function () {
            return true;
        };
        WDialog.prototype.onClickCancel = function () {
            return true;
        };
        WDialog.prototype.buildBtnOK = function () {
            return new WButton(this.subId('bfo'), WUX.RES.OK, '', WUX.BTN.INFO + ' button-sm', '', '');
        };
        WDialog.prototype.buildBtnCancel = function () {
            if (this.txtCancel) {
                return new WButton(this.subId('bfc'), this.txtCancel, '', WUX.BTN.SECONDARY + ' button-sm', '', '');
            }
            return new WButton(this.subId('bfc'), WUX.RES.CANCEL, '', WUX.BTN.SECONDARY + ' button-sm', '', '');
        };
        WDialog.prototype.buttonOk = function () {
            var _this = this;
            if (this.btnOK)
                return this.btnOK;
            this.btnOK = this.buildBtnOK();
            this.btnOK.on('click', function (e) {
                if (_this.onClickOk()) {
                    _this.ok = true;
                    _this.cancel = false;
                    _this.root.modal('hide');
                }
            });
            this.buttons.push(this.btnOK);
        };
        WDialog.prototype.buttonCancel = function () {
            var _this = this;
            if (this.btnCancel)
                return this.btnCancel;
            this.btnCancel = this.buildBtnCancel();
            this.btnCancel.on('click', function (e) {
                if (_this.onClickCancel()) {
                    _this.ok = false;
                    _this.cancel = true;
                    _this.root.modal('hide');
                }
            });
            this.buttons.push(this.btnCancel);
        };
        WDialog.prototype.show = function (parent, handler) {
            if (!this.beforeShow())
                return;
            this.ok = false;
            this.cancel = false;
            this.parent = parent;
            this.parentHandler = handler;
            if (!this.mounted)
                WuxDOM.mount(this);
            if (this.root && this.root.length)
                this.root.modal({ backdrop: 'static', keyboard: false });
        };
        WDialog.prototype.hide = function () {
            if (this.root && this.root.length)
                this.root.modal('hide');
        };
        WDialog.prototype.close = function () {
            this.ok = false;
            this.cancel = false;
            if (this.root && this.root.length)
                this.root.modal('hide');
        };
        WDialog.prototype.selection = function (table, warn) {
            if (!table)
                return false;
            var sr = table.getSelectedRows();
            if (!sr || !sr.length) {
                if (warn)
                    WUX.showWarning(warn);
                return false;
            }
            var sd = table.getSelectedRowsData();
            if (!sd || !sd.length) {
                if (warn)
                    WUX.showWarning(warn);
                return false;
            }
            if (this.props == null || typeof this.props == 'number') {
                var idx = sr[0];
                this.setProps(idx);
            }
            this.setState(sd[0]);
            return true;
        };
        WDialog.prototype.beforeShow = function () {
            return true;
        };
        WDialog.prototype.onShown = function () {
        };
        WDialog.prototype.onHidden = function () {
        };
        WDialog.prototype.render = function () {
            this.isShown = false;
            this.cntRoot = new WContainer(this.id, 'modal inmodal fade', '', 'role="dialog" aria-hidden="true"');
            this.cntMain = this.cntRoot.addContainer('', 'modal-dialog modal-lg', this._style);
            this.cntContent = this.cntMain.addContainer('', 'modal-content');
            if (this.cntHeader)
                this.cntContent.addContainer(this.cntHeader);
            if (this.cntBody)
                this.cntContent.addContainer(this.cntBody);
            for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
                var btn = _a[_i];
                this.footer.add(btn);
            }
            if (this.cntFooter)
                this.cntContent.addContainer(this.cntFooter);
            return this.cntRoot;
        };
        WDialog.prototype.componentDidMount = function () {
            var _this = this;
            this.root.on('shown.bs.modal', function (e) {
                _this.isShown = true;
                _this.onShown();
            });
            this.root.on('hidden.bs.modal', function (e) {
                _this.isShown = false;
                _this.onHidden();
                if (_this.parentHandler) {
                    _this.parentHandler(e);
                    _this.parentHandler = null;
                }
            });
        };
        WDialog.prototype.componentWillUnmount = function () {
            this.isShown = false;
            if (this.btnCloseHeader)
                this.btnCloseHeader.unmount();
            if (this.btnCancel)
                this.btnCancel.unmount();
            if (this.cntFooter)
                this.cntFooter.unmount();
            if (this.cntBody)
                this.cntBody.unmount();
            if (this.cntHeader)
                this.cntHeader.unmount();
            if (this.cntContent)
                this.cntContent.unmount();
            if (this.cntMain)
                this.cntMain.unmount();
            if (this.cntRoot)
                this.cntRoot.unmount();
        };
        WDialog.prototype.buildTitle = function (title) {
            if (!this.tagTitle)
                this.tagTitle = 'h3';
            return '<' + this.tagTitle + '>' + WUX.WUtil.toText(title) + '</' + this.tagTitle + '>';
        };
        return WDialog;
    }(WUX.WComponent));
    WUX.WDialog = WDialog;
    var WLabel = (function (_super) {
        __extends(WLabel, _super);
        function WLabel(id, text, icon, classStyle, style, attributes) {
            var _this = _super.call(this, id, 'WLabel', icon, classStyle, style, attributes) || this;
            _this.rootTag = 'span';
            _this.updateState(text);
            return _this;
        }
        Object.defineProperty(WLabel.prototype, "icon", {
            get: function () {
                return this.props;
            },
            set: function (i) {
                this.update(i, this.state, true, false, false);
            },
            enumerable: true,
            configurable: true
        });
        WLabel.prototype.updateState = function (nextState) {
            if (!nextState)
                nextState = '';
            _super.prototype.updateState.call(this, nextState);
            if (this.root)
                this.root.html(WUX.buildIcon(this.props, '', ' ') + nextState);
        };
        WLabel.prototype.for = function (e) {
            this.forId = WUX.getId(e);
            return this;
        };
        WLabel.prototype.blink = function (n) {
            if (!this.root || !this.root.length)
                return this;
            this.blinks = n ? n : 3;
            this.highlight();
            return this;
        };
        WLabel.prototype.highlight = function () {
            if (!this.root || !this.root.length)
                return this;
            if (this.blinks) {
                this.blinks--;
                this.root.effect('highlight', {}, 600, this.highlight.bind(this));
            }
            return this;
        };
        WLabel.prototype.render = function () {
            var text = this.state ? this.state : '';
            if (this.forId)
                return this.buildRoot('label', WUX.buildIcon(this.props, '', ' ') + text, 'for="' + this.forId + '"', this._classStyle);
            return this.buildRoot(this.rootTag, WUX.buildIcon(this.props, '', ' ') + text, null, this._classStyle);
        };
        WLabel.prototype.componentDidMount = function () {
            if (this._tooltip)
                this.root.attr('title', this._tooltip);
        };
        return WLabel;
    }(WUX.WComponent));
    WUX.WLabel = WLabel;
    var WInput = (function (_super) {
        __extends(WInput, _super);
        function WInput(id, type, size, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'WInput', type, classStyle, style, attributes) || this;
            _this.rootTag = 'input';
            _this.size = size;
            _this.valueType = 's';
            _this.blurOnEnter = false;
            return _this;
        }
        WInput.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.root)
                this.root.val(nextState);
        };
        WInput.prototype.onEnterPressed = function (handler) {
            if (!this.handlers['_enter'])
                this.handlers['_enter'] = [];
            this.handlers['_enter'].push(handler);
        };
        WInput.prototype.render = function () {
            var l = '';
            if (this.label) {
                l = this.id ? '<label for="' + this.id + '">' : '<label>';
                var br = this.label.lastIndexOf('<br');
                if (br > 0) {
                    l += this.label.substring(0, br).replace('<', '&lt;').replace('>', '&gt;');
                    l += '</label><br>';
                }
                else {
                    l += this.label.replace('<', '&lt;').replace('>', '&gt;');
                    l += '</label> ';
                }
            }
            if (this.props == 'static') {
                return l + this.build('span', this.state);
            }
            else {
                var addAttributes = 'name="' + this.id + '"';
                addAttributes += this.props ? ' type="' + this.props + '"' : ' type="text"';
                if (this.size)
                    addAttributes += ' size="' + this.size + '"';
                if (this.state)
                    addAttributes += ' value="' + this.state + '"';
                if (this.placeHolder)
                    addAttributes += ' placeholder="' + this.placeHolder + '"';
                return l + this.build(this.rootTag, '', addAttributes);
            }
        };
        WInput.prototype.componentDidMount = function () {
            if (this._tooltip)
                this.root.attr('title', this._tooltip);
            var _self = this;
            this.root.keypress(function (e) {
                if (e.which == 13) {
                    var v = this.value;
                    if (_self.valueType == 'c') {
                        if (this.value)
                            this.value = WUX.formatCurr(WUX.WUtil.toNumber(this.value));
                    }
                    else if (_self.valueType == 'c5') {
                        if (this.value)
                            this.value = WUX.formatCurr5(WUX.WUtil.toNumber(this.value));
                    }
                    else if (_self.valueType == 'n' || _self.valueType == 'p') {
                        if (this.value)
                            this.value = WUX.formatNum(this.value);
                    }
                    else if (_self.valueType == 'i') {
                        if (this.value)
                            this.value = WUX.WUtil.toInt(this.value);
                    }
                    _self.trigger('statechange', v);
                    _self.trigger('_enter');
                    if (_self.blurOnEnter)
                        $(this).blur();
                }
            });
            this.root.blur(function (e) {
                var v = this.value;
                if (_self.valueType == 'c') {
                    if (this.value)
                        this.value = WUX.formatCurr(WUX.WUtil.toNumber(this.value));
                }
                else if (_self.valueType == 'c5') {
                    if (this.value)
                        this.value = WUX.formatCurr5(WUX.WUtil.toNumber(this.value));
                }
                else if (_self.valueType == 'n' || _self.valueType == 'p') {
                    if (this.value)
                        this.value = WUX.formatNum(this.value);
                }
                else if (_self.valueType == 'i') {
                    if (this.value)
                        this.value = WUX.WUtil.toInt(this.value);
                }
                if (_self.state != v)
                    _self.trigger('statechange', v);
            });
            this.root.focus(function (e) {
                if (!this.value)
                    return;
                if (_self.valueType == 'c' || _self.valueType == 'c5') {
                    var s = WUX.formatNum(this.value);
                    if (s.indexOf(',00') >= 0 && s.indexOf(',00') == s.length - 3)
                        s = s.substring(0, s.length - 3);
                    if (s.indexOf(',0') >= 0 && s.indexOf(',0') == s.length - 2)
                        s = s.substring(0, s.length - 3);
                    this.value = s;
                }
                else if (_self.valueType == 'n' || _self.valueType == 'p') {
                    this.value = WUX.formatNum(this.value);
                }
                else if (_self.valueType == 'i') {
                    this.value = this.value = WUX.WUtil.toInt(this.value);
                }
                $(this).select();
            });
        };
        return WInput;
    }(WUX.WComponent));
    WUX.WInput = WInput;
    var WTextArea = (function (_super) {
        __extends(WTextArea, _super);
        function WTextArea(id, rows, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'WTextArea', rows, classStyle, style, attributes) || this;
            _this.rootTag = 'textarea';
            if (!rows)
                _this.props = 5;
            return _this;
        }
        WTextArea.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.root)
                this.root.val(this.state);
        };
        WTextArea.prototype.getState = function () {
            if (this.root)
                this.state = WUX.norm(this.root.val());
            return this.state;
        };
        WTextArea.prototype.render = function () {
            if (!this.props)
                this.props = 1;
            if (this._style) {
                if (this._style.indexOf('width') < 0) {
                    this._style += ";width:100%";
                }
            }
            else {
                this._style = "width:100%";
            }
            if (this._attributes) {
                if (this._style.indexOf('rows=') < 0) {
                    this._attributes += ' rows="' + this.props + '"';
                }
            }
            else {
                this._attributes = 'rows="' + this.props + '"';
            }
            return WUX.build('textarea', '', this._style, this._attributes, this.id, this._classStyle);
        };
        WTextArea.prototype.componentDidMount = function () {
            if (this._tooltip)
                this.root.attr('title', this._tooltip);
            if (this.state)
                this.root.val(WUX.den(this.state));
        };
        return WTextArea;
    }(WUX.WComponent));
    WUX.WTextArea = WTextArea;
    var WCheck = (function (_super) {
        __extends(WCheck, _super);
        function WCheck(id, text, value, checked, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'WCheck', checked, classStyle, style, attributes) || this;
            _this.rootTag = 'input';
            _this.value = value ? value : '1';
            if (checked)
                _this.updateState(value);
            _this._text = text;
            return _this;
        }
        Object.defineProperty(WCheck.prototype, "text", {
            get: function () {
                if (!this._text && this.$label)
                    return this.$label.text();
                return this._text;
            },
            set: function (s) {
                if (!this._text && this.$label) {
                    this.$label.text(s);
                    return;
                }
                this._text = s;
                if (this.mounted)
                    this.root.html(s);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WCheck.prototype, "checked", {
            get: function () {
                this.props = this.root.is(':checked');
                this.state = this.props ? this.value : undefined;
                return this.props;
            },
            set: function (b) {
                this.setProps(b);
            },
            enumerable: true,
            configurable: true
        });
        WCheck.prototype.getState = function () {
            if (this.checked) {
                this.state = this.value;
            }
            else {
                this.state = null;
            }
            return this.state;
        };
        WCheck.prototype.updateProps = function (nextProps) {
            _super.prototype.updateProps.call(this, nextProps);
            this.state = this.props ? this.value : undefined;
            if (this.root)
                this.root.prop('checked', this.props);
        };
        WCheck.prototype.updateState = function (nextState) {
            if (typeof nextState == 'boolean') {
                nextState = nextState ? this.value : undefined;
            }
            _super.prototype.updateState.call(this, nextState);
            if (this.root)
                this.root.prop('checked', this.state != undefined);
        };
        WCheck.prototype.render = function () {
            var addAttributes = 'name="' + this.id + '" type="checkbox"';
            addAttributes += this.props ? ' checked="checked"' : '';
            var inner = this._text ? '&nbsp;' + this._text : '';
            return this.build(this.rootTag, inner, addAttributes);
        };
        WCheck.prototype.componentDidMount = function () {
            var _this = this;
            if (this._tooltip)
                this.root.attr('title', this._tooltip);
            this.root.change(function (e) {
                var checked = _this.root.is(':checked');
                _this.trigger('propschange', checked);
                _this.trigger('statechange', checked ? _this.value : undefined);
            });
        };
        WCheck.prototype.getWrapper = function (style) {
            if (this.wrapper)
                return this.wrapper;
            if (this.id) {
                this.$label = this._text ? $('<label for="' + this.id + '">' + this._text + '</label>') : $('<label></label>');
            }
            else {
                this.$label = this._text ? $('<label>' + this._text + '</label>') : $('<label></label>');
            }
            this._text = '';
            this.wrapper = new WUX.WContainer(this.subId(), 'checkbox', style);
            this.wrapper.add(this);
            this.wrapper.add(this.$label);
            this.wrapper.stateComp = this;
            return this.wrapper;
        };
        return WCheck;
    }(WUX.WComponent));
    WUX.WCheck = WCheck;
    var WButton = (function (_super) {
        __extends(WButton, _super);
        function WButton(id, text, icon, classStyle, style, attributes, type) {
            var _this = _super.call(this, id, 'WButton', icon, classStyle, style, attributes) || this;
            _this.updateState(text);
            _this.rootTag = 'button';
            _this.type = type ? type : 'button';
            return _this;
        }
        Object.defineProperty(WButton.prototype, "icon", {
            get: function () {
                return this.props;
            },
            set: function (i) {
                this.update(i, this.state, true, false, false);
            },
            enumerable: true,
            configurable: true
        });
        WButton.prototype.setText = function (text, icon) {
            if (icon != null)
                this.props = icon;
            this.setState(text);
        };
        WButton.prototype.render = function () {
            if (!this._classStyle)
                this._classStyle = WUX.BTN.PRIMARY;
            var addAttributes = this.type ? 'type="' + this.type + '"' : '';
            var html = '';
            if (this.state) {
                html += WUX.buildIcon(this.props, '', ' ') + this.state;
            }
            else {
                html += WUX.buildIcon(this.props);
            }
            return this.build(this.rootTag, html, addAttributes);
        };
        WButton.prototype.componentDidMount = function () {
            if (this._tooltip)
                this.root.attr('title', this._tooltip);
        };
        WButton.prototype.componentWillUpdate = function (nextProps, nextState) {
            var html = '';
            if (nextState) {
                html += WUX.buildIcon(this.props, '', ' ') + nextState;
            }
            else {
                html += WUX.buildIcon(this.props);
            }
            this.root.html(html);
        };
        return WButton;
    }(WUX.WComponent));
    WUX.WButton = WButton;
    var WLink = (function (_super) {
        __extends(WLink, _super);
        function WLink(id, text, icon, classStyle, style, attributes, href, target) {
            var _this = _super.call(this, id, 'WLink', icon, classStyle, style, attributes) || this;
            _this.updateState(text);
            _this.rootTag = 'a';
            _this._href = href;
            _this._target = target;
            return _this;
        }
        Object.defineProperty(WLink.prototype, "icon", {
            get: function () {
                return this.props;
            },
            set: function (s) {
                this.update(s, this.state, true, false, false);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WLink.prototype, "href", {
            get: function () {
                return this._href;
            },
            set: function (s) {
                this._href = s;
                if (this.root && this.root.length) {
                    if (s) {
                        this.root.attr('href', s);
                    }
                    else {
                        this.root.removeAttr('href');
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WLink.prototype, "target", {
            get: function () {
                return this._target;
            },
            set: function (s) {
                this._target = s;
                if (this.root && this.root.length) {
                    if (s) {
                        this.root.attr('target', s);
                    }
                    else {
                        this.root.removeAttr('target');
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        WLink.prototype.render = function () {
            var addAttributes = '';
            if (this._href)
                addAttributes += 'href="' + this._href + '"';
            if (this._target) {
                if (addAttributes)
                    addAttributes += ' ';
                addAttributes += 'target="' + this._target + '"';
            }
            var html = '';
            if (this.state) {
                html += WUX.buildIcon(this.icon, '', ' ') + this.state;
            }
            else {
                html += WUX.buildIcon(this.icon);
            }
            return this.build(this.rootTag, html, addAttributes);
        };
        WLink.prototype.componentDidMount = function () {
            if (this._tooltip)
                this.root.attr('title', this._tooltip);
        };
        WLink.prototype.componentWillUpdate = function (nextProps, nextState) {
            var html = '';
            if (nextState) {
                html += WUX.buildIcon(this.icon, '', ' ') + nextState;
            }
            else {
                html += WUX.buildIcon(this.icon);
            }
            this.root.html(html);
        };
        return WLink;
    }(WUX.WComponent));
    WUX.WLink = WLink;
    var WTab = (function (_super) {
        __extends(WTab, _super);
        function WTab(id, classStyle, style, attributes, props) {
            var _this = _super.call(this, id, 'WTab', props, classStyle, style, attributes) || this;
            _this.tabs = [];
            return _this;
        }
        WTab.prototype.addTab = function (title, icon) {
            var tab = new WContainer('', 'panel-body');
            tab.name = WUX.buildIcon(icon, '', ' ') + title;
            this.tabs.push(tab);
            return tab;
        };
        WTab.prototype.render = function () {
            if (this.state == null)
                this.state = 0;
            var r = '<div';
            if (this._classStyle) {
                r += ' class="tabs-container ' + this._classStyle + '"';
            }
            else {
                r += ' class="tabs-container"';
            }
            r += ' id="' + this.id + '"';
            if (this._style)
                r += ' style="' + this._style + '"';
            if (this.attributes)
                r += ' ' + this.attributes;
            r += '>';
            r += '<ul class="nav nav-tabs">';
            for (var i = 0; i < this.tabs.length; i++) {
                var tab = this.tabs[i];
                if (i == this.state) {
                    r += '<li class="active"><a data-toggle="tab" href="#' + this.id + '-' + i + '"> ' + tab.name + '</a></li>';
                }
                else {
                    r += '<li><a data-toggle="tab" href="#' + this.id + '-' + i + '"> ' + tab.name + '</a></li>';
                }
            }
            r += '</ul>';
            r += '<div class="tab-content">';
            for (var i = 0; i < this.tabs.length; i++) {
                if (i == this.state) {
                    r += '<div id="' + this.id + '-' + i + '" class="tab-pane active"></div>';
                }
                else {
                    r += '<div id="' + this.id + '-' + i + '" class="tab-pane"></div>';
                }
            }
            r += '</div></div>';
            return r;
        };
        WTab.prototype.componentDidUpdate = function (prevProps, prevState) {
            $('.nav-tabs a[href="#' + this.id + '-' + this.state + '"]').tab('show');
        };
        WTab.prototype.componentDidMount = function () {
            if (!this.tabs.length)
                return;
            for (var i = 0; i < this.tabs.length; i++) {
                var container = this.tabs[i];
                var tabPane = $('#' + this.id + '-' + i);
                if (!tabPane.length)
                    continue;
                container.mount(tabPane);
            }
            var _self = this;
            this.root.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var href = $(e.target).attr('href');
                if (href) {
                    var sep = href.lastIndexOf('-');
                    if (sep >= 0)
                        _self.setState(parseInt(href.substring(sep + 1)));
                }
            });
        };
        WTab.prototype.componentWillUnmount = function () {
            for (var _i = 0, _a = this.tabs; _i < _a.length; _i++) {
                var c = _a[_i];
                if (c)
                    c.unmount();
            }
        };
        return WTab;
    }(WUX.WComponent));
    WUX.WTab = WTab;
    var WSelect = (function (_super) {
        __extends(WSelect, _super);
        function WSelect(id, options, multiple, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'WSelect', null, classStyle, style, attributes) || this;
            _this.rootTag = 'select';
            _this.options = options;
            _this.multiple = multiple;
            return _this;
        }
        WSelect.prototype.getProps = function () {
            var _this = this;
            if (!this.root)
                return this.props;
            this.props = [];
            this.root.find('option:selected').each(function (i, e) {
                _this.props.push($(e).text());
            });
            return this.props;
        };
        WSelect.prototype.select = function (i) {
            if (!this.root || !this.options)
                return this;
            this.setState(this.options.length > i ? this.options[i] : null);
            return this;
        };
        WSelect.prototype.addOption = function (e, sel) {
            if (!e)
                return this;
            if (!this.options)
                this.options = [];
            this.options.push(e);
            if (!this.mounted)
                return this;
            var o = this.buildOptions();
            this.root.html(o);
            if (sel)
                this.updateState(e);
            return this;
        };
        WSelect.prototype.remOption = function (e) {
            if (!e || !this.options)
                return this;
            var x = -1;
            for (var i = 0; i < this.options.length; i++) {
                var s = this.options[i];
                if (!s)
                    continue;
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
                if (!this.mounted)
                    return this;
                var o = this.buildOptions();
                this.root.html(o);
            }
            return this;
        };
        WSelect.prototype.setOptions = function (options, prevVal) {
            this.options = options;
            if (!this.mounted)
                return this;
            var pv = this.root.val();
            var o = this.buildOptions();
            this.root.html(o);
            if (prevVal) {
                this.root.val(pv);
            }
            else if (options && options.length) {
                if (typeof options[0] == 'string') {
                    this.trigger('statechange', options[0]);
                }
                else {
                    this.trigger('statechange', WUX.WUtil.getString(options[0], 'id'));
                }
            }
            return this;
        };
        WSelect.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.root) {
                if (this.state == null) {
                    this.root.val('');
                }
                else if (typeof this.state == 'string' || typeof this.state == 'number') {
                    this.root.val('' + this.state);
                }
                else {
                    this.root.val(this.state.id);
                }
            }
        };
        WSelect.prototype.render = function () {
            var o = this.buildOptions();
            var addAttributes = 'name="' + this.id + '"';
            if (this.multiple)
                addAttributes += ' multiple="multiple"';
            return this.buildRoot('select', o, addAttributes);
        };
        WSelect.prototype.componentDidMount = function () {
            var _this = this;
            if (this._tooltip)
                this.root.attr('title', this._tooltip);
            if (this.state)
                this.root.val(this.state);
            this.root.on('change', function (e) {
                _this.trigger('statechange', _this.root.val());
            });
        };
        WSelect.prototype.buildOptions = function () {
            var r = '';
            if (!this.options)
                this.options = [];
            for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
                var opt = _a[_i];
                if (typeof opt == 'string') {
                    r += '<option>' + opt + '</option>';
                }
                else {
                    r += '<option value="' + opt.id + '">' + opt.text + '</option>';
                }
            }
            return r;
        };
        return WSelect;
    }(WUX.WComponent));
    WUX.WSelect = WSelect;
    var WRadio = (function (_super) {
        __extends(WRadio, _super);
        function WRadio(id, options, classStyle, style, attributes, props) {
            var _this = _super.call(this, id ? id : '*', 'WRadio', props, classStyle, style, attributes) || this;
            _this.options = options;
            return _this;
        }
        Object.defineProperty(WRadio.prototype, "tooltip", {
            set: function (s) {
                this._tooltip = s;
                if (this.internal)
                    this.internal.tooltip = s;
                if (!this.options || !this.options.length)
                    return;
                for (var i = 0; i < this.options.length; i++) {
                    var $item = $('#' + this.id + '-' + i);
                    if (!$item.length)
                        continue;
                    if (this._tooltip)
                        $item.attr('title', this._tooltip);
                }
            },
            enumerable: true,
            configurable: true
        });
        WRadio.prototype.select = function (i) {
            if (!this.root || !this.options)
                return this;
            this.setState(this.options.length > i ? this.options[i] : null);
            return this;
        };
        WRadio.prototype.render = function () {
            var r = '';
            if (this.label) {
                r += this.id ? '<label for="' + this.id + '">' : '<label>';
                r += this.label.replace('<', '&lt;').replace('>', '&gt;');
                r += '</label> ';
            }
            if (!this.options || !this.options.length)
                return r;
            if (this.state === undefined)
                this.state = this.options[0];
            for (var i = 0; i < this.options.length; i++) {
                var opt = this.options[i];
                if (typeof opt == "string") {
                    if (WUX.match(this.state, opt)) {
                        r += '&nbsp;<label style="display:inline;"><input type="radio" value="' + opt + '" name="' + this.id + '" id="' + this.id + '-' + i + '" checked> ' + opt + '</label>&nbsp;';
                    }
                    else {
                        r += '&nbsp;<label style="display:inline;"><input type="radio" value="' + opt + '" name="' + this.id + '" id="' + this.id + '-' + i + '"> ' + opt + '</label>&nbsp;';
                    }
                }
                else {
                    if (WUX.match(this.state, opt)) {
                        r += '&nbsp;<label style="display:inline;"><input type="radio" value="' + opt.id + '" name="' + this.id + '" id="' + this.id + '-' + i + '" checked> ' + opt.text + '</label>&nbsp;';
                    }
                    else {
                        r += '&nbsp;<label style="display:inline;"><input type="radio" value="' + opt.id + '" name="' + this.id + '" id="' + this.id + '-' + i + '"> ' + opt.text + '</label>&nbsp;';
                    }
                }
            }
            return r;
        };
        WRadio.prototype.componentDidMount = function () {
            var _this = this;
            if (!this.options || !this.options.length)
                return;
            var _loop_1 = function (i) {
                var $item = $('#' + this_1.id + '-' + i);
                if (!$item.length)
                    return "continue";
                if (this_1._tooltip)
                    $item.attr('title', this_1._tooltip);
                var opt = this_1.options[i];
                $item.click(function () {
                    _this.setState(opt);
                });
            };
            var this_1 = this;
            for (var i = 0; i < this.options.length; i++) {
                _loop_1(i);
            }
        };
        WRadio.prototype.componentDidUpdate = function (prevProps, prevState) {
            var idx = -1;
            for (var i = 0; i < this.options.length; i++) {
                if (WUX.match(this.state, this.options[i])) {
                    idx = i;
                    break;
                }
            }
            if (idx >= 0)
                $('#' + this.id + '-' + idx).prop('checked', true);
        };
        return WRadio;
    }(WUX.WComponent));
    WUX.WRadio = WRadio;
    var WTable = (function (_super) {
        __extends(WTable, _super);
        function WTable(id, header, keys, classStyle, style, attributes, props) {
            var _this = _super.call(this, id ? id : '*', 'WTable', props, classStyle, style, attributes) || this;
            _this.selectedRow = -1;
            _this.rootTag = 'table';
            _this.header = header;
            if (keys && keys.length) {
                _this.keys = keys;
            }
            else {
                _this.keys = [];
                if (_this.header)
                    for (var i = 0; i < _this.header.length; i++)
                        _this.keys.push(i);
            }
            _this.widths = [];
            _this.templates = [];
            _this.boldNonZero = false;
            _this.selClass = 'success';
            return _this;
        }
        WTable.prototype.onSelectionChanged = function (handler) {
            if (!this.handlers['_selectionchanged'])
                this.handlers['_selectionchanged'] = [];
            this.handlers['_selectionchanged'].push(handler);
        };
        WTable.prototype.onDoubleClick = function (handler) {
            if (!this.handlers['_doubleclick'])
                this.handlers['_doubleclick'] = [];
            this.handlers['_doubleclick'].push(handler);
        };
        WTable.prototype.onRowPrepared = function (handler) {
            if (!this.handlers['_rowprepared'])
                this.handlers['_rowprepared'] = [];
            this.handlers['_rowprepared'].push(handler);
        };
        WTable.prototype.onCellClick = function (handler) {
            if (!this.handlers['_cellclick'])
                this.handlers['_cellclick'] = [];
            this.handlers['_cellclick'].push(handler);
        };
        WTable.prototype.onCellHoverChanged = function (handler) {
            if (!this.handlers['_cellhover'])
                this.handlers['_cellhover'] = [];
            this.handlers['_cellhover'].push(handler);
        };
        WTable.prototype.clearSelection = function () {
            this.selectedRow = -1;
            if (!this.mounted)
                return this;
            this.root.find('tbody tr').removeClass('success');
            if (!this.handlers['_selectionchanged'])
                return this;
            for (var _i = 0, _a = this.handlers['_selectionchanged']; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler({ element: this.root, selectedRowsData: [] });
            }
            return this;
        };
        WTable.prototype.select = function (idxs) {
            this.selectedRow = idxs && idxs.length ? idxs[0] : -1;
            if (!this.mounted)
                return this;
            this.root.find('tbody tr').removeClass('success');
            for (var _i = 0, idxs_1 = idxs; _i < idxs_1.length; _i++) {
                var idx = idxs_1[_i];
                this.root.find('tbody tr:eq(' + idx + ')').addClass('success');
            }
            if (!this.handlers['_selectionchanged'])
                return this;
            for (var _a = 0, _b = this.handlers['_selectionchanged']; _a < _b.length; _a++) {
                var handler = _b[_a];
                handler({ element: this.root, selectedRowsData: [] });
            }
            return this;
        };
        WTable.prototype.selectAll = function (toggle) {
            if (!this.mounted)
                return this;
            this.root.find('tbody tr').addClass('success');
            if (!this.handlers['_selectionchanged'])
                return this;
            for (var _i = 0, _a = this.handlers['_selectionchanged']; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler({ element: this.root, selectedRowsData: [] });
            }
            return this;
        };
        WTable.prototype.getSelectedRows = function () {
            if (!this.mounted)
                return [];
            if (this.selectedRow < 0)
                return [];
            return [this.selectedRow];
        };
        WTable.prototype.getSelectedRowsData = function () {
            if (!this.mounted)
                return [];
            if (this.selectedRow < 0)
                return [];
            if (!this.state || !this.state.length)
                return [];
            if (this.state.length <= this.selectedRow)
                return [];
            return this.state[this.selectedRow];
        };
        WTable.prototype.getFilteredRowsData = function () {
            return this.state;
        };
        WTable.prototype.refresh = function () {
            return this;
        };
        WTable.prototype.getCellValue = function (r, c) {
            if (r < 0 || c < 0)
                return null;
            if (!this.state || this.state.length <= r)
                return null;
            if (!this.keys || this.keys.length <= c)
                return null;
            var key = this.keys[c];
            var row = this.state[r];
            return WUX.WUtil.getValue(row, key);
        };
        WTable.prototype.getColHeader = function (c) {
            if (c < 0)
                return '';
            if (!this.header || this.header.length <= c)
                return '';
            return this.header[c];
        };
        WTable.prototype.render = function () {
            if (!this.shouldBuildRoot())
                return undefined;
            var tableClass = 'table';
            if (this._classStyle)
                tableClass = this._classStyle.indexOf('table ') >= 0 ? this._classStyle : tableClass + ' ' + this._classStyle;
            var ts = this.style ? ' style="' + this.style + '"' : '';
            var r = '<div class="table-responsive"><table id="' + this.id + '" class="' + tableClass + '"' + ts + '>';
            if (this.header && this.header.length) {
                var ths = false;
                if (typeof this.headStyle == 'string') {
                    if (this.headStyle.indexOf('text-align') > 0)
                        ths = true;
                }
                else if (this.headStyle && this.headStyle.a) {
                    ths = true;
                }
                if (!this.hideHeader) {
                    if (ths) {
                        r += '<thead><tr>';
                    }
                    else {
                        r += '<thead><tr' + WUX.buildCss(this.headStyle) + '>';
                    }
                    var j = -1;
                    for (var _i = 0, _a = this.header; _i < _a.length; _i++) {
                        var h = _a[_i];
                        j++;
                        var s = void 0;
                        if (j == 0) {
                            s = this.col0Style ? this.col0Style : this.colStyle;
                        }
                        else if (j == this.header.length - 1) {
                            s = this.colLStyle ? this.colLStyle : this.colStyle;
                        }
                        else {
                            s = ths ? this.headStyle : this.colStyle;
                        }
                        var w = this.widths && this.widths.length > j ? this.widths[j] : 0;
                        if (w) {
                            if (this.widthsPerc) {
                                r += '<th' + WUX.buildCss(s, { w: w + '%' }) + '>' + h + '</th>';
                            }
                            else {
                                r += '<th' + WUX.buildCss(s, { w: w }) + '>' + h + '</th>';
                            }
                        }
                        else {
                            r += '<th' + WUX.buildCss(s) + '>' + h + '</th>';
                        }
                    }
                    r += '</tr></thead>';
                }
            }
            r += '<tbody></tbody>';
            r += '</table></div>';
            return r;
        };
        WTable.prototype.componentDidMount = function () {
            this.buildBody();
            var _self = this;
            this.root.on('click', 'tbody tr', function (e) {
                if (!_self.handlers['_selectionchanged']) {
                    if (!_self.selectionMode || _self.selectionMode == 'none')
                        return;
                }
                else {
                    if (!_self.selectionMode || _self.selectionMode == 'none')
                        return;
                }
                var $this = $(this);
                $this.addClass('success').siblings().removeClass('success');
                _self.selectedRow = $this.index();
                var rowData = _self.state && _self.state.length ? _self.state[_self.selectedRow] : undefined;
                if (_self.handlers['_selectionchanged']) {
                    for (var _i = 0, _a = _self.handlers['_selectionchanged']; _i < _a.length; _i++) {
                        var h = _a[_i];
                        h({ element: _self.root, selectedRowsData: [rowData] });
                    }
                }
            });
            this.root.on('click', 'tbody tr td', function (e) {
                if (!_self.handlers['_cellclick'])
                    return;
                var $this = $(this);
                var r = $this.parent().index();
                var c = $this.index();
                for (var _i = 0, _a = _self.handlers['_cellclick']; _i < _a.length; _i++) {
                    var h = _a[_i];
                    h({ element: _self.root, rowIndex: r, colIndex: c });
                }
            });
            this.root.on('mouseover', 'tbody tr td', function (e) {
                if (!_self.handlers['_cellhover'])
                    return;
                var $this = $(this);
                var r = $this.parent().index();
                var c = $this.index();
                for (var _i = 0, _a = _self.handlers['_cellhover']; _i < _a.length; _i++) {
                    var h = _a[_i];
                    h({ element: _self.root, rowIndex: r, colIndex: c });
                }
            });
            this.root.on('dblclick', 'tbody tr', function (e) {
                if (!_self.handlers['_doubleclick'])
                    return;
                for (var _i = 0, _a = _self.handlers['_doubleclick']; _i < _a.length; _i++) {
                    var h = _a[_i];
                    h({ element: _self.root });
                }
            });
        };
        WTable.prototype.componentDidUpdate = function (prevProps, prevState) {
            this.buildBody();
        };
        WTable.prototype.buildBody = function () {
            this.selectedRow = -1;
            var tbody = this.root.find('tbody');
            tbody.html('');
            if (!this.state || !this.state.length)
                return;
            if (!this.keys || !this.keys.length)
                return;
            var i = -1;
            for (var _i = 0, _a = this.state; _i < _a.length; _i++) {
                var row = _a[_i];
                i++;
                var $r = void 0;
                if (i == this.state.length - 1) {
                    if (this.footerStyle) {
                        $r = $(WUX.build('tr', '', this.footerStyle));
                    }
                    else {
                        $r = $(WUX.build('tr', '', this.rowStyle));
                    }
                }
                else {
                    $r = $(WUX.build('tr', '', this.rowStyle));
                }
                tbody.append($r);
                if (this.handlers['_rowprepared']) {
                    var e = { element: this.root, rowElement: $r, data: row, rowIndex: i };
                    for (var _b = 0, _c = this.handlers['_rowprepared']; _b < _c.length; _b++) {
                        var handler = _c[_b];
                        handler(e);
                    }
                }
                var j = -1;
                for (var _d = 0, _e = this.keys; _d < _e.length; _d++) {
                    var key = _e[_d];
                    var v = row[key];
                    var align = '';
                    if (v == null)
                        v = '';
                    j++;
                    var t = WUX.WUtil.getItem(this.types, j);
                    switch (t) {
                        case 'w':
                            align = 'text-center';
                            break;
                        case 'c':
                            v = WUX.formatCurr(v);
                            align = 'text-right';
                            break;
                        case 'c5':
                            v = WUX.formatCurr5(v);
                            align = 'text-right';
                            break;
                        case 'i':
                            v = WUX.formatNum(v);
                            align = 'text-right';
                            break;
                        case 'n':
                            v = WUX.formatNum2(v);
                            align = 'text-right';
                            break;
                        case 'd':
                            v = WUX.formatDate(v);
                            break;
                        case 't':
                            v = WUX.formatDateTime(v);
                            break;
                        case 'b':
                            v = v ? '&check;' : '';
                            break;
                        default:
                            if (v instanceof Date)
                                v = WUX.formatDate(v);
                            if (typeof v == 'boolean')
                                v = v ? '&check;' : '';
                            if (typeof v == 'number') {
                                v = WUX.formatNum2(v);
                                align = 'text-right';
                            }
                    }
                    var s = void 0;
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
                        if (s.indexOf('text-align') > 0)
                            align = '';
                    }
                    else if (s && s.a) {
                        align = '';
                    }
                    var w = this.widths && this.widths.length > j ? this.widths[j] : 0;
                    var f = this.templates && this.templates.length > j ? this.templates[j] : undefined;
                    if (f) {
                        var $td = $('<td' + WUX.buildCss(s, align, { w: w }) + '></td>');
                        f($td, { data: row, text: v });
                        $r.append($td);
                    }
                    else {
                        if (WUX.WUtil.hasComponents(v)) {
                            var ac = WUX.WUtil.toArrayComponent(v);
                            for (var _f = 0, ac_3 = ac; _f < ac_3.length; _f++) {
                                var c = ac_3[_f];
                                var $td = $('<td' + WUX.buildCss(s, align, { w: w }) + '></td>');
                                $r.append($td);
                                c.mount($td);
                            }
                        }
                        else {
                            if (this.boldNonZero && v != 0 && v != '0' && v != '') {
                                $r.append($('<td' + WUX.buildCss(s, align, { w: w }) + '><strong>' + v + '</strong></td>'));
                            }
                            else {
                                $r.append($('<td' + WUX.buildCss(s, align, { w: w }) + '>' + v + '</td>'));
                            }
                        }
                    }
                }
                if (this.header && this.header.length > this.keys.length) {
                    for (var i_1 = 0; i_1 < this.header.length - this.keys.length; i_1++) {
                        $r.append($('<td' + WUX.buildCss(this.colStyle) + '></td>'));
                    }
                }
            }
        };
        return WTable;
    }(WUX.WComponent));
    WUX.WTable = WTable;
    var WFormPanel = (function (_super) {
        __extends(WFormPanel, _super);
        function WFormPanel(id, title, action, props) {
            var _this = _super.call(this, id, 'WFormPanel', props) || this;
            _this.rootTag = 'form';
            if (action) {
                _this._attributes = 'role="form" name="' + _this.id + '" action="' + action + '"';
            }
            else {
                _this._attributes = 'role="form" name="' + _this.id + '" action="javascript:void(0);"';
            }
            _this.stateChangeOnBlur = false;
            _this.inputClass = WUX.CSS.FORM_CTRL;
            _this.title = title;
            _this.nextOnEnter = true;
            _this.autoValidate = false;
            _this.init();
            return _this;
        }
        WFormPanel.prototype.init = function () {
            this.rows = [];
            this.roww = [];
            this.hiddens = [];
            this.internals = {};
            this.components = [];
            this.captions = [];
            this.dpids = [];
            this.nextMap = {};
            this.mapTooltips = {};
            this.mapLabelLinks = {};
            this.minValues = {};
            this.maxValues = {};
            this.footer = [];
            this.currRow = null;
            this.addRow();
            return this;
        };
        WFormPanel.prototype.focus = function () {
            if (!this.mounted)
                return this;
            var f = this.first(true);
            if (f) {
                if (f.component) {
                    f.component.focus();
                }
                else if (f.element) {
                    f.element.focus();
                }
            }
            return this;
        };
        WFormPanel.prototype.first = function (enabled) {
            if (!this.rows)
                return null;
            for (var _i = 0, _a = this.rows; _i < _a.length; _i++) {
                var row = _a[_i];
                for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                    var f = row_1[_b];
                    if (enabled) {
                        if (f.enabled == null || f.enabled) {
                            if (f.readonly == null || !f.readonly)
                                return f;
                        }
                    }
                    else {
                        return f;
                    }
                }
            }
            return null;
        };
        WFormPanel.prototype.focusOn = function (fieldId) {
            if (!this.mounted)
                return this;
            var f = this.getField(fieldId);
            if (!f)
                return this;
            if (f.component) {
                f.component.focus();
            }
            else if (f.element) {
                f.element.focus();
            }
            return this;
        };
        WFormPanel.prototype.onEnterPressed = function (h) {
            if (!h)
                return;
            if (!this.handlers['_enter'])
                this.handlers['_enter'] = [];
            this.handlers['_enter'].push(h);
            this.nextOnEnter = false;
        };
        WFormPanel.prototype.onEnd = function (h) {
            if (!h)
                return;
            if (!this.handlers['_end'])
                this.handlers['_end'] = [];
            this.handlers['_end'].push(h);
        };
        WFormPanel.prototype.onChangeDate = function (h) {
            if (!h)
                return;
            if (!this.handlers['_changedate'])
                this.handlers['_changedate'] = [];
            this.handlers['_changedate'].push(h);
        };
        WFormPanel.prototype.addToFooter = function (c, sep) {
            if (!c && !this.footer)
                return this;
            if (sep != undefined)
                this.footerSep = sep;
            this.footer.push(c);
            return this;
        };
        WFormPanel.prototype.addRow = function (classStyle, style, id, attributes, type) {
            if (type === void 0) { type = 'row'; }
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
            this.currRow = new Array();
            this.rows.push(this.currRow);
            this.roww.push({
                classStyle: classStyle,
                style: style,
                id: id,
                attributes: WUX.attributes(attributes),
                type: type
            });
            return this;
        };
        WFormPanel.prototype.addTextField = function (fieldId, label, readonly) {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.Text, 'readonly': readonly });
            return this;
        };
        WFormPanel.prototype.addNoteField = function (fieldId, label, rows, readonly) {
            if (!rows)
                rows = 3;
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.Note, 'attributes': 'rows="' + rows + '"', 'readonly': readonly });
            return this;
        };
        WFormPanel.prototype.addCurrencyField = function (fieldId, label, readonly) {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.Text, 'readonly': readonly, valueType: 'c', style: { a: 'right' } });
            return this;
        };
        WFormPanel.prototype.addCurrency5Field = function (fieldId, label, readonly) {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.Text, 'readonly': readonly, valueType: 'c5', style: { a: 'right' } });
            return this;
        };
        WFormPanel.prototype.addIntegerField = function (fieldId, label, readonly) {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.Text, 'readonly': readonly, valueType: 'i' });
            return this;
        };
        WFormPanel.prototype.addDecimalField = function (fieldId, label, readonly) {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.Text, 'readonly': readonly, valueType: 'n' });
            return this;
        };
        WFormPanel.prototype.addDateField = function (fieldId, label, readonly, minDate, maxDate) {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.Date, 'readonly': readonly, valueType: 'd', minValue: minDate, maxValue: maxDate });
            return this;
        };
        WFormPanel.prototype.addOptionsField = function (fieldId, label, options, attributes, readonly) {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.Select, 'readonly': readonly, 'options': options, 'attributes': attributes });
            return this;
        };
        WFormPanel.prototype.addBooleanField = function (fieldId, label) {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.CheckBox });
            return this;
        };
        WFormPanel.prototype.addBlankField = function (label, classStyle, style, id, attributes, inner) {
            this.currRow.push({ 'id': id, 'label': label, 'type': WUX.WInputType.Blank, 'classStyle': classStyle, 'style': style, 'attributes': attributes, 'placeholder': inner });
            return this;
        };
        WFormPanel.prototype.addRadioField = function (fieldId, label, options) {
            var comp = new WRadio(this.subId(fieldId), options);
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.Radio, 'component': comp });
            return this;
        };
        WFormPanel.prototype.addPasswordField = function (fieldId, label, readonly) {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.Password, 'readonly': readonly });
            return this;
        };
        WFormPanel.prototype.addEmailField = function (fieldId, label, readonly) {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.Email, 'readonly': readonly });
            return this;
        };
        WFormPanel.prototype.addFtpField = function (fieldId, label, readonly) {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.Ftp, 'readonly': readonly });
            return this;
        };
        WFormPanel.prototype.addCronField = function (fieldId, label, readonly, value) {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.Cron, 'readonly': readonly, 'value': value });
            return this;
        };
        WFormPanel.prototype.addComponent = function (fieldId, label, component, readonly) {
            if (!component)
                return;
            if (fieldId) {
                component.id = this.subId(fieldId);
                this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WUX.WInputType.Component, 'component': component, 'readonly': readonly });
                if (component instanceof WUX.WInput) {
                    if (!component.classStyle)
                        component.classStyle = WUX.CSS.FORM_CTRL;
                }
            }
            else {
                component.id = '';
                this.currRow.push({ 'id': '', 'label': label, 'type': WUX.WInputType.Component, 'component': component, 'readonly': readonly });
            }
            this.components.push(component);
            return this;
        };
        WFormPanel.prototype.addCaption = function (label, icon, classStyle, style) {
            if (!label)
                return;
            var component = new WUX.WLabel('', label, icon, classStyle, style);
            this.currRow.push({ 'id': '', 'label': '', 'type': WUX.WInputType.Component, 'component': component, 'readonly': true });
            this.components.push(component);
            this.captions.push(component);
            return this;
        };
        WFormPanel.prototype.addInternalField = function (fieldId, value) {
            if (value === undefined)
                value = null;
            this.internals[fieldId] = value;
            return this;
        };
        WFormPanel.prototype.addHiddenField = function (fieldId, value) {
            this.hiddens.push({ 'id': this.subId(fieldId), 'type': WUX.WInputType.Hidden, 'value': value });
            return this;
        };
        WFormPanel.prototype.setTooltip = function (fieldId, text) {
            var f = this.getField(fieldId);
            if (!f)
                return this;
            if (!text) {
                delete this.mapTooltips[f.id];
            }
            else {
                this.mapTooltips[f.id] = text;
            }
            return this;
        };
        WFormPanel.prototype.setLabelLinks = function (fieldId, links) {
            var f = this.getField(fieldId);
            if (!f)
                return this;
            if (!links || !links.length) {
                delete this.mapLabelLinks[f.id];
            }
            else {
                this.mapLabelLinks[f.id] = links;
            }
            return this;
        };
        WFormPanel.prototype.setReadOnly = function (fieldId, readonly) {
            if (typeof fieldId == 'string') {
                var f = this.getField(fieldId);
                if (!f)
                    return this;
                f.readonly = readonly;
                if (this.mounted) {
                    if (f.component) {
                        f.component.enabled = !readonly;
                    }
                    else {
                        var $f = $('#' + f.id);
                        var t = WUX.getTagName($f);
                        if (t == 'select') {
                            if (readonly) {
                                $f.prop("disabled", true);
                            }
                            else {
                                $f.prop("disabled", false);
                            }
                        }
                        else {
                            $f.prop('readonly', readonly);
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < this.rows.length; i++) {
                    var row = this.rows[i];
                    for (var j = 0; j < row.length; j++) {
                        var f = row[j];
                        f.readonly = fieldId;
                        if (this.mounted) {
                            if (f.component) {
                                f.component.enabled = !fieldId;
                            }
                            else {
                                var $f = $('#' + f.id);
                                var t = WUX.getTagName($f);
                                if (t == 'select') {
                                    if (fieldId) {
                                        $f.prop('disabled', true);
                                    }
                                    else {
                                        $f.prop('disabled', false);
                                    }
                                }
                                else {
                                    $f.prop('readonly', fieldId);
                                }
                            }
                        }
                    }
                }
            }
            this.trigger('propschange');
            return this;
        };
        Object.defineProperty(WFormPanel.prototype, "enabled", {
            set: function (b) {
                this._enabled = b;
                for (var i = 0; i < this.rows.length; i++) {
                    var row = this.rows[i];
                    for (var j = 0; j < row.length; j++) {
                        var f = row[j];
                        f.enabled = b;
                        if (this.mounted) {
                            if (f.component) {
                                f.component.enabled = b;
                            }
                            else {
                                $('#' + f.id).prop("disabled", !b);
                            }
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        WFormPanel.prototype.setEnabled = function (fieldId, enabled) {
            if (typeof fieldId == 'string') {
                var f = this.getField(fieldId);
                if (!f)
                    return this;
                f.enabled = enabled;
                if (this.mounted) {
                    if (f.component) {
                        f.component.enabled = enabled;
                    }
                    else {
                        $('#' + f.id).prop("disabled", !enabled);
                    }
                }
            }
            else {
                this.enabled = fieldId;
            }
            this.trigger('propschange');
            return this;
        };
        WFormPanel.prototype.setVisible = function (fieldId, visible) {
            var f = this.getField(fieldId);
            if (!f)
                return this;
            f.visible = visible;
            if (this.mounted) {
                if (f.component) {
                    f.component.visible = visible;
                }
                else {
                    if (visible)
                        $('#' + f.id).show();
                    else
                        $('#' + f.id).hide();
                }
                if (f.label) {
                    if (visible)
                        $('label[for="' + f.id + '"]').show();
                    else
                        $('label[for="' + f.id + '"]').hide();
                }
            }
            this.trigger('propschange');
            return this;
        };
        WFormPanel.prototype.setLabelCss = function (fieldId, css) {
            var f = this.getField(fieldId);
            if (!f)
                return this;
            f.labelCss = css;
            if (this.mounted) {
                var $l = $('label[for="' + f.id + '"]');
                if ($l.length)
                    WUX.setCss($l, css);
            }
            return this;
        };
        WFormPanel.prototype.setLabelText = function (fieldId, t) {
            var f = this.getField(fieldId);
            if (!f)
                return this;
            f.label = t;
            if (this.mounted) {
                var $l = $('label[for="' + f.id + '"]');
                if ($l.length)
                    $l.html(t);
            }
            return this;
        };
        WFormPanel.prototype.setSpanField = function (fieldId, span) {
            var f = this.getField(fieldId);
            if (!f)
                return this;
            f.span = span;
            return this;
        };
        WFormPanel.prototype.getField = function (fid) {
            if (!fid)
                return;
            var sid = fid.indexOf(this.id + '-') == 0 ? fid : this.subId(fid);
            for (var i = 0; i < this.rows.length; i++) {
                var row = this.rows[i];
                for (var j = 0; j < row.length; j++) {
                    var f = row[j];
                    if (f.id == sid)
                        return f;
                }
            }
            return;
        };
        WFormPanel.prototype.onMount = function (fid, h) {
            var x = this.getField(fid);
            if (!x)
                return this;
            x.onmount = h;
            return this;
        };
        WFormPanel.prototype.onFocus = function (fid, h) {
            var x = this.getField(fid);
            if (!x)
                return this;
            x.onfocus = h;
            return this;
        };
        WFormPanel.prototype.onBlur = function (fid, h) {
            var x = this.getField(fid);
            if (!x)
                return this;
            x.onblur = h;
            return this;
        };
        WFormPanel.prototype.getStateOf = function (fid) {
            var f = this.getField(fid);
            if (!f)
                return null;
            if (!f.component)
                return null;
            return f.component.getState();
        };
        WFormPanel.prototype.getPropsOf = function (fid) {
            var f = this.getField(fid);
            if (!f)
                return null;
            if (!f.component)
                return null;
            return f.component.getProps();
        };
        WFormPanel.prototype.next = function (fid) {
            if (!fid)
                return;
            var sid = fid.indexOf(this.id + '-') == 0 ? fid : this.subId(fid);
            if (this.nextMap) {
                var nid = this.nextMap[this.ripId(sid)];
                if (nid) {
                    var r = this.getField(nid);
                    if (r)
                        return r;
                }
            }
            var x = false;
            for (var i = 0; i < this.rows.length; i++) {
                var row = this.rows[i];
                for (var j = 0; j < row.length; j++) {
                    var f = row[j];
                    if (x)
                        return f;
                    if (f.id == sid)
                        x = true;
                }
            }
            return;
        };
        WFormPanel.prototype.setMandatory = function () {
            var fids = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fids[_i] = arguments[_i];
            }
            if (!this.rows)
                return this;
            var sids = [];
            for (var _a = 0, fids_1 = fids; _a < fids_1.length; _a++) {
                var fid = fids_1[_a];
                var sid = fid.indexOf(this.id + '-') == 0 ? fid : this.subId(fid);
                sids.push(sid);
            }
            for (var i = 0; i < this.rows.length; i++) {
                var row = this.rows[i];
                for (var j = 0; j < row.length; j++) {
                    var f = row[j];
                    if (sids.indexOf(f.id) >= 0) {
                        f.required = true;
                    }
                    else {
                        f.required = false;
                    }
                }
            }
            return this;
        };
        WFormPanel.prototype.checkMandatory = function (labels, focus, atLeastOne) {
            var values = this.getState();
            if (!values)
                values = {};
            var r = '';
            var x = '';
            var a = false;
            for (var i = 0; i < this.rows.length; i++) {
                var row = this.rows[i];
                for (var j = 0; j < row.length; j++) {
                    var f = row[j];
                    var id = this.ripId(f.id);
                    var v = values[id];
                    if (f.required) {
                        if (v == null || v == '') {
                            if (labels) {
                                r += ',' + f.label;
                            }
                            else {
                                r += ',' + id;
                            }
                            if (!x)
                                x = id;
                        }
                        else {
                            a = true;
                        }
                    }
                }
            }
            if (atLeastOne && a)
                return '';
            if (x && focus)
                this.focusOn(x);
            if (r)
                return r.substring(1);
            return r;
        };
        WFormPanel.prototype.getState = function () {
            this.state = this.autoValidate ? this.validate() : this.getValues();
            return this.state;
        };
        WFormPanel.prototype.render = function () {
            return this.buildRoot(this.rootTag);
        };
        WFormPanel.prototype.componentDidMount = function () {
            var _this = this;
            if (!this.inputClass)
                this.inputClass = WUX.CSS.FORM_CTRL;
            this.minValues = {};
            this.maxValues = {};
            this.dpids = [];
            for (var i = 0; i < this.rows.length; i++) {
                var w = this.roww[i];
                var r = '<div';
                if (w) {
                    var c = WUX.cls(w.type, w.classStyle, w.style);
                    if (c)
                        r += ' class="' + c + '"';
                    var s = WUX.style(w.style);
                    if (s)
                        r += ' style="' + s + '"';
                    if (w.id)
                        r += ' id="' + w.id + '"';
                    if (w.attributes)
                        r += ' ' + w.attributes;
                }
                else {
                    r += ' class="row"';
                }
                r += '></div>';
                var $r = $(r);
                this.root.append($r);
                var row = this.rows[i];
                var cols = 0;
                for (var j = 0; j < row.length; j++) {
                    var f = row[j];
                    if (f.type === WUX.WInputType.Hidden)
                        continue;
                    cols += f.span && f.span > 0 ? f.span : 1;
                }
                for (var j = 0; j < row.length; j++) {
                    var f = row[j];
                    if (f.id) {
                        if (f.minValue)
                            this.minValues[f.id] = f.minValue;
                        if (f.maxValue)
                            this.maxValues[f.id] = f.maxValue;
                    }
                    if (f.type === WUX.WInputType.Hidden)
                        continue;
                    var cs = Math.floor(12 / cols);
                    if (cs < 1)
                        cs = 1;
                    if ((cs == 1 && cols < 11) && (j == 0 || j == cols - 1))
                        cs = 2;
                    if (f.span && f.span > 0)
                        cs = cs * f.span;
                    var $c = $('<div class="col-md-' + cs + '"></div>');
                    $r.append($c);
                    var $fg = $('<div class="form-group"></div>');
                    $c.append($fg);
                    if (f.label) {
                        var la = '';
                        var af = '';
                        if (f.labelCss) {
                            var lc = WUX.cls(f.labelCss);
                            var ls = WUX.style(f.labelCss);
                            if (lc)
                                la += ' class="' + lc + '"';
                            if (ls)
                                la += ' style="' + ls + '"';
                        }
                        else if (f.required) {
                            var lc = WUX.cls(WUX.CSS.FIELD_REQUIRED);
                            var ls = WUX.style(WUX.CSS.FIELD_REQUIRED);
                            if (lc)
                                la += ' class="' + lc + '"';
                            if (ls)
                                la += ' style="' + ls + '"';
                            af = ' *';
                        }
                        if (f.id && this.mapTooltips[f.id]) {
                            $fg.append($('<label for="' + f.id + '" title="' + this.mapTooltips[f.id] + '"' + la + '>' + f.label + af + '</label>'));
                        }
                        else if (f.id) {
                            $fg.append($('<label for="' + f.id + '" title="' + f.label + '"' + la + '>' + f.label + af + '</label>'));
                        }
                        else {
                            $fg.append($('<label title="' + f.label + '"' + la + '>' + f.label + af + '</label>'));
                        }
                        if (f.id && this.mapLabelLinks[f.id]) {
                            for (var _i = 0, _a = this.mapLabelLinks[f.id]; _i < _a.length; _i++) {
                                var link = _a[_i];
                                var $sl = $('<span style="padding-left:8px;"></span>');
                                $fg.append($sl);
                                link.mount($sl);
                            }
                        }
                    }
                    switch (f.type) {
                        case WUX.WInputType.Blank:
                            f.element = $(WUX.build('div', f.placeholder, f.style, f.attributes, f.id, f.classStyle));
                            break;
                        case WUX.WInputType.Text:
                            var ir = '<input type="text" name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '" ';
                            if (f.readonly)
                                ir += 'readonly ';
                            if (f.enabled == false)
                                ir += 'disabled ';
                            if (f.style)
                                ir += ' style="' + WUX.style(f.style) + '"';
                            ir += '/>';
                            f.element = $(ir);
                            break;
                        case WUX.WInputType.Note:
                            var nr = '<textarea name="' + f.id + '" id="' + f.id + '" class="form-control" ';
                            if (f.attributes)
                                nr += f.attributes + ' ';
                            if (f.readonly)
                                nr += 'readonly ';
                            if (f.enabled == false)
                                nr += 'disabled ';
                            if (f.style)
                                nr += ' style="' + WUX.style(f.style) + '"';
                            nr += '></textarea>';
                            f.element = $(nr);
                            break;
                        case WUX.WInputType.Date:
                            this.dpids.push(f.id);
                            var dr = '<div class="input-group" id="igd-' + f.id + '">';
                            dr += '<span class="input-group-addon">' + WUX.buildIcon(WUX.WIcon.CALENDAR) + '</span> ';
                            dr += '<input type="text" name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '" ';
                            if (f.readonly)
                                dr += 'readonly ';
                            if (f.enabled == false)
                                dr += 'disabled ';
                            dr += '/></div>';
                            f.element = $(dr);
                            break;
                        case WUX.WInputType.CheckBox:
                            f.element = $('<input type="checkbox" name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '" style="height:16px" />');
                            break;
                        case WUX.WInputType.Radio:
                            if (f.component)
                                f.component.mount($fg);
                            break;
                        case WUX.WInputType.Select:
                            var sr = '';
                            if (f.attributes) {
                                sr += '<select name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '" ' + f.attributes;
                                if (f.readonly || f.enabled == false)
                                    sr += ' disabled';
                                sr += '>';
                            }
                            else {
                                sr += '<select name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '"';
                                if (f.readonly || f.enabled == false)
                                    sr += 'disabled';
                                sr += '>';
                            }
                            if (f.options && f.options.length > 0) {
                                for (var k = 0; k < f.options.length; k++) {
                                    var opt = f.options[k];
                                    sr += typeof opt === 'string' ? '<option>' + opt + '</option>' : '<option value="' + opt.id + '">' + opt.text + '</option>';
                                }
                            }
                            sr += '</select>';
                            f.element = $(sr);
                            break;
                        case WUX.WInputType.Email:
                            var ie = '<input type="text" name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '" ';
                            if (f.readonly)
                                ie += 'readonly ';
                            if (f.enabled == false)
                                ie += 'disabled ';
                            if (f.style)
                                ie += ' style="' + WUX.style(f.style) + '"';
                            ie += '/>';
                            f.element = $(ie);
                            break;
                        case WUX.WInputType.Ftp:
                            var iftp = '<input type="text" name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '" ';
                            if (f.readonly)
                                iftp += 'readonly ';
                            if (f.enabled == false)
                                iftp += 'disabled ';
                            if (f.style)
                                iftp += ' style="' + WUX.style(f.style) + '"';
                            iftp += '/>';
                            f.element = $(iftp);
                            break;
                        case WUX.WInputType.Password:
                            var ip = '<input type="password" name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '" ';
                            if (f.readonly)
                                ip += 'readonly ';
                            if (f.enabled == false)
                                ip += 'disabled ';
                            if (f.style)
                                ip += ' style="' + WUX.style(f.style) + '"';
                            ip += '/>';
                            f.element = $(ip);
                            break;
                        case WUX.WInputType.Cron:
                            var initial = '';
                            if (f.value != null && f.value != '')
                                initial = 'initial: "' + f.value + '" ,';
                            var is = '<div id="cron_' + f.id + '" class="' + this.inputClass + '" ';
                            if (f.readonly)
                                is += 'readonly ';
                            if (f.enabled == false)
                                is += 'disabled ';
                            is += ' ></div>';
                            is += '<script type="text/javascript">$(document).ready(function() {';
                            is += '$("#cron_' + f.id + '").cron({' + initial + 'onChange: function() {$("#' + f.id + '").val($(this).cron("value"));},useGentleSelect: true});';
                            is += '});</script><input type="hidden" name="' + f.id + '" id="' + f.id + '" />';
                            f.element = $(is);
                            break;
                        case WUX.WInputType.Component:
                            if (f.component) {
                                if (f.enabled == false || f.readonly)
                                    f.component.enabled = false;
                                f.component.mount($fg);
                                if (f.onmount)
                                    f.onmount(f);
                                if (f.onfocus)
                                    f.component.on('focus', f.onfocus);
                                if (f.onblur)
                                    f.component.on('blur', f.onblur);
                            }
                            break;
                    }
                    if (f.element) {
                        $fg.append(f.element);
                        if (f.type == WUX.WInputType.Text) {
                            if (f.valueType == 'c' || f.valueType == 'c5') {
                                f.element.focus(function (e) {
                                    if (!this.value)
                                        return;
                                    var s = WUX.formatNum(this.value);
                                    if (s.indexOf(',00') >= 0 && s.indexOf(',00') == s.length - 3)
                                        s = s.substring(0, s.length - 3);
                                    if (s.indexOf(',0') >= 0 && s.indexOf(',0') == s.length - 2)
                                        s = s.substring(0, s.length - 3);
                                    this.value = s;
                                    $(this).select();
                                });
                                if (f.valueType == 'c') {
                                    f.element.blur(function (e) {
                                        if (!this.value)
                                            return;
                                        this.value = WUX.formatCurr(WUX.WUtil.toNumber(this.value));
                                    });
                                }
                                else {
                                    f.element.blur(function (e) {
                                        if (!this.value)
                                            return;
                                        this.value = WUX.formatCurr5(WUX.WUtil.toNumber(this.value));
                                    });
                                }
                            }
                            else if (f.valueType == 'n') {
                                f.element.focus(function (e) {
                                    if (!this.value)
                                        return;
                                    this.value = WUX.formatNum(this.value);
                                    $(this).select();
                                });
                                f.element.blur(function (e) {
                                    if (!this.value)
                                        return;
                                    this.value = WUX.formatNum(this.value);
                                });
                            }
                            else if (f.valueType == 'i') {
                                f.element.focus(function (e) {
                                    if (!this.value)
                                        return;
                                    this.value = WUX.WUtil.toInt(this.value);
                                    $(this).select();
                                });
                                f.element.blur(function (e) {
                                    if (!this.value)
                                        return;
                                    this.value = WUX.WUtil.toInt(this.value);
                                });
                            }
                            else {
                                f.element.focus(function (e) {
                                    $(this).select();
                                });
                            }
                        }
                        if (f.visible != null && !f.visible) {
                            f.element.hide();
                            if (f.label)
                                $('label[for="' + f.id + '"]').hide();
                        }
                        if (f.onmount)
                            f.onmount(f);
                        if (f.onfocus)
                            f.element.focus(f.onfocus);
                        if (f.onblur)
                            f.element.focus(f.onblur);
                    }
                }
            }
            for (var _b = 0, _c = this.hiddens; _b < _c.length; _b++) {
                var f = _c[_b];
                if (f.value == null)
                    f.value = '';
                this.root.append('<input type="hidden" name="' + f.id + '" id="' + f.id + '" value="' + f.value + '">');
            }
            if (this.footer && this.footer.length > 0) {
                var fs = WUX.style(this.footerStyle);
                if (!this.footerClass)
                    this.footerClass = 'col-md-12';
                fs = fs ? ' style="' + fs + '"' : ' style="text-align:right;"';
                if (this.footerSep) {
                    if (typeof this.footerSep == 'string') {
                        var c0 = this.footerSep.charAt(0);
                        if (c0 == '<') {
                            this.root.append(this.footerSep);
                        }
                        else if (WUX.WUtil.isNumeric(c0)) {
                            this.root.append('<div style="height:' + this.footerSep + 'px;"></div>');
                        }
                    }
                    else {
                        this.root.append('<div style="height:' + this.footerSep + 'px;"></div>');
                    }
                }
                var $fr = $('<div class="row"></div>');
                this.root.append($fr);
                var $fc = $('<div class="' + this.footerClass + '"' + fs + '></div>');
                $fr.append($fc);
                for (var _d = 0, _e = this.footer; _d < _e.length; _d++) {
                    var fco = _e[_d];
                    if (typeof fco == 'string' && fco.length > 0) {
                        $fc.append($(fco));
                    }
                    else if (fco instanceof WUX.WComponent) {
                        fco.mount($fc);
                    }
                    else {
                        $fc.append(fco);
                    }
                }
            }
            var _loop_2 = function (fid) {
                var minDate = WUX.WUtil.getDate(this_2.minValues, fid);
                $('#' + fid).datepicker({
                    language: 'it',
                    todayBtn: 'linked',
                    keyboardNavigation: false,
                    forceParse: false,
                    calendarWeeks: true,
                    autoclose: true,
                    minDate: minDate
                }).on('changeDate', function (e) {
                    if (_this.handlers['_changedate']) {
                        for (var _i = 0, _a = _this.handlers['_changedate']; _i < _a.length; _i++) {
                            var h = _a[_i];
                            h(e);
                        }
                    }
                    var md = WUX.WUtil.getDate(_this.minValues, fid);
                    var xd = WUX.WUtil.getDate(_this.maxValues, fid);
                    if (!md && !xd)
                        return;
                    var dv = WUX.WUtil.getDate(e, 'date');
                    if (!dv)
                        return;
                    var iv = WUX.WUtil.toInt(dv);
                    if (iv < 19000101)
                        return;
                    var mv = WUX.WUtil.toInt(md);
                    if (mv >= 19000101 && iv < mv) {
                        WUX.showWarning(WUX.RES.ERR_DATE);
                        $(e.target).datepicker('setDate', md);
                    }
                    var xv = WUX.WUtil.toInt(xd);
                    if (xv >= 19000101 && iv > xv) {
                        WUX.showWarning(WUX.RES.ERR_DATE);
                        $(e.target).datepicker('setDate', xd);
                    }
                });
            };
            var this_2 = this;
            for (var _f = 0, _g = this.dpids; _f < _g.length; _f++) {
                var fid = _g[_f];
                _loop_2(fid);
            }
            if (typeof this.state == 'object')
                this.updateView();
            this.root.find('input').keypress(function (e) {
                if (e.which == 13) {
                    var tid = $(e.target).attr('id');
                    var f = _this.next(tid);
                    while (f && !_this.isFocusable(f)) {
                        f = _this.next(f.id);
                    }
                    if (f && _this.nextOnEnter) {
                        if (f.component) {
                            f.component.focus();
                        }
                        else if (f.element) {
                            if (f.element.prop("tagName") == 'DIV') {
                                f.element.find('input').focus();
                            }
                            else {
                                f.element.focus();
                            }
                        }
                        if (!_this.stateChangeOnBlur) {
                            _this.lastChanged = _this.ripId(tid);
                            _this.trigger('statechange');
                        }
                    }
                    else {
                        _this.lastChanged = _this.ripId(tid);
                        _this.trigger('statechange');
                    }
                    _this.trigger('_enter', _this.ripId(tid));
                    if (!f) {
                        _this.trigger('_end', _this.ripId(tid));
                    }
                }
            });
            if (this.stateChangeOnBlur) {
                this.root.find('input').blur(function (e) {
                    _this.lastChanged = _this.ripId($(e.target).attr('id'));
                    _this.trigger('statechange');
                });
            }
            this.root.on('change', 'select', function (e) {
                var ts = new Date().getTime();
                if (_this.lastTs && ts - _this.lastTs < 200)
                    return;
                _this.lastTs = ts;
                _this.lastChanged = _this.ripId($(e.target).attr('id'));
                _this.trigger('statechange');
            });
        };
        WFormPanel.prototype.isFocusable = function (f) {
            if (!f)
                return false;
            if (f.readonly)
                return false;
            if (f.enabled != null && !f.enabled)
                return false;
            return true;
        };
        WFormPanel.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (!this.mounted)
                return;
            if (!nextState || $.isEmptyObject(nextState)) {
                this.clear();
            }
            else {
                this.updateView();
            }
        };
        WFormPanel.prototype.isBlank = function (fid) {
            if (fid) {
                var v = this.getValue(fid);
                if (v === 0)
                    return false;
                if (!v)
                    return true;
                var s = '' + v;
                if (!s.trim())
                    return true;
                return false;
            }
            else {
                for (var i = 0; i < this.rows.length; i++) {
                    var row = this.rows[i];
                    for (var j = 0; j < row.length; j++) {
                        var f = row[j];
                        var v = this.getValue(f);
                        if (v == 0)
                            return false;
                        if (v)
                            return false;
                        var s = '' + v;
                        if (s.trim())
                            return false;
                    }
                }
                return true;
            }
        };
        WFormPanel.prototype.isZero = function (fid) {
            var v = this.getValue(fid);
            if (!v)
                return true;
            if (v == '0')
                return true;
            var s = '' + v;
            if (!s.trim())
                return true;
            return false;
        };
        WFormPanel.prototype.match = function (fid, val) {
            var v = this.getValue(fid);
            var s1 = WUX.WUtil.toString(v);
            var s2 = WUX.WUtil.toString(val);
            return s1 == s2;
        };
        WFormPanel.prototype.transferTo = function (dest, force, callback) {
            var res;
            if (dest instanceof WUX.WFormPanel) {
                dest.clear();
                res = _super.prototype.transferTo.call(this, dest, force);
                for (var i = 0; i < this.rows.length; i++) {
                    var row = this.rows[i];
                    for (var j = 0; j < row.length; j++) {
                        var f = row[j];
                        if (!f.component)
                            continue;
                        var d = dest.getField(this.ripId(f.id));
                        if (!d || !d.component)
                            continue;
                        res = res && f.component.transferTo(d.component);
                    }
                }
                if (callback)
                    callback();
            }
            else {
                res = _super.prototype.transferTo.call(this, dest, force, callback);
            }
            return res;
        };
        WFormPanel.prototype.clear = function () {
            if (this.debug)
                console.log('WUX.WFormPanel.clear');
            for (var i = 0; i < this.components.length; i++) {
                if (this.components[i].id)
                    this.components[i].setState(null);
            }
            for (var fid in this.internals) {
                if (!this.internals.hasOwnProperty(fid))
                    continue;
                this.internals[fid] = null;
            }
            if (!this.root)
                return this;
            var form = this.root;
            var f = form[0];
            if (!f || !f.elements)
                return this;
            for (var i_2 = 0; i_2 < f.elements.length; i_2++) {
                var e = f.elements[i_2];
                switch (e.type) {
                    case 'checkbox':
                    case 'radio':
                        e.checked = false;
                        break;
                    case 'select-one':
                    case 'select-multiple':
                        e.selectedIndex = -1;
                        break;
                    default:
                        e.value = '';
                }
            }
            return this;
        };
        WFormPanel.prototype.select = function (fieldId, i) {
            if (!fieldId)
                return this;
            var f = this.getField(fieldId);
            if (!f || !f.component)
                return this;
            var s = f.component['select'];
            if (typeof s === 'function') {
                s.bind(f.component)(i);
                return this;
            }
            console.error('WFormPanel.select(' + fieldId + ',' + i + ') not applicable.');
            return this;
        };
        WFormPanel.prototype.setValue = function (fid, v, updState) {
            if (updState === void 0) { updState = true; }
            if (this.debug)
                console.log('WUX.WFormPanel.setValue(' + fid + ',' + v + ',' + updState + ')');
            if (!fid)
                return this;
            var sid = this.subId(fid);
            if (updState) {
                if (!this.state)
                    this.state = {};
                this.state[fid] = v;
            }
            if (this.internals[fid] !== undefined) {
                if (v === undefined)
                    v = null;
                this.internals[fid] = v;
                return this;
            }
            for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
                var c = _a[_i];
                if (c.id == sid) {
                    c.setState(v);
                    return this;
                }
            }
            if (!this.root || !this.root.length)
                return this;
            if (typeof v == 'number')
                v = WUX.formatNum(v);
            if (this.dpids && this.dpids.indexOf(sid) >= 0) {
                $('#' + sid).datepicker('setDate', WUX.WUtil.toDate(v));
                return;
            }
            var $c = this.root.find('[name=' + sid + ']');
            if (!$c.length)
                $c = $('#' + sid);
            if (!$c.length)
                return this;
            if (v == null)
                v = '';
            switch ($c.attr('type')) {
                case 'checkbox':
                case 'radio':
                    $c.prop('checked', v);
                    break;
                default:
                    if (v instanceof Date) {
                        $c.val(WUX.formatDate(v));
                    }
                    else if (Array.isArray(v)) {
                        $c.val(v);
                    }
                    else {
                        $c.val(WUX.den(v.toString()));
                    }
            }
            return this;
        };
        WFormPanel.prototype.getValue = function (fid) {
            if (!fid)
                return;
            var sid;
            var iid;
            if (typeof fid == 'string') {
                sid = this.subId(fid);
                iid = fid;
            }
            else {
                sid = fid.id;
                iid = fid.id;
            }
            for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
                var c = _a[_i];
                if (c.id == sid)
                    return c.getState();
            }
            if (this.internals[iid] !== undefined) {
                return this.internals[iid];
            }
            if (!this.root || !this.root.length)
                return;
            var $c = this.root.find('[name=' + sid + ']');
            if (!$c.length)
                $c = $('#' + sid);
            if (!$c.length)
                return;
            var e = $c.get(0);
            if (e) {
                switch (e.type) {
                    case 'checkbox': return e.checked;
                    case 'select-multiple':
                        var a = [];
                        for (var j = 0; j < e.length; j++) {
                            a.push(e.options[j].value);
                        }
                        return a;
                }
            }
            return $c.val();
        };
        WFormPanel.prototype.getValues = function (formatted) {
            if (!this.root || !this.root.length)
                return {};
            var r = {};
            for (var fid in this.internals) {
                if (!this.internals.hasOwnProperty(fid))
                    continue;
                var v = this.internals[fid];
                if (v != null)
                    r[fid] = v;
            }
            var form = this.root;
            var f = form[0];
            if (!f || !f.elements)
                return r;
            for (var i = 0; i < f.elements.length; i++) {
                var e = f.elements[i];
                if (!e.name || !e.value)
                    continue;
                var k = e.name;
                switch (e.type) {
                    case 'checkbox':
                        r[this.ripId(k)] = e.checked;
                        break;
                    case 'radio':
                        if (e.checked)
                            r[this.ripId(k)] = e.value;
                        break;
                    case 'select-one':
                        r[this.ripId(k)] = e.options[e.selectedIndex].value;
                        break;
                    case 'select-multiple':
                        var a = [];
                        for (var j = 0; j < e.length; j++) {
                            if (e.options[j].selected)
                                a.push(e.options[j].value);
                        }
                        r[this.ripId(k)] = a;
                        break;
                    case 'text':
                    case 'textarea':
                        r[this.ripId(k)] = WUX.norm(e.value);
                        break;
                    default:
                        r[this.ripId(k)] = e.value;
                }
            }
            for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
                var c = _a[_i];
                if (c.id) {
                    var cv = null;
                    if (formatted) {
                        cv = WUX.format(c);
                    }
                    else {
                        cv = c.getState();
                    }
                    if (cv == null)
                        continue;
                    r[this.ripId(c.id)] = cv;
                }
            }
            return r;
        };
        WFormPanel.prototype.updateView = function () {
            if (this.debug)
                console.log('WUX.WFormPanel.updateView()');
            if (!this.state) {
                this.clear();
                return;
            }
            for (var id in this.state) {
                this.setValue(id, this.state[id], false);
            }
        };
        WFormPanel.prototype.validate = function () {
            var values = this.getValues();
            for (var i = 0; i < this.rows.length; i++) {
                var row = this.rows[i];
                for (var j = 0; j < row.length; j++) {
                    var f = row[j];
                    var k = f.id;
                    var id = this.ripId(k);
                    if (f.required && values[id] == null) {
                        throw new Error('Campo ' + f.label + ': valore obbligatorio');
                    }
                    if (f.size && values[id] != null && values[id].length > f.size) {
                        throw new Error('Campo ' + f.label + ': dimensione massima superata (massimo " + f.size + " caratteri)');
                    }
                    if (f.type && values[id] != null) {
                        var msg = null;
                        var regExp = null;
                        if (f.type == WUX.WInputType.Date) {
                            values[id] = WUX.WUtil.toDate(values[id]);
                        }
                        switch (f.type) {
                            case WUX.WInputType.Number:
                                regExp = new RegExp('^\\d+\\.\\d{1,2}$|^\\d*$');
                                if (!regExp.test(values[id]))
                                    msg = "Campo " + f.label + ": valore non idoneo (" + values[id] + " non risulta numerico)";
                                break;
                            case WUX.WInputType.Integer:
                                regExp = new RegExp('^\\d*$');
                                if (!regExp.test(values[id]))
                                    msg = "Campo " + f.label + ": valore non idoneo (" + values[id] + " non risulta intero)";
                                break;
                            case WUX.WInputType.Email:
                                regExp = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
                                if (!regExp.test(values[id]))
                                    msg = "Campo " + f.label + ": valore non idoneo (" + values[id] + " non risulta email)";
                                break;
                            case WUX.WInputType.Ftp:
                                regExp = new RegExp(/(((ftp:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/);
                                if (!regExp.test(values[id]))
                                    msg = "Campo " + f.label + ": valore non idoneo (" + values[id] + " non risulta URL FTP)";
                                break;
                            default:
                                break;
                        }
                        if (msg != null)
                            throw new Error(msg);
                    }
                }
            }
            return values;
        };
        return WFormPanel;
    }(WUX.WComponent));
    WUX.WFormPanel = WFormPanel;
    var WWindow = (function (_super) {
        __extends(WWindow, _super);
        function WWindow(id, name, position, attributes, props) {
            if (name === void 0) { name = 'WWindow'; }
            var _this = _super.call(this, id ? id : '*', name, props, '', '', attributes) || this;
            _this.position = position;
            if (!_this.position)
                _this.position = 'bottom';
            _this.headerStyle = WWindow.DEF_HEADER_STYLE;
            if (_this.id && _this.id != '*') {
                if ($('#' + _this.id).length)
                    $('#' + _this.id).remove();
            }
            WuxDOM.onRender(function (e) {
                if (_this.mounted)
                    return;
                _this.mount(e.element);
            });
            return _this;
        }
        WWindow.prototype.onShow = function (handler) {
            if (!this.handlers['_onshow'])
                this.handlers['_onshow'] = [];
            this.handlers['_onshow'].push(handler);
        };
        WWindow.prototype.onHide = function (handler) {
            if (!this.handlers['_onhide'])
                this.handlers['_onhide'] = [];
            this.handlers['_onhide'].push(handler);
        };
        WWindow.prototype.onClose = function (handler) {
            if (!this.handlers['_onclose'])
                this.handlers['_onclose'] = [];
            this.handlers['_onclose'].push(handler);
        };
        Object.defineProperty(WWindow.prototype, "header", {
            get: function () {
                var _this = this;
                if (this.cntHeader)
                    return this.cntHeader;
                this.cntHeader = new WContainer('', 'modal-header', this.headerStyle);
                this.btnCloseHeader = new WButton(this.subId('bhc'), '<span aria-hidden="true" tabIndex="-1">&times;</span><span class="sr-only">Close</span>', undefined, 'close', { op: 0.6 });
                this.btnCloseHeader.on('click', function (e) {
                    _this.close();
                });
                this.cntHeader.add(this.btnCloseHeader);
                return this.cntHeader;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WWindow.prototype, "body", {
            get: function () {
                if (this.cntBody)
                    return this.cntBody;
                this.cntBody = new WContainer('', WUX.cls(this._classStyle));
                return this.cntBody;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WWindow.prototype, "container", {
            get: function () {
                if (this.cntRoot)
                    return this.cntRoot;
                var crs = '';
                var cra = {};
                if (this.width)
                    cra.w = this.width;
                if (this.height)
                    cra.h = this.height;
                if (this.background)
                    cra.bg = this.background;
                if (this.color)
                    cra.c = this.color;
                if (this.position == 'top') {
                    if (this.gap) {
                        cra.ml = WUX.WUtil.getNumber(WUX.global.window_top, 'ml') + this.gap;
                        crs = WUX.css(WUX.global.window_top, { d: 'none', b: 'rgba(0,0,0,0)', bs: '0 1px 3px rgba(0, 0, 0, 0.6)', t: this.gap }, this._style, cra);
                    }
                    else {
                        crs = WUX.css(WUX.global.window_top, { d: 'none', b: 'rgba(0,0,0,0)', bs: '0 1px 3px rgba(0, 0, 0, 0.6)' }, this._style, cra);
                    }
                }
                else {
                    if (this.gap) {
                        cra.ml = WUX.WUtil.getNumber(WUX.global.window_bottom, 'ml') + this.gap;
                        crs = WUX.css(WUX.global.window_bottom, { d: 'none', b: 'rgba(0,0,0,0)', bs: '0 1px 3px rgba(0, 0, 0, 0.6)', bt: this.gap }, this._style, cra);
                    }
                    else {
                        crs = WUX.css(WUX.global.window_bottom, { d: 'none', b: 'rgba(0,0,0,0)', bs: '0 1px 3px rgba(0, 0, 0, 0.6)' }, this._style, cra);
                    }
                }
                this.cntRoot = new WContainer(this.id, this._classStyle, crs, this._attributes);
                return this.cntRoot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WWindow.prototype, "title", {
            get: function () {
                return this._title;
            },
            set: function (s) {
                if (this._title && this.cntHeader) {
                    this._title = s;
                    this.cntHeader.getRoot().children(this.tagTitle + ':first').text(s);
                }
                else {
                    this._title = s;
                    this.header.add(this.buildTitle(s));
                }
            },
            enumerable: true,
            configurable: true
        });
        WWindow.prototype.show = function (parent) {
            if (!this.beforeShow())
                return;
            this.parent = parent;
            if (!this.mounted)
                WuxDOM.mount(this);
            if (this.root && this.root.length) {
                this.isShown = true;
                this.isClosed = false;
                this.root.show();
            }
            if (!this.handlers['_onshow'])
                return;
            for (var _i = 0, _a = this.handlers['_onshow']; _i < _a.length; _i++) {
                var h = _a[_i];
                h(this.createEvent('_onshow'));
            }
        };
        WWindow.prototype.hide = function () {
            this.isShown = false;
            if (this.root && this.root.length)
                this.root.hide();
            if (!this.handlers['_onhide'])
                return;
            for (var _i = 0, _a = this.handlers['_onhide']; _i < _a.length; _i++) {
                var h = _a[_i];
                h(this.createEvent('_onhide'));
            }
        };
        WWindow.prototype.close = function () {
            this.isClosed = true;
            if (this.handlers['_onclose']) {
                for (var _i = 0, _a = this.handlers['_onclose']; _i < _a.length; _i++) {
                    var h = _a[_i];
                    h(this.createEvent('_onclose'));
                }
            }
            this.hide();
        };
        WWindow.prototype.scroll = function (c, hmin, over) {
            if (hmin === void 0) { hmin = 0; }
            if (over === void 0) { over = 4; }
            if (!c || !this.root)
                return 0;
            var $c = c instanceof WUX.WComponent ? c.getRoot() : c;
            if (this.position == 'top') {
                var st = $(document).scrollTop();
                var et = $c.offset().top;
                var rt = et - st - 2;
                var oh = this.root.height();
                if (hmin && oh < hmin)
                    oh = hmin;
                if (rt < oh) {
                    var ds = rt - oh;
                    if (st < ds) {
                        $(document).scrollTop(0);
                    }
                    else {
                        $(document).scrollTop(st - ds);
                    }
                    return ds;
                }
            }
            else {
                var st = $(document).scrollTop();
                var et = $c.offset().top;
                if (!et) {
                    var ep = $c.position();
                    if (ep)
                        et = ep.top;
                }
                var eh = $c.height();
                if (!eh)
                    eh = 18;
                var eb = et + eh;
                var rb = eb - st + 2;
                var wh = $(window).height();
                var oh = this.root.height();
                if (hmin && oh < hmin)
                    oh = hmin;
                var ot = wh - oh;
                if (rb > ot) {
                    var ds = rb - ot + over;
                    $(document).scrollTop(st + ds);
                    return ds;
                }
            }
            return 0;
        };
        WWindow.prototype.scrollY = function (y, hmin, over) {
            if (hmin === void 0) { hmin = 0; }
            if (over === void 0) { over = 4; }
            if (this.position == 'top') {
                var st = $(document).scrollTop();
                var rt = y - 2;
                var oh = this.root.height();
                if (hmin && oh < hmin)
                    oh = hmin;
                if (rt < oh) {
                    var ds = rt - oh;
                    if (st < ds) {
                        $(document).scrollTop(0);
                    }
                    else {
                        $(document).scrollTop(st - ds);
                    }
                    return ds;
                }
            }
            else {
                var st = $(document).scrollTop();
                var rb = y + (over / 2) + 2;
                var wh = $(window).height();
                var oh = this.root.height();
                if (hmin && oh < hmin)
                    oh = hmin;
                var ot = wh - oh;
                if (rb > ot) {
                    var ds = rb - ot + over;
                    $(document).scrollTop(st + ds);
                    return ds;
                }
            }
            return 0;
        };
        WWindow.prototype.beforeShow = function () {
            return true;
        };
        WWindow.prototype.onShown = function () {
        };
        WWindow.prototype.onHidden = function () {
        };
        WWindow.prototype.render = function () {
            this.isShown = false;
            this.isClosed = false;
            if (this.cntHeader)
                this.container.addContainer(this.cntHeader);
            if (this.cntBody)
                this.container.addContainer(this.cntBody);
            return this.cntRoot;
        };
        WWindow.prototype.componentWillUnmount = function () {
            this.isShown = false;
            if (this.btnCloseHeader)
                this.btnCloseHeader.unmount();
            if (this.cntBody)
                this.cntBody.unmount();
            if (this.cntHeader)
                this.cntHeader.unmount();
            if (this.cntRoot)
                this.cntRoot.unmount();
        };
        WWindow.prototype.buildTitle = function (title) {
            if (title == null)
                return '';
            if (!this.tagTitle)
                this.tagTitle = 'h3';
            if (this.titleStyle) {
                var ts = WUX.style(this.titleStyle);
                if (ts)
                    return '<' + this.tagTitle + ' style="' + ts + '">' + WUX.WUtil.toText(title) + '</' + this.tagTitle + '>';
            }
            return '<' + this.tagTitle + '>' + WUX.WUtil.toText(title) + '</' + this.tagTitle + '>';
        };
        WWindow.DEF_HEADER_STYLE = { p: 5, a: 'center' };
        return WWindow;
    }(WUX.WComponent));
    WUX.WWindow = WWindow;
})(WUX || (WUX = {}));
//# sourceMappingURL=wux.comp.js.map