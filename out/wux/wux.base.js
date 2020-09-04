var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
if (typeof jQuery === 'undefined')
    throw new Error('WUX requires jQuery');
+function ($) {
    $.fn.wuxComponent = function (c) {
        var wc = this.data('wuxComponent');
        if (wc)
            return wc;
        if (c instanceof WUX.WComponent) {
            this.data('wuxComponent', c);
            return c;
        }
        if (c == null)
            c = true;
        if (!c)
            return undefined;
        wc = new WUX.WComponent(this);
        this.data('wuxComponent', wc);
        return wc;
    };
}(jQuery);
var WuxDOM = (function () {
    function WuxDOM() {
    }
    WuxDOM.onRender = function (handler) {
        WuxDOM.onRenderHandlers.push(handler);
    };
    WuxDOM.onUnmount = function (handler) {
        WuxDOM.onUnmountHandlers.push(handler);
    };
    WuxDOM.render = function (component, node, before, after) {
        if (WUX.debug)
            console.log('WuxDOM.render ' + WUX.str(component) + ' on ' + WUX.str(node) + '...');
        $(document).ready(function () {
            WUX.global.init(function () {
                if (!node)
                    node = WuxDOM.lastCtx ? WuxDOM.lastCtx : $('#view-root');
                if (before)
                    before(node);
                var context = WuxDOM.mount(component, node);
                WuxDOM.lastCtx = context;
                if (after)
                    after(node);
                if (WuxDOM.onRenderHandlers.length > 0) {
                    var c = component instanceof WUX.WComponent ? component : null;
                    var e = { component: c, element: context, target: context.get(0), type: 'render' };
                    for (var _i = 0, _a = WuxDOM.onRenderHandlers; _i < _a.length; _i++) {
                        var handler = _a[_i];
                        handler(e);
                    }
                    WuxDOM.onRenderHandlers = [];
                }
            });
        });
    };
    WuxDOM.mount = function (e, node) {
        if (!node)
            node = WuxDOM.lastCtx ? WuxDOM.lastCtx : $('#view-root');
        if (WUX.debug)
            console.log('WuxDOM.mount ' + WUX.str(e) + ' on ' + WUX.str(node) + '...');
        if (e == null) {
            console.error('WuxDOM.mount ' + WUX.str(e) + ' on ' + WUX.str(node) + ' -> invalid component');
            return;
        }
        var ctx = typeof node == 'string' ? (node.indexOf('#') < 0) ? $('#' + node) : $(node) : node;
        if (!ctx.length) {
            console.error('WuxDOM.mount ' + WUX.str(e) + ' on ' + WUX.str(node) + ' -> context unavailable');
            return;
        }
        WuxDOM.lastCtx = ctx;
        if (e instanceof WUX.WComponent) {
            e.mount(ctx);
            ctx.wuxComponent(e);
        }
        else {
            ctx.append(e);
        }
        if (WUX.debug)
            console.log('WuxDOM.mount ' + WUX.str(e) + ' on ' + WUX.str(node) + ' completed.');
        return ctx;
    };
    ;
    WuxDOM.unmount = function (node) {
        if (!node)
            node = WuxDOM.lastCtx ? WuxDOM.lastCtx : $('#view-root');
        if (WUX.debug)
            console.log('WuxDOM.unmount ' + WUX.str(node) + '...');
        var ctx = typeof node == 'string' ? (node.indexOf('#') < 0) ? $('#' + node) : $(node) : node;
        if (!ctx.length) {
            console.error('WuxDOM.unmount ' + WUX.str(node) + ' -> node unavailable');
            return;
        }
        var wcomp = ctx.wuxComponent(false);
        if (wcomp)
            wcomp.unmount();
        ctx.html('');
        if (WUX.debug)
            console.log('WuxDOM.unmount ' + WUX.str(node) + ' completed.');
        if (WuxDOM.onUnmountHandlers.length > 0) {
            var e = { component: wcomp, element: ctx, target: ctx.get(0), type: 'unmount' };
            for (var _i = 0, _a = WuxDOM.onUnmountHandlers; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(e);
            }
            WuxDOM.onUnmountHandlers = [];
        }
        return ctx;
    };
    WuxDOM.replace = function (o, e) {
        var node;
        if (!e) {
            e = o;
            o = undefined;
        }
        if (!o) {
            node = WuxDOM.unmount();
        }
        else if (typeof o == 'string') {
            var wcomp = WUX.getComponent(o);
            if (!wcomp) {
                node = wcomp.getContext();
                wcomp.unmount();
            }
        }
        else if (o instanceof WUX.WComponent) {
            node = o.getContext();
            o.unmount();
        }
        else {
            node = o.parent();
            if (node)
                node.html('');
        }
        if (!node)
            node = $('#view-root');
        if (!node.length) {
            console.error('WuxDOM.replace ' + WUX.str(node) + ' -> node unavailable');
            return;
        }
        return WuxDOM.mount(e, node);
    };
    WuxDOM.onRenderHandlers = [];
    WuxDOM.onUnmountHandlers = [];
    return WuxDOM;
}());
var WUX;
(function (WUX) {
    WUX.debug = false;
    WUX.registry = [];
    WUX.version = '1.0.0';
    var WComponent = (function () {
        function WComponent(id, name, props, classStyle, style, attributes) {
            this.mounted = false;
            this.debug = WUX.debug;
            this.forceOnChange = false;
            this.rootTag = 'div';
            this.subSeq = 0;
            this.dontTrigger = false;
            this._visible = true;
            this._enabled = true;
            this.handlers = {};
            this.cuid = Math.floor(Math.random() * 1000000000);
            if (id instanceof jQuery) {
                this.root = id;
                if (this.root && this.root.length)
                    this.mounted = true;
                if (this.debug)
                    console.log('[' + str(this) + '] new wrapper root=' + str(this.root));
            }
            else {
                if (typeof id == 'string')
                    this.id = id == '*' ? 'w' + this.cuid : id;
                this.name = name ? name : 'WComponent';
                this._classStyle = classStyle;
                var cls_1 = WUX.cls(style);
                if (cls_1)
                    this._classStyle = this._classStyle ? this._classStyle + ' ' + cls_1 : cls_1;
                this._style = WUX.style(style);
                this._attributes = WUX.attributes(attributes);
                if (this.debug)
                    console.log('[' + str(this) + '] new');
                if (this.debug)
                    console.log('[' + str(this) + '] updateProps', props);
                this.updateProps(props);
            }
        }
        Object.defineProperty(WComponent.prototype, "visible", {
            get: function () {
                if (this.internal)
                    return this.internal.visible;
                return this._visible;
            },
            set: function (b) {
                this._visible = b;
                if (this.internal)
                    this.internal.visible = b;
                if (this.root && this.root.length) {
                    if (this._visible)
                        this.root.show();
                    else
                        this.root.hide();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WComponent.prototype, "enabled", {
            get: function () {
                if (this.internal)
                    return this.internal.enabled;
                return this._enabled;
            },
            set: function (b) {
                this._enabled = b;
                if (this.internal)
                    this.internal.enabled = b;
                if (this.root && this.root.length)
                    this.root.prop('disabled', !this._enabled);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WComponent.prototype, "style", {
            get: function () {
                if (this.internal)
                    return this.internal.style;
                return this._style;
            },
            set: function (s) {
                this._style = WUX.css(this._baseStyle, s);
                if (this.internal)
                    this.internal.style = s;
                if (this.root && this.root.length)
                    this.root.attr('style', this._style);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WComponent.prototype, "classStyle", {
            get: function () {
                if (this.internal)
                    return this.internal.classStyle;
                return this._classStyle;
            },
            set: function (s) {
                if (this.internal)
                    this.internal.classStyle = s;
                var remove = false;
                var toggle = false;
                if (s && s.length > 1 && s.charAt(0) == '!') {
                    s = s.substring(1);
                    remove = true;
                }
                else if (s && s.length > 1 && s.charAt(0) == '?') {
                    s = s.substring(1);
                    toggle = true;
                }
                if (remove) {
                    this._classStyle = WUX.removeClass(this._classStyle, s);
                }
                else if (toggle) {
                    this._classStyle = WUX.toggleClass(this._classStyle, s);
                }
                else {
                    this._classStyle = WUX.cls(this._baseClass, s);
                }
                if (this.root && this.root.length) {
                    if (remove) {
                        this.root.removeClass(s);
                    }
                    else if (toggle) {
                        this.root.toggleClass(s);
                    }
                    else {
                        this.root.addClass(this._classStyle);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WComponent.prototype, "attributes", {
            get: function () {
                if (this.internal)
                    return this.internal.attributes;
                return this._attributes;
            },
            set: function (s) {
                this._attributes = s;
                if (this.internal)
                    this.internal.attributes = s;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WComponent.prototype, "tooltip", {
            get: function () {
                if (this.internal)
                    return this.internal.tooltip;
                return this._tooltip;
            },
            set: function (s) {
                this._tooltip = s;
                if (this.internal)
                    this.internal.tooltip = s;
                if (this.root && this.root.length)
                    this.root.attr('title', this._tooltip);
            },
            enumerable: true,
            configurable: true
        });
        WComponent.prototype.css = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            if (!items || items.length == 0)
                return this;
            var c = cls.apply(void 0, items);
            if (c)
                this.classStyle = c;
            var s = css.apply(void 0, items);
            if (s)
                this.style = s;
            return this;
        };
        WComponent.prototype.focus = function () {
            if (this.internal)
                this.internal.focus();
            if (this.root && this.root.length)
                this.root.focus();
            return this;
        };
        WComponent.prototype.blur = function () {
            if (this.internal)
                this.internal.blur();
            if (this.root && this.root.length)
                this.root.blur();
            return this;
        };
        WComponent.prototype.forceUpdate = function (callback) {
            this.update(this.props, this.state, false, false, true, callback);
            return this;
        };
        WComponent.prototype.getContext = function () {
            return this.context;
        };
        WComponent.prototype.getRoot = function () {
            if (!this.root && this.internal)
                return this.internal.getRoot();
            if (!this.root) {
                if (this.id) {
                    var $id = $('#' + this.id);
                    if ($id.length)
                        return $id;
                }
                return this.context;
            }
            return this.root;
        };
        WComponent.prototype.getState = function () {
            return this.state;
        };
        WComponent.prototype.setState = function (nextState, force, callback) {
            if (this.debug)
                console.log('[' + str(this) + '] setState', nextState);
            this.update(this.props, nextState, false, true, this.forceOnChange || force, callback);
            return this;
        };
        WComponent.prototype.getProps = function () {
            return this.props;
        };
        WComponent.prototype.setProps = function (nextProps, force, callback) {
            if (this.debug)
                console.log('[' + str(this) + '] setProps', nextProps);
            this.update(nextProps, this.state, true, false, this.forceOnChange || force, callback);
            return this;
        };
        WComponent.prototype.on = function (events, handler) {
            if (!events)
                return this;
            var arrayEvents = events.split(' ');
            for (var _i = 0, arrayEvents_1 = arrayEvents; _i < arrayEvents_1.length; _i++) {
                var event_1 = arrayEvents_1[_i];
                if (!this.handlers[event_1])
                    this.handlers[event_1] = [];
                this.handlers[event_1].push(handler);
            }
            if (this.internal)
                this.internal.on(events, handler);
            if (this.root && this.root.length)
                this.root.on(events, handler);
            return this;
        };
        WComponent.prototype.off = function (events) {
            if (!events) {
                this.handlers = {};
            }
            else {
                var arrayEvents = events.split(' ');
                for (var _i = 0, arrayEvents_2 = arrayEvents; _i < arrayEvents_2.length; _i++) {
                    var event_2 = arrayEvents_2[_i];
                    delete this.handlers[event_2];
                }
            }
            if (this.internal)
                this.internal.off(events);
            if (this.root && this.root.length)
                this.root.off(events);
            return this;
        };
        WComponent.prototype.trigger = function (eventType) {
            var _a, _b;
            var extParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                extParams[_i - 1] = arguments[_i];
            }
            if (this.debug)
                console.log('[' + str(this) + '] trigger', eventType, extParams);
            if (!eventType)
                return;
            var ep0 = extParams && extParams.length > 0 ? extParams[0] : undefined;
            if (eventType.charAt(0) == '_' || eventType == 'mount' || eventType == 'unmount' || eventType == 'statechange' || eventType == 'propschange') {
                if (ep0 !== undefined) {
                    if (eventType == 'statechange') {
                        if (this.state != extParams[0]) {
                            this.state = extParams[0];
                            if (this.debug)
                                console.log('[' + str(this) + '] trigger set state', this.state);
                        }
                    }
                    else if (eventType == 'propschange') {
                        if (this.props != extParams[0]) {
                            this.props = extParams[0];
                            if (this.debug)
                                console.log('[' + str(this) + '] trigger set props', this.props);
                        }
                    }
                }
                if (!this.handlers || !this.handlers[eventType])
                    return this;
                var event_3 = this.createEvent(eventType, ep0);
                for (var _c = 0, _d = this.handlers[eventType]; _c < _d.length; _c++) {
                    var handler = _d[_c];
                    handler(event_3);
                }
            }
            else if (this.root && this.root.length) {
                if (this.debug)
                    console.log('[' + str(this) + '] trigger ' + eventType + ' on root=' + str(this.root));
                (_a = this.root).trigger.apply(_a, __spreadArrays([eventType], extParams));
            }
            if (this.internal) {
                if (this.debug)
                    console.log('[' + str(this) + '] trigger ' + eventType + ' on internal=' + str(this.internal));
                (_b = this.internal).trigger.apply(_b, __spreadArrays([eventType], extParams));
            }
            return this;
        };
        WComponent.prototype.unmount = function () {
            if (this.debug)
                console.log('[' + str(this) + '] unmount ctx=' + str(this.context) + ' root=' + str(this.root), this.state, this.props);
            this.componentWillUnmount();
            if (this.internal)
                this.internal.unmount();
            this.internal = undefined;
            if (this.root && this.root.length)
                this.root.remove();
            this.root = undefined;
            if (this.id) {
                var idx = WUX.registry.indexOf(this.id);
                if (idx >= 0)
                    WUX.registry.splice(idx, 1);
            }
            this.mounted = false;
            this.trigger('unmount');
            return this;
        };
        WComponent.prototype.mount = function (context) {
            if (this.debug)
                console.log('[' + str(this) + '] mount ctx=' + str(context) + ' root=' + str(this.root), this.state, this.props);
            if (!this.id) {
                if (this.root && this.root.length) {
                    this.id = this.root.attr('id');
                }
            }
            if (context && context.length) {
                this.context = context;
            }
            if (!this.context) {
                if (this.root && this.root.length) {
                    this.context = this.root.parent();
                    if (!this.context)
                        this.context = this.root;
                }
            }
            try {
                if (this.mounted)
                    this.unmount();
                this.mounted = false;
                if (!(this.context && this.context.length)) {
                    var $id = $('#' + this.id);
                    if ($id.length)
                        this.context = $id;
                }
                if (this.debug)
                    console.log('[' + str(this) + '] componentWillMount ctx=' + str(context) + ' root=' + str(this.root));
                this.componentWillMount();
                if (this.context && this.context.length) {
                    if (this.debug)
                        console.log('[' + str(this) + '] render ctx=' + str(context) + ' root=' + str(this.root));
                    var r = this.render();
                    if (r !== undefined && r !== null) {
                        if (r instanceof WComponent) {
                            if (this.debug)
                                console.log('[' + str(this) + '] render -> ' + str(r));
                            this.internal = r;
                            if (!r.parent)
                                r.parent = this;
                            r.mount(this.context);
                            if (!this.root) {
                                if (this.id) {
                                    var $id = $('#' + this.id);
                                    this.root = $id.length ? $id : this.internal.getRoot();
                                }
                                else {
                                    this.root = this.context;
                                }
                            }
                        }
                        else if (r instanceof jQuery) {
                            this.context.append(r);
                            if (!this.root)
                                this.root = r;
                        }
                        else {
                            var _a = parse(r), b = _a[0], $r = _a[1], a = _a[2];
                            if (b)
                                this.context.append(b);
                            this.context.append($r);
                            if (a)
                                this.context.append(a);
                            if (!this.root)
                                this.root = this.id ? $('#' + this.id) : $r;
                        }
                    }
                    else {
                        if (this.internal)
                            this.internal.mount(this.context);
                        if (!this.root)
                            this.root = this.id ? $('#' + this.id) : this.context;
                    }
                }
                if (!this._visible) {
                    if (this.internal) {
                        this.internal.visible = false;
                    }
                    else {
                        this.root.hide();
                    }
                }
                if (!this._enabled) {
                    if (this.internal) {
                        this.internal.enabled = false;
                    }
                    else {
                        this.root.prop('disabled', true);
                    }
                }
                if (this.debug)
                    console.log('[' + str(this) + '] componentDidMount ctx=' + str(context) + ' root=' + str(this.root));
                this.componentDidMount();
                if (this.root && this.root.length) {
                    for (var event_4 in this.handlers) {
                        if (!event_4 || event_4.charAt(0) == '_')
                            continue;
                        if (event_4 == 'mount' || event_4 == 'unmount' || event_4 == 'statechange' || event_4 == 'propschange')
                            continue;
                        for (var _i = 0, _b = this.handlers[event_4]; _i < _b.length; _i++) {
                            var handler = _b[_i];
                            this.root.on(event_4, handler);
                        }
                    }
                }
                this.root.wuxComponent(this);
                this.mounted = true;
                if (this.id) {
                    if (!this.internal || this.internal.id != this.id) {
                        var idx = WUX.registry.indexOf(this.id);
                        if (idx >= 0) {
                            var wci = WUX.getComponent(this.id);
                            if (wci && wci.cuid != this.cuid) {
                                console.error('[' + str(this) + '] id already used by ' + str(wci));
                            }
                        }
                        else {
                            WUX.registry.push(this.id);
                        }
                    }
                }
                this.trigger('mount');
            }
            catch (e) {
                var errorInfo = str(this) + ' ' + str(this.context);
                console.error('[' + str(this) + '] mount error ' + errorInfo, e);
                this.componentDidCatch(e, errorInfo);
            }
            return this;
        };
        WComponent.prototype.componentWillUnmount = function () {
        };
        WComponent.prototype.componentWillMount = function () {
        };
        WComponent.prototype.render = function () {
            return this.buildRoot(this.rootTag);
        };
        WComponent.prototype.componentDidMount = function () {
        };
        WComponent.prototype.componentDidCatch = function (error, errorInfo) {
        };
        WComponent.prototype.shouldComponentUpdate = function (nextProps, nextState) {
            if (typeof nextProps == 'object' || typeof nextState == 'object')
                return true;
            return this.props != nextProps || this.state != nextState;
        };
        WComponent.prototype.componentWillUpdate = function (nextProps, nextState) {
        };
        WComponent.prototype.componentDidUpdate = function (prevProps, prevState) {
        };
        WComponent.prototype.updateProps = function (nextProps) {
            this.props = nextProps;
        };
        WComponent.prototype.updateState = function (nextState) {
            this.state = nextState;
        };
        WComponent.prototype.update = function (nextProps, nextState, propsChange, stateChange, force, callback) {
            if (force === void 0) { force = false; }
            if (this.debug)
                console.log('[' + str(this) + '] update', nextProps, nextState, 'propsChange=' + propsChange + ',stateChange=' + stateChange + ',force=' + force);
            nextProps = nextProps === undefined ? this.props : nextProps;
            var prevProps = this.props;
            var prevState = this.state;
            this.dontTrigger = false;
            if (this.mounted) {
                if (force || this.shouldComponentUpdate(nextProps, nextState)) {
                    try {
                        if (this.debug)
                            console.log('[' + str(this) + '] componentWillUpdate', nextProps, nextState);
                        this.componentWillUpdate(nextProps, nextState);
                        if (propsChange) {
                            if (this.debug)
                                console.log('[' + str(this) + '] updateProps', nextProps);
                            this.updateProps(nextProps);
                        }
                        if (stateChange) {
                            if (this.debug)
                                console.log('[' + str(this) + '] updateState', nextState);
                            this.updateState(nextState);
                        }
                        if (force)
                            this.mount();
                        if (this.debug)
                            console.log('[' + str(this) + '] componentDidUpdate', prevProps, prevState);
                        this.componentDidUpdate(prevProps, prevState);
                        if (propsChange && !this.dontTrigger)
                            this.trigger('propschange');
                        if (stateChange && !this.dontTrigger)
                            this.trigger('statechange');
                    }
                    catch (e) {
                        this.componentDidCatch(e, str(this) + '|' + str(this.context));
                        return false;
                    }
                    if (callback)
                        callback();
                }
            }
            else {
                if (propsChange) {
                    if (this.debug)
                        console.log('[' + str(this) + '] updateProps', nextProps);
                    this.updateProps(nextProps);
                    if (!this.dontTrigger)
                        this.trigger('propschange');
                }
                if (stateChange) {
                    if (this.debug)
                        console.log('[' + str(this) + '] updateState', nextState);
                    this.updateState(nextState);
                    if (!this.dontTrigger)
                        this.trigger('statechange');
                }
            }
            return true;
        };
        WComponent.prototype.createEvent = function (type, data) {
            var target = this.root && this.root.length ? this.root.get(0) : this.root;
            return { component: this, element: this.root, target: target, type: type, data: data };
        };
        WComponent.prototype.shouldBuildRoot = function () {
            if (this.internal)
                return false;
            if (this.root && this.root.length)
                return false;
            if (this.context && this.context.length) {
                var ctxId = this.context.attr('id');
                if (!ctxId && ctxId == this.id)
                    return false;
            }
            return true;
        };
        WComponent.prototype.buildRoot = function (tagName, inner, baseAttribs, classStyle, style, attributes, id) {
            if (this.debug)
                console.log('[' + str(this) + '] buildRoot', tagName, inner, baseAttribs, classStyle, style, attributes, id);
            if (!this.shouldBuildRoot()) {
                if (this.debug)
                    console.log('[' + str(this) + '] shouldBuildRoot() -> false');
                return undefined;
            }
            else {
                if (this.debug)
                    console.log('[' + str(this) + '] shouldBuildRoot() -> true');
            }
            return this.build(tagName, inner, baseAttribs, classStyle, style, attributes, id);
        };
        WComponent.prototype.build = function (tagName, inner, baseAttribs, classStyle, style, attributes, id) {
            if (!tagName)
                tagName = 'div';
            if (classStyle === undefined)
                classStyle = this._classStyle;
            if (style === undefined)
                style = this._style;
            if (attributes === undefined)
                attributes = this._attributes;
            if (id === undefined)
                id = this.id;
            var r = '<' + tagName;
            if (id)
                r += ' id="' + id + '"';
            if (classStyle)
                r += ' class="' + classStyle + '"';
            if (style)
                r += ' style="' + style + '"';
            var a = WUX.attributes(attributes);
            if (a)
                r += ' ' + a;
            var ba = WUX.attributes(baseAttribs);
            if (ba)
                r += ' ' + ba;
            r += '>';
            var bca = inner == null ? divide(this.make()) : divide(inner);
            r += bca[1];
            if (tagName == 'input')
                return bca[0] + r + bca[2];
            r += '</' + tagName + '>';
            return bca[0] + r + bca[2];
        };
        WComponent.prototype.make = function () {
            return '';
        };
        WComponent.prototype.subId = function (id, s) {
            if (id instanceof WComponent) {
                var cid = id.id;
                if (!cid || !this.id)
                    return cid;
                if (cid.indexOf(this.id + '-') != 0)
                    return cid;
                return cid.substring(this.id.length + 1);
            }
            else {
                if (!this.id || this.id == '*')
                    this.id = 'w' + this.cuid;
                if (!id || id == '*')
                    id = (this.subSeq++).toString();
                if (!s && s != 0)
                    return this.id + '-' + id;
                return this.id + '-' + id + '-' + s;
            }
        };
        WComponent.prototype.ripId = function (sid) {
            if (!sid || !this.id)
                return sid;
            if (sid.indexOf(this.id) == 0 && sid.length > this.id.length + 1) {
                return sid.substring(this.id.length + 1);
            }
            return sid;
        };
        WComponent.prototype.transferTo = function (dest, force, callback) {
            if (this.debug)
                console.log('[' + str(this) + '] transferTo ' + str(dest));
            if (dest) {
                dest.setState(this.getState(), force, callback);
                return true;
            }
            return false;
        };
        return WComponent;
    }());
    WUX.WComponent = WComponent;
    var WInputType;
    (function (WInputType) {
        WInputType["Text"] = "text";
        WInputType["Number"] = "number";
        WInputType["Password"] = "password";
        WInputType["CheckBox"] = "checkbox";
        WInputType["Radio"] = "radio";
        WInputType["Date"] = "date";
        WInputType["DateTime"] = "datetime";
        WInputType["Time"] = "time";
        WInputType["File"] = "file";
        WInputType["Image"] = "image";
        WInputType["Color"] = "color";
        WInputType["Email"] = "email";
        WInputType["Url"] = "url";
        WInputType["Month"] = "month";
        WInputType["Week"] = "week";
        WInputType["Search"] = "search";
        WInputType["Hidden"] = "hidden";
        WInputType["Note"] = "note";
        WInputType["Select"] = "select";
        WInputType["Static"] = "static";
        WInputType["Component"] = "component";
        WInputType["Blank"] = "blank";
        WInputType["Link"] = "link";
        WInputType["Integer"] = "integer";
        WInputType["Cron"] = "crontab";
        WInputType["TreeSelect"] = "tree";
        WInputType["Ftp"] = "ftp";
    })(WInputType = WUX.WInputType || (WUX.WInputType = {}));
    var WUtil = (function () {
        function WUtil() {
        }
        WUtil.toArrayComponent = function (a) {
            if (!a)
                return [];
            if (Array.isArray(a) && a.length) {
                if (a[0] instanceof WComponent)
                    return a;
                return [];
            }
            var r = [];
            if (a instanceof WComponent)
                r.push(a);
            return r;
        };
        WUtil.hasComponents = function (a) {
            if (!a)
                return false;
            if (Array.isArray(a) && a.length) {
                if (a[0] instanceof WComponent)
                    return true;
                return false;
            }
            if (a instanceof WComponent)
                return true;
            return false;
        };
        WUtil.toArray = function (a) {
            if (a instanceof WComponent)
                a = a.getState();
            if (a == null)
                return [];
            if (Array.isArray(a))
                return a;
            var r = [];
            r.push(a);
            return r;
        };
        WUtil.toArrayNumber = function (a, nz) {
            if (a instanceof WComponent)
                a = a.getState();
            if (a == null)
                return [];
            var r = [];
            if (Array.isArray(a)) {
                for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
                    var e = a_1[_i];
                    var n = WUtil.toNumber(e);
                    if (nz && !n)
                        continue;
                    r.push(n);
                }
            }
            else {
                var n = WUtil.toNumber(a);
                if (nz && !n)
                    return r;
                r.push(n);
            }
            return r;
        };
        WUtil.toArrayString = function (a, ne) {
            if (a instanceof WComponent)
                a = a.getState();
            if (a == null)
                return [];
            var r = [];
            if (Array.isArray(a)) {
                for (var _i = 0, a_2 = a; _i < a_2.length; _i++) {
                    var e = a_2[_i];
                    var s = WUtil.toString(e);
                    if (ne && !s)
                        continue;
                    r.push(s);
                }
            }
            else {
                var s = WUtil.toString(a);
                if (ne && !s)
                    return r;
                r.push(WUtil.toString(a));
            }
            return r;
        };
        WUtil.splitNumbers = function (a, s) {
            if (!a)
                return [];
            var sa = WUtil.toString(a);
            var aos = sa.split(s);
            var r = [];
            for (var _i = 0, aos_1 = aos; _i < aos_1.length; _i++) {
                var e = aos_1[_i];
                r.push(WUtil.toNumber(e));
            }
            return r;
        };
        WUtil.toObject = function (a, d) {
            if (a instanceof WComponent)
                a = a.getState();
            if (a == null)
                return d;
            if (typeof a == 'object')
                return a;
            return d;
        };
        WUtil.toString = function (a, d) {
            if (d === void 0) { d = ''; }
            if (a instanceof WComponent)
                a = a.getState();
            if (a == null)
                return d;
            if (typeof a == 'string')
                return a;
            if (a instanceof Date)
                return WUX.formatDate(a);
            if (typeof a == 'object' && a.id != undefined)
                return WUtil.toString(a.id, d);
            if (Array.isArray(a) && a.length)
                return WUtil.toString(a[0], d);
            return '' + a;
        };
        WUtil.toText = function (a, d) {
            if (d === void 0) { d = ''; }
            var r = WUtil.toString(a, d);
            return r.replace('<', '&lt;').replace('>', '&gt;');
        };
        WUtil.toNumber = function (a, d) {
            if (d === void 0) { d = 0; }
            if (a instanceof WComponent)
                a = a.getState();
            if (a == null)
                return d;
            if (typeof a == 'number')
                return a;
            if (a instanceof Date)
                return a.getFullYear() * 10000 + (a.getMonth() + 1) * 100 + a.getDate();
            if (typeof a == 'object' && a.id != undefined)
                return WUtil.toNumber(a.id, d);
            if (Array.isArray(a) && a.length)
                return WUtil.toNumber(a[0], d);
            var s = ('' + a).trim();
            if (s.indexOf('.') >= 0 && s.indexOf(',') >= 0)
                s = s.replace('.', '');
            s = s.replace(',', '.');
            var n = s.indexOf('.') >= d ? parseFloat(s) : parseInt(s);
            return isNaN(n) ? d : n;
        };
        WUtil.toInt = function (a, d) {
            if (d === void 0) { d = 0; }
            if (a instanceof WComponent)
                a = a.getState();
            if (a == null)
                return d;
            if (typeof a == 'number')
                return Math.floor(a);
            if (a instanceof Date)
                return a.getFullYear() * 10000 + (a.getMonth() + 1) * 100 + a.getDate();
            if (typeof a == 'object' && a.id != undefined)
                return WUtil.toInt(a.id, d);
            if (Array.isArray(a) && a.length)
                return WUtil.toInt(a[0], d);
            var s = ('' + a).replace(',', '.');
            var n = parseInt(s);
            return isNaN(n) ? d : n;
        };
        WUtil.toIntTime = function (a, d) {
            if (d === void 0) { d = 0; }
            if (a instanceof WComponent)
                a = a.getState();
            if (a == null)
                return d;
            if (typeof a == 'number')
                a;
            if (a instanceof Date)
                return a.getHours() * 100 + a.getMinutes();
            if (Array.isArray(a) && a.length)
                return WUtil.toIntTime(a[0], d);
            var s = ('' + a).replace(':', '').replace('.', '').replace(',', '');
            var n = parseInt(s);
            return isNaN(n) ? d : n;
        };
        WUtil.isNumeric = function (a) {
            return !isNaN(a);
        };
        WUtil.checkEmail = function (e) {
            if (!e)
                return '';
            var s = WUtil.toString(e);
            if (!s)
                return '';
            if (s.length < 5)
                return '';
            var a = s.indexOf('@');
            if (a <= 0)
                return '';
            var d = s.lastIndexOf('.');
            if (d < a)
                return '';
            return s.trim().toLowerCase();
        };
        WUtil.starts = function (a, s) {
            if (!a || s == null)
                return false;
            return WUtil.toString(a).indexOf(s) == 0;
        };
        WUtil.ends = function (a, s) {
            if (!a || s == null)
                return false;
            var t = WUtil.toString(a);
            var i = t.lastIndexOf(s);
            if (i < 0)
                return false;
            return i == t.length - s.length;
        };
        WUtil.isEmpty = function (a) {
            if (!a)
                return true;
            if (Array.isArray(a) && !a.length)
                return true;
            if (typeof a == 'object') {
                var r = 0;
                for (var k in a)
                    if (a.hasOwnProperty(k))
                        return false;
                return true;
            }
            return false;
        };
        WUtil.toBoolean = function (a, d) {
            if (d === void 0) { d = false; }
            if (a instanceof WUX.WCheck)
                a = a.getProps();
            if (a instanceof WComponent)
                a = a.getState();
            if (a == null)
                return d;
            if (typeof a == 'boolean')
                return a;
            if (typeof a == 'string' && a.length)
                return '1YyTtSs'.indexOf(a.charAt(0)) >= 0;
            return !!d;
        };
        WUtil.toDate = function (a, d) {
            if (a instanceof WComponent)
                a = a.getState();
            if (a == null)
                return d;
            if (a instanceof Date)
                return a;
            if (typeof a == 'number') {
                if (a < 10000101)
                    return d;
                return new Date(a / 10000, ((a % 10000) / 100) - 1, (a % 10000) % 100);
            }
            if (typeof a == 'string') {
                if (a.length < 8)
                    return d;
                var sd = a.indexOf(',');
                if (sd >= 0)
                    a = a.substring(sd + 1);
                if (a.indexOf('-') > 3)
                    return new Date(a.trim());
                if (this.isNumeric(a)) {
                    var n = parseInt(a);
                    if (n < 10000101)
                        return d;
                    return new Date(n / 10000, ((n % 10000) / 100) - 1, (n % 10000) % 100);
                }
                return new Date(a.trim().replace(/(\d{1,2}).(\d{1,2}).(\d{4})/, '$3-$2-$1'));
            }
            return d;
        };
        WUtil.getWeek = function (a) {
            var d;
            if (a instanceof Date) {
                d = new Date(a.getTime());
            }
            else {
                d = WUtil.toDate(a);
            }
            if (!d)
                d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
            var w1 = new Date(d.getFullYear(), 0, 4);
            return 1 + Math.round(((d.getTime() - w1.getTime()) / 86400000 - 3 + (w1.getDay() + 6) % 7) / 7);
        };
        WUtil.getParam = function (name, url) {
            if (!url)
                url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
            if (!results)
                return '';
            if (!results[2])
                return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        };
        WUtil.size = function (a) {
            if (!a)
                return 0;
            if (Array.isArray(a))
                return a.length;
            if (typeof a == 'object') {
                var r = 0;
                for (var k in a)
                    if (a.hasOwnProperty(k))
                        r++;
                return r;
            }
            return 0;
        };
        WUtil.setValue = function (a, k, v) {
            if (typeof a == 'object')
                a[k] = v;
            return a;
        };
        WUtil.getValue = function (a, k, d) {
            if (!k)
                return d;
            if (Array.isArray(a) && a.length) {
                if (k == '-1') {
                    return WUtil.getLast(a, d);
                }
                else if (WUtil.isNumeric(k)) {
                    return WUtil.getItem(a, WUtil.toInt(k), d);
                }
                else {
                    return WUtil.getValue(a[0], k, d);
                }
            }
            if (typeof a == 'object') {
                var sep = k.indexOf('.');
                if (a[k] == null && sep > 0) {
                    var sub = k.substring(0, sep);
                    if (a[sub] == null)
                        return d;
                    return WUtil.getValue(a[sub], k.substring(sep + 1), d);
                }
                return a[k] == null ? d : a[k];
            }
            return d;
        };
        WUtil.getItem = function (a, i, d) {
            if (i < 0)
                return d;
            if (Array.isArray(a)) {
                if (a.length > i) {
                    var r = a[i];
                    return r == null ? d : r;
                }
                return d;
            }
            return d;
        };
        WUtil.getEntity = function (a) {
            var k = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                k[_i - 1] = arguments[_i];
            }
            if (!a)
                return null;
            var r;
            if (Array.isArray(a)) {
                var id = a[0];
                if (!id)
                    return null;
                r = { id: id };
                r.text = WUtil.toString(a[1]);
                if (a[2] != null)
                    r.code = a[2];
                if (a[3] != null)
                    r.group = a[3];
                if (a[4] != null)
                    r.type = a[4];
                if (a[5] != null)
                    r.date = WUtil.toDate(a[5]);
                if (a[6] != null)
                    r.reference = a[6];
                if (a[7] != null)
                    r.value = WUtil.toNumber(a[7]);
                return r;
            }
            if (!k || !k.length)
                return null;
            if (k[0]) {
                var id = WUtil.getValue(a, k[0]);
                if (!id)
                    return null;
                r = { id: id };
            }
            if (!r)
                return null;
            if (k[1])
                r.text = WUtil.getString(a, k[1]);
            if (k[2])
                r.code = WUtil.getValue(a, k[2]);
            if (k[3])
                r.group = WUtil.getValue(a, k[3]);
            if (k[4])
                r.type = WUtil.getValue(a, k[4]);
            if (k[5])
                r.date = WUtil.getDate(a, k[5]);
            if (k[6])
                r.reference = WUtil.getValue(a, k[6]);
            if (k[7])
                r.value = WUtil.getNumber(a, k[7]);
            return r;
        };
        WUtil.toEntity = function (a, m) {
            if (!a || !m || !m.id)
                return null;
            var r = {
                id: WUtil.getValue(a, m.id)
            };
            if (m.text)
                r.text = WUtil.getString(a, m.text);
            if (m.code)
                r.code = WUtil.getValue(a, m.code);
            if (m.group)
                r.group = WUtil.getValue(a, m.group);
            if (m.type)
                r.type = WUtil.getValue(a, m.type);
            if (m.reference)
                r.reference = WUtil.getValue(a, m.reference);
            if (m.enabled)
                r.enabled = WUtil.getBoolean(a, m.enabled);
            if (m.marked)
                r.marked = WUtil.getBoolean(a, m.marked);
            if (m.date)
                r.date = WUtil.getDate(a, m.date);
            if (m.notBefore)
                r.notBefore = WUtil.getDate(a, m.notBefore);
            if (m.expires)
                r.expires = WUtil.getDate(a, m.expires);
            if (m.icon)
                r.icon = WUtil.getString(a, m.icon);
            if (m.color)
                r.color = WUtil.getString(a, m.color);
            if (m.value)
                r.value = WUtil.getNumber(a, m.value);
            return r;
        };
        WUtil.getFirst = function (a, d) {
            if (Array.isArray(a)) {
                if (a.length > 0) {
                    var r = a[0];
                    return r == null ? d : r;
                }
                return d;
            }
            return d;
        };
        WUtil.getLast = function (a, d) {
            if (Array.isArray(a)) {
                if (a.length > 0) {
                    var r = a[a.length - 1];
                    return r == null ? d : r;
                }
                return d;
            }
            return d;
        };
        WUtil.toCode = function (a, d) {
            if (d === void 0) { d = ''; }
            if (a instanceof WComponent)
                a = a.getState();
            if (a == null)
                return d;
            if (typeof a == 'string')
                return a;
            if (typeof a == 'object' && a.code != undefined)
                return a.code;
            if (Array.isArray(a) && a.length) {
                if (a.length > 1)
                    return a[1];
                return a[0];
            }
            return a;
        };
        WUtil.toDesc = function (a, d) {
            if (d === void 0) { d = ''; }
            if (a instanceof WComponent)
                a = a.getState();
            if (a == null)
                return d;
            if (typeof a == 'string')
                return a;
            if (typeof a == 'object' && a.text != undefined)
                return WUtil.toString(a.text, d);
            if (Array.isArray(a) && a.length) {
                return WUtil.toString(a[a.length - 1], d);
            }
            return WUtil.toString(a, d);
        };
        WUtil.getNumber = function (a, k, d) {
            return WUtil.toNumber(WUtil.getValue(a, k, d));
        };
        WUtil.getInt = function (a, k, d) {
            return WUtil.toInt(WUtil.getValue(a, k, d));
        };
        WUtil.getString = function (a, k, d, f) {
            var v = WUtil.getValue(a, k);
            if (v == null)
                return d;
            if (!f)
                return WUtil.toString(v);
            if (f == '?') {
                if (typeof v == 'number') {
                    return WUX.formatNum(v);
                }
                else {
                    return WUtil.toString(v);
                }
            }
            if (f == 'c')
                return WUX.formatCurr(v);
            if (f == 'c5')
                return WUX.formatCurr5(v);
            if (f == 'n')
                return WUX.formatNum(v);
            if (f == 'n2')
                return WUX.formatNum2(v);
            if (f == 'm')
                return WUX.formatMonth(v);
            if (f == 'd')
                return WUX.formatDate(v);
            if (f == 'dt')
                return WUX.formatDateTime(v);
            if (f == 't')
                return WUX.formatTime(v);
            return WUtil.toString(v);
        };
        WUtil.getText = function (a, k, d) {
            return WUtil.toText(WUtil.getValue(a, k, d));
        };
        WUtil.getBoolean = function (a, k, d) {
            return WUtil.toBoolean(WUtil.getValue(a, k, d));
        };
        WUtil.getDate = function (a, k, d) {
            return WUtil.toDate(WUtil.getValue(a, k, d));
        };
        WUtil.getArray = function (a, k) {
            return WUtil.toArray(WUtil.getValue(a, k));
        };
        WUtil.getArrayNumber = function (a, k, nz) {
            return WUtil.toArrayNumber(WUtil.getValue(a, k), nz);
        };
        WUtil.getArrayString = function (a, k, ne) {
            return WUtil.toArrayString(WUtil.getValue(a, k), ne);
        };
        WUtil.getCode = function (a, k, d) {
            return WUtil.toCode(WUtil.getValue(a, k, d));
        };
        WUtil.getDesc = function (a, k, d) {
            return WUtil.toDesc(WUtil.getValue(a, k, d));
        };
        WUtil.getObject = function (a, k, n) {
            var r = WUtil.toObject(WUtil.getValue(a, k));
            if (!r && n)
                return {};
            return r;
        };
        WUtil.sort = function (a, t, k) {
            if (t === void 0) { t = true; }
            if (!a)
                return [];
            var array = WUtil.toArray(a);
            if (!k) {
                var r_1 = array.sort();
                return t ? r_1 : r_1.reverse();
            }
            var r = array.sort(function (a, b) {
                var x = WUtil.getValue(a, k);
                var y = WUtil.getValue(b, k);
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
            return t ? r : r.reverse();
        };
        WUtil.find = function (a, k, v) {
            if (!a || !k)
                return null;
            var y = WUtil.toArray(a);
            for (var _i = 0, y_1 = y; _i < y_1.length; _i++) {
                var i = y_1[_i];
                var w = WUtil.getValue(i, k);
                if (w instanceof Date && v instanceof Date) {
                    if (w.getTime() == v.getTime())
                        return i;
                }
                if (w == v)
                    return i;
            }
            return null;
        };
        WUtil.indexOf = function (a, k, v) {
            if (!a || !k)
                return -1;
            var y = WUtil.toArray(a);
            for (var i = 0; i < y.length; i++) {
                var w = WUtil.getValue(y[i], k);
                if (w instanceof Date && v instanceof Date) {
                    if (w.getTime() == v.getTime())
                        return i;
                }
                if (w == v)
                    return i;
            }
            return -1;
        };
        WUtil.isSameDate = function (a, b) {
            var na = this.toNumber(a);
            var nb = this.toNumber(b);
            if (na == nb)
                return true;
            return false;
        };
        WUtil.indexOfDate = function (a, v) {
            if (!a || !v)
                return -1;
            var vi = WUtil.toNumber(v);
            for (var i = 0; i < a.length; i++) {
                if (!a[i])
                    continue;
                var ai = WUtil.toNumber(a[i]);
                if (ai == vi)
                    return i;
            }
            return -1;
        };
        WUtil.round2 = function (a) {
            if (a == null)
                return 0;
            var n = WUtil.toNumber(a);
            return (Math.round(n * 100) / 100);
        };
        WUtil.floor2 = function (a) {
            if (a == null)
                return 0;
            var n = WUtil.toNumber(a);
            return (Math.floor(n * 100) / 100);
        };
        WUtil.ceil2 = function (a) {
            if (a == null)
                return 0;
            var n = WUtil.toNumber(a);
            return (Math.ceil(n * 100) / 100);
        };
        WUtil.compare2 = function (a, b) {
            if (!a && !b)
                return 0;
            var n = Math.round(WUtil.toNumber(a) * 100);
            var m = Math.round(WUtil.toNumber(b) * 100);
            if (n == m)
                return 0;
            return n > m ? 1 : -1;
        };
        WUtil.compare5 = function (a, b) {
            if (!a && !b)
                return 0;
            var n = Math.round(WUtil.toNumber(a) * 10000);
            var m = Math.round(WUtil.toNumber(b) * 10000);
            if (n == m)
                return 0;
            return n > m ? 1 : -1;
        };
        WUtil.getCurrDate = function (d, m, y, f, l) {
            var r = new Date();
            r.setHours(0, 0, 0, 0);
            if (d)
                r.setDate(r.getDate() + d);
            if (m)
                r.setMonth(r.getMonth() + m);
            if (y)
                r.setFullYear(r.getFullYear() + y);
            if (f)
                r.setDate(1);
            if (l) {
                r.setMonth(r.getMonth() + 1);
                r.setDate(0);
            }
            return r;
        };
        WUtil.calcDate = function (r, d, m, y, f, l) {
            r = r ? new Date(r.getTime()) : new Date();
            r.setHours(0, 0, 0, 0);
            if (d)
                r.setDate(r.getDate() + d);
            if (m)
                r.setMonth(r.getMonth() + m);
            if (y)
                r.setFullYear(r.getFullYear() + y);
            if (f)
                r.setDate(1);
            if (l) {
                r.setMonth(r.getMonth() + 1);
                r.setDate(0);
            }
            return r;
        };
        WUtil.timestamp = function (dt) {
            var d = dt ? WUtil.toDate(dt) : new Date();
            if (!d)
                d = new Date();
            var sy = '' + d.getFullYear();
            var nm = d.getMonth() + 1;
            var sm = nm < 10 ? '0' + nm : '' + nm;
            var nd = d.getDate();
            var sd = nd < 10 ? '0' + nd : '' + nd;
            var nh = d.getHours();
            var sh = nh < 10 ? '0' + nh : '' + nh;
            var np = d.getMinutes();
            var sp = np < 10 ? '0' + np : '' + np;
            var ns = d.getSeconds();
            var ss = ns < 10 ? '0' + ns : '' + ns;
            return sy + sm + sd + sh + sp + ss;
        };
        WUtil.nvl = function () {
            var v = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                v[_i] = arguments[_i];
            }
            if (!v || !v)
                return;
            for (var _a = 0, v_1 = v; _a < v_1.length; _a++) {
                var e = v_1[_a];
                if (!e)
                    return e;
            }
            return v[0];
        };
        WUtil.eqValues = function (o1, o2) {
            var keys = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                keys[_i - 2] = arguments[_i];
            }
            if (!o1 && !o2)
                return true;
            if (!o1 || !o2)
                return false;
            for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
                var k = keys_1[_a];
                if (o1[k] != o2[k])
                    return false;
            }
            return true;
        };
        WUtil.cat = function (t1, t2, s, b, a) {
            var s1 = WUtil.toString(t1);
            var s2 = WUtil.toString(t2);
            var ss = WUtil.toString(s);
            var sb = WUtil.toString(b);
            var sa = WUtil.toString(a);
            var r = '';
            if (s1) {
                r += s1;
                if (ss)
                    r += ss;
            }
            if (s2) {
                if (sb)
                    r += sb;
                r += s2;
                if (sa)
                    r += sa;
            }
            return r;
        };
        WUtil.col = function (tuples, i, d) {
            var r = [];
            if (!tuples || !tuples.length)
                return r;
            for (var _i = 0, tuples_1 = tuples; _i < tuples_1.length; _i++) {
                var e = tuples_1[_i];
                r.push(WUtil.getItem(e, i, d));
            }
            return r;
        };
        WUtil.getSortedKeys = function (map) {
            if (!map)
                return [];
            var r = [];
            for (var key in map) {
                if (map.hasOwnProperty(key))
                    r.push(key);
            }
            return r.sort();
        };
        WUtil.diffMinutes = function (ah, al) {
            var dh = WUtil.toDate(ah);
            var dl = WUtil.toDate(al);
            if (!dh)
                dh = new Date();
            if (!dl)
                dl = new Date();
            return (dh.getTime() - dl.getTime()) / 60000;
        };
        WUtil.diffHours = function (ah, al) {
            var dh = WUtil.toDate(ah);
            var dl = WUtil.toDate(al);
            if (!dh)
                dh = new Date();
            if (!dl)
                dl = new Date();
            return (dh.getTime() - dl.getTime()) / 3600000;
        };
        WUtil.diffDays = function (ah, al) {
            var dh = WUtil.toDate(ah);
            var dl = WUtil.toDate(al);
            if (!dh)
                dh = new Date();
            if (!dl)
                dl = new Date();
            var dt = dh.getTime() - dl.getTime();
            var dv = dt / (3600000 * 24);
            var rt = dt % (3600000 * 24);
            var rh = rt / 60000;
            var r = dv;
            if (rh > 12) {
                r++;
            }
            return r;
        };
        return WUtil;
    }());
    WUX.WUtil = WUtil;
    function getId(e) {
        if (!e)
            return;
        if (e instanceof jQuery)
            return e.attr('id');
        if (e instanceof WComponent)
            return e.id;
        if (typeof e == 'string') {
            if (e.indexOf('<') < 0)
                return e.indexOf('#') == 0 ? e.substring(1) : e;
        }
        if (typeof e == 'object' && !e.id) {
            return '' + e.id;
        }
        var $e = $(e);
        var id = $e.attr('id');
        if (!id) {
            var t = $e.prop("tagName");
            if (t == 'i' || t == 'I')
                id = $e.parent().attr('id');
        }
        return id;
    }
    WUX.getId = getId;
    function firstSub(e, r) {
        var id = getId(e);
        if (!id)
            return '';
        var s = id.indexOf('-');
        if (s < 0)
            return id;
        if (r)
            return id.substring(s + 1);
        return id.substring(0, s);
    }
    WUX.firstSub = firstSub;
    function lastSub(e) {
        var id = getId(e);
        if (!id)
            return '';
        var s = id.lastIndexOf('-');
        if (s < 0)
            return id;
        if (s > 0) {
            var p = id.charAt(s - 1);
            if (p == '-')
                return id.substring(s);
        }
        return id.substring(s + 1);
    }
    WUX.lastSub = lastSub;
    function getComponent(id) {
        if (!id)
            return;
        var $id = $('#' + id);
        if (!$id.length)
            return;
        return $id.wuxComponent(false);
    }
    WUX.getComponent = getComponent;
    function getRootComponent(c) {
        if (!c)
            return c;
        if (!c.parent)
            return c;
        return getRootComponent(c.parent);
    }
    WUX.getRootComponent = getRootComponent;
    function setProps(id, p) {
        if (!id)
            return;
        var $id = $('#' + id);
        if (!$id.length)
            return;
        var c = $id.wuxComponent(false);
        if (!c)
            return;
        c.setProps(p);
        return c;
    }
    WUX.setProps = setProps;
    function getProps(id, d) {
        if (!id)
            return d;
        var $id = $('#' + id);
        if (!$id.length)
            return d;
        var c = $id.wuxComponent(false);
        if (!c)
            return d;
        var p = c.getProps();
        if (p == null)
            return d;
        return p;
    }
    WUX.getProps = getProps;
    function setState(id, s) {
        if (!id)
            return;
        var $id = $('#' + id);
        if (!$id.length)
            return;
        var c = $id.wuxComponent(false);
        if (!c)
            return;
        c.setState(s);
        return c;
    }
    WUX.setState = setState;
    function getState(id, d) {
        if (!id)
            return d;
        var $id = $('#' + id);
        if (!$id.length)
            return d;
        var c = $id.wuxComponent(false);
        if (!c)
            return d;
        var s = c.getState();
        if (s == null)
            return d;
        return s;
    }
    WUX.getState = getState;
    function newInstance(n) {
        if (!n)
            return null;
        var s = n.lastIndexOf('.');
        if (s > 0) {
            var ns = n.substring(0, s);
            if (window[ns]) {
                var c = n.substring(s + 1);
                for (var i in window[ns]) {
                    if (i == c)
                        return new window[ns][i];
                }
                return null;
            }
        }
        var p = window[n];
        return (p && p.prototype) ? Object.create(p.prototype) : null;
    }
    WUX.newInstance = newInstance;
    function same(e1, e2) {
        if (typeof e1 == 'string' && typeof e2 == 'string')
            return e1 == e2;
        if (typeof e1 == 'string' || typeof e2 == 'string')
            return false;
        var id1 = getId(e1);
        var id2 = getId(e2);
        return id1 && id2 && id1 == id2;
    }
    WUX.same = same;
    function parse(s) {
        if (!s)
            return ['', $('<span></span>'), ''];
        if (typeof s == 'string') {
            if (s.charAt(0) != '<' || s.charAt(s.length - 1) != '>') {
                var st = s.indexOf('<');
                if (st < 0)
                    return ['', $('<span>' + s.replace('>', '&gt;') + '</span>'), ''];
                var et = s.lastIndexOf('>');
                if (et < 0)
                    return ['', $('<span>' + s.replace('<', '&lt;') + '</span>'), ''];
                return [s.substring(0, st), $(s.substring(st, et + 1)), s.substring(et + 1)];
            }
            return ['', $(s), ''];
        }
        else if (s instanceof jQuery) {
            return ['', s, ''];
        }
        return ['', $('<span>' + s + '</span>'), ''];
    }
    WUX.parse = parse;
    function divide(s) {
        if (!s)
            return ['', '', ''];
        if (s == ' ')
            return ['', '&nbsp;', ''];
        var b = s.charAt(0) == ' ' ? '&nbsp;' : '';
        var a = s.length > 1 && s.charAt(s.length - 1) == ' ' ? '&nbsp;' : '';
        var ss = s.trim().split('<>');
        if (!ss || ss.length < 2)
            return [b, s.trim(), a];
        b += ss[0];
        if (ss.length == 2)
            return [b, ss[1], ''];
        a += ss[2];
        return [b, ss[1], a];
    }
    WUX.divide = divide;
    function str(a) {
        if (a instanceof WComponent) {
            var wcdn = a.name;
            var wcid = a.id;
            if (!wcdn)
                wcdn = 'WComponent';
            if (!wcid)
                return wcdn;
            return wcdn + '(' + wcid + ')';
        }
        if (a instanceof jQuery) {
            if (a.length) {
                var id = a.attr("id") ? ' id=' + a.attr("id") : '';
                return a.selector ? '$("' + a.selector + '")' : '$(<' + a.prop("tagName") + id + '>)';
            }
            else {
                return '$("' + a.selector + '").length=0';
            }
        }
        if (typeof a == 'object')
            return JSON.stringify(a);
        return a + '';
    }
    WUX.str = str;
    function getTagName(c) {
        if (!c)
            return '';
        if (c instanceof WComponent) {
            var r = c.rootTag;
            if (r)
                return r.toLowerCase();
            var root = c.getRoot();
            if (!root)
                return WUX.getTagName(root);
            return '';
        }
        else if (c instanceof jQuery) {
            if (c.length) {
                var r = c.prop("tagName");
                if (r)
                    return ('' + r).toLowerCase();
                return '';
            }
        }
        else {
            var s = '' + c;
            if (s.charAt(0) == '<') {
                var e = s.indexOf(' ');
                if (e < 0)
                    e = s.indexOf('>');
                if (e > 0) {
                    var r = s.substring(1, e).toLowerCase();
                    if (r.charAt(r.length - 1) == '/')
                        return r.substring(0, r.length - 1);
                    return r;
                }
                return '';
            }
            else if (s.charAt(0) == '#') {
                return WUX.getTagName($(s));
            }
            return WUX.getTagName($('#' + s));
        }
        return '';
    }
    WUX.getTagName = getTagName;
    function match(i, o) {
        if (!o)
            return !i;
        if (i == null)
            return typeof o == 'string' ? o == '' : !o.id;
        if (typeof i == 'object')
            return typeof o == 'string' ? o == i.id : o.id == i.id;
        return typeof o == 'string' ? o == i : o.id == i;
    }
    WUX.match = match;
    function hashCode(a) {
        if (!a)
            return 0;
        var s = '' + a;
        var h = 0, l = s.length, i = 0;
        if (l > 0)
            while (i < l)
                h = (h << 5) - h + s.charCodeAt(i++) | 0;
        return h;
    }
    WUX.hashCode = hashCode;
    function styleObj(ws) {
        var s = style(ws);
        var r = {};
        if (!s)
            return r;
        var kvs = s.split(';');
        for (var _i = 0, kvs_1 = kvs; _i < kvs_1.length; _i++) {
            var kv = kvs_1[_i];
            var akv = kv.split(':');
            if (akv.length < 2)
                continue;
            r[akv[0].trim()] = akv[1].trim();
        }
        return r;
    }
    WUX.styleObj = styleObj;
    function style(ws) {
        var s = '';
        if (!ws)
            return s;
        if (typeof ws == 'string') {
            if (ws.indexOf(':') <= 0)
                return '';
            if (ws.charAt(ws.length - 1) != ';')
                return ws + ';';
            return ws;
        }
        if (ws.s)
            s += css(ws.s);
        if (ws.fs)
            s += 'font-style:' + ws.fs + ';';
        if (ws.fw)
            s += 'font-weight:' + ws.fw + ';';
        if (ws.tt)
            s += 'text-transform:' + ws.tt + ';';
        if (ws.tr)
            s += 'transform:' + ws.tr + ';';
        if (ws.fl)
            s += 'float:' + ws.fl + ';';
        if (ws.cl)
            s += 'clear:' + ws.cl + ';';
        if (ws.a)
            s += 'text-align:' + ws.a + ';';
        if (ws.c)
            s += 'color:' + ws.c + ';';
        if (ws.v)
            s += 'vertical-align:' + ws.v + ';';
        if (ws.d)
            s += 'display:' + ws.d + ';';
        if (ws.z)
            s += 'z-index:' + ws.z + ';';
        if (ws.lh)
            s += 'line-height:' + ws.lh + ';';
        if (ws.ps)
            s += 'position:' + ws.ps + ';';
        if (ws.o)
            s += 'overflow:' + ws.o + ';';
        if (ws.ox)
            s += 'overflow-x:' + ws.ox + ';';
        if (ws.oy)
            s += 'overflow-y:' + ws.oy + ';';
        if (ws.op != null)
            s += 'opacity:' + ws.op + ';';
        if (ws.ol != null)
            s += 'outline:' + ws.ol + ';';
        if (ws.cr)
            s += 'cursor:' + ws.cr + ';';
        if (ws.cn)
            s += 'content:' + ws.cn + ';';
        if (ws.k && ws.k.indexOf(':') > 0)
            s += ws.k.charAt(0) == '-' ? '-webkit' + ws.k + ';' : '-webkit-' + ws.k + ';';
        if (ws.k && ws.k.indexOf(':') > 0)
            s += ws.k.charAt(0) == '-' ? '-moz' + ws.k + ';' : '-moz-' + ws.k + ';';
        if (ws.k && ws.k.indexOf(':') > 0)
            s += ws.k.charAt(0) == '-' ? '-o' + ws.k + ';' : '-o-' + ws.k + ';';
        if (ws.k && ws.k.indexOf(':') > 0)
            s += ws.k.charAt(0) == '-' ? '-ms' + ws.k + ';' : '-ms-' + ws.k + ';';
        if (ws.bs)
            s += 'box-shadow:' + ws.bs + ';';
        if (ws.bz)
            s += 'box-sizing:' + ws.bz + ';';
        if (ws.b)
            s += ws.b.indexOf(':') > 0 ? css('border' + ws.b) : ws.b.match(/^(|none|inherit|initial|unset)$/) ? 'border:' + ws.b + ';' : ws.b.indexOf(' ') > 0 ? 'border:' + ws.b + ';' : 'border:1px solid ' + ws.b + ';';
        if (ws.bc)
            s += 'border-collapse:' + ws.bc + ';';
        if (ws.br != null)
            s += typeof ws.br == 'number' ? 'border-radius:' + ws.br + 'px;' : 'border-radius:' + ws.br + ';';
        if (ws.bsp != null)
            s += typeof ws.bsp == 'number' ? 'border-spacing:' + ws.bsp + 'px;' : 'border-spacing:' + ws.bsp + ';';
        if (ws.m != null)
            s += typeof ws.m == 'number' ? 'margin:' + ws.m + 'px;' : ws.m.indexOf(':') > 0 ? css('margin' + ws.m) : 'margin:' + ws.m + ';';
        if (ws.mt != null)
            s += typeof ws.mt == 'number' ? 'margin-top:' + ws.mt + 'px;' : 'margin-top:' + ws.mt + ';';
        if (ws.mr != null)
            s += typeof ws.mr == 'number' ? 'margin-right:' + ws.mr + 'px;' : 'margin-right:' + ws.mr + ';';
        if (ws.mb != null)
            s += typeof ws.mb == 'number' ? 'margin-bottom:' + ws.mb + 'px;' : 'margin-bottom:' + ws.mb + ';';
        if (ws.ml != null)
            s += typeof ws.ml == 'number' ? 'margin-left:' + ws.ml + 'px;' : 'margin-left:' + ws.ml + ';';
        if (ws.p != null)
            s += typeof ws.p == 'number' ? 'padding:' + ws.p + 'px;' : ws.p.indexOf(':') > 0 ? css('padding' + ws.p) : 'padding:' + ws.p + ';';
        if (ws.pt != null)
            s += typeof ws.pt == 'number' ? 'padding-top:' + ws.pt + 'px;' : 'padding-top:' + ws.pt + ';';
        if (ws.pr != null)
            s += typeof ws.pr == 'number' ? 'padding-right:' + ws.pr + 'px;' : 'padding-right:' + ws.pr + ';';
        if (ws.pb != null)
            s += typeof ws.pb == 'number' ? 'padding-bottom:' + ws.pb + 'px;' : 'padding-bottom:' + ws.pb + ';';
        if (ws.pl != null)
            s += typeof ws.pl == 'number' ? 'padding-left:' + ws.pl + 'px;' : 'padding-left:' + ws.pl + ';';
        if (ws.f != null)
            s += typeof ws.f == 'number' ? 'font-size:' + ws.f + 'px;' : ws.f.indexOf(':') > 0 ? css('font' + ws.f) : 'font-size:' + ws.f + ';';
        if (ws.bg)
            s += ws.bg.indexOf(':') > 0 ? css('background' + ws.bg) : ws.bg.indexOf('url') >= 0 ? 'background:' + ws.bg + ';' : 'background-color:' + ws.bg + ';';
        if (ws.bgi)
            s += 'background-image:' + ws.bgi + ';';
        if (ws.bgp)
            s += 'background-position:' + ws.bgp + ';';
        if (ws.bgr)
            s += 'background-repeat:' + ws.bgr + ';';
        if (ws.text)
            s += ws.text.indexOf(':') > 0 ? css('text' + ws.text) : 'text-decoration:' + ws.text + ';';
        if (ws.l != null)
            s += typeof ws.l == 'number' ? 'left:' + ws.l + 'px;' : 'left:' + ws.l + ';';
        if (ws.r != null)
            s += typeof ws.r == 'number' ? 'right:' + ws.r + 'px;' : 'right:' + ws.r + ';';
        if (ws.t != null)
            s += typeof ws.t == 'number' ? 'top:' + ws.t + 'px;' : 'top:' + ws.t + ';';
        if (ws.bt != null)
            s += typeof ws.bt == 'number' ? 'bottom:' + ws.bt + 'px;' : 'bottom:' + ws.bt + ';';
        if (ws.w)
            s += typeof ws.w == 'number' ? 'width:' + ws.w + 'px;' : 'width:' + ws.w + ';';
        if (ws.h)
            s += typeof ws.h == 'number' ? 'height:' + ws.h + 'px;' : 'height:' + ws.h + ';';
        if (ws.minw)
            s += typeof ws.minw == 'number' ? 'min-width:' + ws.minw + 'px;' : 'min-width:' + ws.minw + ';';
        if (ws.maxw)
            s += typeof ws.maxw == 'number' ? 'max-width:' + ws.maxw + 'px;' : 'max-width:' + ws.maxw + ';';
        if (ws.minh)
            s += typeof ws.minh == 'number' ? 'min-height:' + ws.minh + 'px;' : 'min-height:' + ws.minh + ';';
        if (ws.maxh)
            s += typeof ws.maxh == 'number' ? 'max-height:' + ws.maxh + 'px;' : 'max-height:' + ws.maxh + ';';
        if (ws.ws)
            s += 'white-space:' + ws.ws + ';';
        return s;
    }
    WUX.style = style;
    function addStyle(s, k, v, n) {
        if (!k || !v)
            return css(s);
        if (!s)
            return k + ':' + v + ';';
        if (n) {
            if (s.indexOf(k + ':') >= 0)
                return css(s);
            return css(s) + k + ':' + v + ';';
        }
        return css(s) + k + ':' + v + ';';
    }
    WUX.addStyle = addStyle;
    function css() {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        if (!a || a.length == 0)
            return '';
        var s = '';
        var x = {};
        var xi = true;
        for (var i = 0; i < a.length; i++) {
            var e = a[i];
            if (!e)
                continue;
            if (typeof e != 'string') {
                $.extend(x, e);
                xi = false;
                continue;
            }
            if (!xi) {
                s += style(x);
                x = {};
                xi = true;
            }
            if (e.indexOf(':') > 0) {
                s += e;
                if (e.charAt(e.length - 1) != ';')
                    s += ';';
            }
        }
        if (!xi)
            s += style(x);
        return s;
    }
    WUX.css = css;
    function cls() {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        if (!a || !a.length)
            return '';
        var s = '';
        for (var i = 0; i < a.length; i++) {
            var e = a[i];
            if (!e)
                continue;
            var se = typeof e == 'string' ? e : e.n;
            if (!se)
                continue;
            if (se.indexOf(':') > 0)
                continue;
            s += se + ' ';
        }
        return s.trim();
    }
    WUX.cls = cls;
    function attributes(a) {
        if (!a)
            return '';
        if (typeof a == 'string')
            return a;
        if (typeof a == 'object') {
            var r = '';
            for (var k in a)
                r += k + '="' + a[k] + '" ';
            return r.trim();
        }
        return '';
    }
    WUX.attributes = attributes;
    function ul(css) {
        var a = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            a[_i - 1] = arguments[_i];
        }
        if (!a || !a.length)
            return '';
        var s = css ? '<ul' + buildCss(css) + '>' : '<ul>';
        for (var i = 0; i < a.length; i++) {
            var e = a[i];
            if (e == null)
                continue;
            s += '<li>' + e + '</li>';
        }
        s += '</ul>';
        return s;
    }
    WUX.ul = ul;
    function ol(css, start) {
        var a = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            a[_i - 2] = arguments[_i];
        }
        if (!a || !a.length)
            return '';
        var s = '';
        if (start != null) {
            s = css ? '<ol' + buildCss(css) + ' start="' + start + '">' : '<ol start="' + start + '">';
        }
        else {
            s = css ? '<ol' + buildCss(css) + '>' : '<ol>';
        }
        for (var i = 0; i < a.length; i++) {
            var e = a[i];
            if (e == null)
                continue;
            s += '<li>' + e + '</li>';
        }
        s += '</ol>';
        return s;
    }
    WUX.ol = ol;
    function buildCss() {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        if (!a || !a.length)
            return '';
        var c = cls.apply(void 0, a);
        var s = css.apply(void 0, a);
        var r = '';
        if (c)
            r += ' class="' + c + '"';
        if (s)
            r += ' style="' + s + '"';
        return r;
    }
    WUX.buildCss = buildCss;
    function removeClass(css, name) {
        if (!css || !name)
            return css;
        var classes = css.split(' ');
        var r = '';
        for (var _i = 0, classes_1 = classes; _i < classes_1.length; _i++) {
            var c = classes_1[_i];
            if (c == name)
                continue;
            r += c + ' ';
        }
        return r.trim();
    }
    WUX.removeClass = removeClass;
    function toggleClass(css, name) {
        if (!css || !name)
            return css;
        var classes = css.split(' ');
        var f = false;
        var r = '';
        for (var _i = 0, classes_2 = classes; _i < classes_2.length; _i++) {
            var c = classes_2[_i];
            if (c == name) {
                f = true;
                continue;
            }
            r += c + ' ';
        }
        if (!f)
            return r.trim() + ' ' + name;
        return r.trim();
    }
    WUX.toggleClass = toggleClass;
    function setCss(e) {
        var a = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            a[_i - 1] = arguments[_i];
        }
        if (!e || !a || !a.length)
            return e;
        if (e instanceof WComponent) {
            e.css.apply(e, a);
        }
        else if (e instanceof jQuery) {
            if (!e.length)
                return e;
            var s = css.apply(void 0, a);
            var c = cls.apply(void 0, a);
            if (c)
                e.addClass(c);
            if (s)
                e.css(styleObj(s));
        }
        return e;
    }
    WUX.setCss = setCss;
    function buildIcon(icon, before, after, size, cls, title) {
        if (!icon)
            return '';
        if (!before)
            before = '';
        if (!after)
            after = '';
        var t = title ? ' title="' + title + '"' : '';
        cls = cls ? ' ' + cls : '';
        if (icon.indexOf('.') > 0)
            return before + '<img src="' + icon + '"' + t + '>' + after;
        if (!size || size < 2)
            return before + '<i class="fa ' + icon + cls + '"' + t + '></i>' + after;
        if (size > 5)
            size = 5;
        return before + '<i class="fa ' + icon + ' fa-' + size + 'x' + cls + '"' + t + '></i>' + after;
    }
    WUX.buildIcon = buildIcon;
    function build(tagName, inner, css, attributes, id, classStyle) {
        if (!tagName)
            tagName = 'div';
        var clsStyle;
        var style;
        if (typeof css == 'string') {
            if (css.indexOf(':') > 0) {
                style = css;
            }
            else {
                clsStyle = css;
            }
        }
        else if (css) {
            if (css.n)
                clsStyle = css.n;
            style = WUX.style(css);
        }
        if (classStyle) {
            if (clsStyle) {
                clsStyle += ' ' + classStyle;
            }
            else {
                clsStyle = classStyle;
            }
        }
        var r = '<' + tagName;
        if (id)
            r += ' id="' + id + '"';
        if (clsStyle)
            r += ' class="' + clsStyle + '"';
        if (style)
            r += ' style="' + style + '"';
        var a = WUX.attributes(attributes);
        if (a)
            r += ' ' + a;
        r += '>';
        var bca = divide(inner);
        r += bca[1];
        if (tagName == 'input')
            return bca[0] + r + bca[2];
        r += '</' + tagName + '>';
        return bca[0] + r + bca[2];
    }
    WUX.build = build;
    function addWrapper(n, w, b, e) {
        if (!n || !w)
            return n;
        var cls = WUX.cls(w.classStyle, w.style);
        var style = WUX.style(w.style);
        var t = w.type ? w.type : 'div';
        var r = '<' + t;
        if (w.id)
            r += ' id="' + w.id + '"';
        if (cls)
            r += ' class="' + cls + '"';
        if (style)
            r += ' style="' + style + '"';
        var a = WUX.attributes(attributes);
        if (a)
            r += ' ' + a;
        if (w.title)
            r += ' title="' + w.title + '"';
        r += '>';
        r += '</' + t + '>';
        var $r = $(r);
        w.element = $r;
        if (b)
            n.append(b);
        n.append($r);
        if (e)
            n.append(e);
        if (w.wrapper)
            return WUX.addWrapper($r, w.wrapper, w.begin, w.end);
        if (w.begin)
            $r.append(w.begin);
        if (w.end)
            $r.append(w.end);
        return $r;
    }
    WUX.addWrapper = addWrapper;
    function val(e, v) {
        if (!e)
            return;
        if (typeof e == 'string') {
            if (e.indexOf('<') >= 0)
                return;
            if (e.indexOf('#') < 0)
                e = '#' + e;
            var c = WUX.getComponent(e);
            if (c) {
                if (v === undefined)
                    return c.getState();
                c.setState(v);
            }
            else {
                if (v === undefined)
                    return $(e).val();
                $(e).val(v);
            }
        }
        else if (e instanceof WComponent) {
            if (v === undefined)
                return e.getState();
            e.setState(v);
        }
        else if (e instanceof jQuery) {
            if (v === undefined)
                return e.val();
            e.val(v);
        }
        else {
            if (v === undefined)
                return $(e).val();
            $(e).val(v);
        }
        return v;
    }
    WUX.val = val;
    function getContainer(e, s) {
        if (s === void 0) { s = 'div'; }
        if (!e)
            return;
        if (typeof e == 'string') {
            if (e.indexOf('<') >= 0)
                return;
            if (e.indexOf('#') < 0)
                e = '#' + e;
            return WUX.getContainer($(e));
        }
        else if (e instanceof WComponent) {
            var $c = e.getContext();
            if ($c) {
                var $r = $c.closest(s);
                if ($r && $r.length)
                    return $r;
            }
            return $c;
        }
        else {
            var $r = e.parent().closest(s);
            if ($r && $r.length)
                return $r;
            return e.parent();
        }
    }
    WUX.getContainer = getContainer;
    function openURL(url, history, newTab, params) {
        if (history === void 0) { history = true; }
        if (newTab === void 0) { newTab = false; }
        if (!url)
            return;
        if (params && typeof params == 'object') {
            var qs = '';
            for (var p in params) {
                if (params.hasOwnProperty(p)) {
                    var v = params[p];
                    qs += '&' + encodeURIComponent(p) + '=' + encodeURIComponent(v);
                }
            }
            if (qs) {
                if (url.indexOf('?') > 0) {
                    url += qs;
                }
                else {
                    url += '?' + qs.substring(1);
                }
            }
        }
        if (newTab) {
            window.open(url, '_blank');
        }
        else if (history) {
            window.location.assign(url);
        }
        else {
            window.location.replace(url);
        }
    }
    WUX.openURL = openURL;
})(WUX || (WUX = {}));
//# sourceMappingURL=wux.base.js.map