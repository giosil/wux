var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
//# sourceMappingURL=wux.js.map