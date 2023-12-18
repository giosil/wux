/** 
    WRAPPED USER EXPERIENCE - WUX
*/
if (typeof jQuery === 'undefined') throw new Error('WUX requires jQuery');
+function ($) {
    $.fn.wuxComponent = function (c?: WUX.WComponent | boolean): WUX.WComponent {
        let wc = (this as JQuery).data('wuxComponent');
        if (wc) return wc;
        if (c instanceof WUX.WComponent) {
            (this as JQuery).data('wuxComponent', c);
            return c;
        }
        if (c == null) c = true;
        if (!c) return undefined;
        wc = new WUX.WComponent(this as JQuery);
        (this as JQuery).data('wuxComponent', wc);
        return wc;
    }
}(jQuery);
declare interface JQuery {
    wuxComponent(createIfNotExists?: boolean): WUX.WComponent;
    wuxComponent(component?: WUX.WComponent): WUX.WComponent;
}
class WuxDOM {
    private static onRenderHandlers: ((e: WUX.WEvent) => any)[] = [];
    static onRender(handler: (e: WUX.WEvent) => any) {
        WuxDOM.onRenderHandlers.push(handler);
    }
    private static onUnmountHandlers: ((e: WUX.WEvent) => any)[] = [];
    static onUnmount(handler: (e: WUX.WEvent) => any) {
        WuxDOM.onUnmountHandlers.push(handler);
    }
    private static lastCtx: JQuery;

    static render(component: WUX.WElement, node?: WUX.WNode, before?: (n?: WUX.WNode) => any, after?: (n?: WUX.WNode) => any): void {
        if (WUX.debug) console.log('WuxDOM.render ' + WUX.str(component) + ' on ' + WUX.str(node) + '...');
        $(document).ready(() => {
            WUX.global.init(() => {
                if (!node) node = WuxDOM.lastCtx ? WuxDOM.lastCtx : $('#view-root');
                if (before) before(node);
                let context = WuxDOM.mount(component, node);
                WuxDOM.lastCtx = context;
                if (after) after(node);
                if (WuxDOM.onRenderHandlers.length > 0) {
                    let c: WUX.WComponent = component instanceof WUX.WComponent ? component : null;
                    let e: WUX.WEvent = { component: c, element: context, target: context.get(0), type: 'render' };
                    for (let handler of WuxDOM.onRenderHandlers) handler(e);
                    WuxDOM.onRenderHandlers = [];
                }
            })
        });
    }
    static mount(e: WUX.WElement, node?: WUX.WNode): JQuery {
        if (!node) node = WuxDOM.lastCtx ? WuxDOM.lastCtx : $('#view-root');
        if (WUX.debug) console.log('WuxDOM.mount ' + WUX.str(e) + ' on ' + WUX.str(node) + '...');
        if (e == null) {
            console.error('WuxDOM.mount ' + WUX.str(e) + ' on ' + WUX.str(node) + ' -> invalid component');
            return;
        }
        let ctx: JQuery;
        if(typeof node == 'string') {
          if(node[0] != '#') {
            ctx = $('#' + node);
            if (!ctx.length) ctx = $(node);
          }
          else {
            ctx = $(node)
          }
        }
        else {
          ctx = node;
        }
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
        if (WUX.debug) console.log('WuxDOM.mount ' + WUX.str(e) + ' on ' + WUX.str(node) + ' completed.');
        return ctx;
    };
    static unmount(node?: WUX.WNode): JQuery {
        if (!node) node = WuxDOM.lastCtx ? WuxDOM.lastCtx : $('#view-root');
        if (WUX.debug) console.log('WuxDOM.unmount ' + WUX.str(node) + '...');
        let ctx: JQuery;
        if(typeof node == 'string') {
          if(node[0] != '#') {
            ctx = $('#' + node);
            if (!ctx.length) ctx = $(node);
          }
          else {
            ctx = $(node)
          }
        }
        else {
          ctx = node;
        }
        if (!ctx.length) {
            console.error('WuxDOM.unmount ' + WUX.str(node) + ' -> node unavailable');
            return;
        }
        let wcomp = ctx.wuxComponent(false);
        if (wcomp) wcomp.unmount();
        ctx.html('');
        if (WUX.debug) console.log('WuxDOM.unmount ' + WUX.str(node) + ' completed.');
        if (WuxDOM.onUnmountHandlers.length > 0) {
            let e: WUX.WEvent = { component: wcomp, element: ctx, target: ctx.get(0), type: 'unmount' };
            for (let handler of WuxDOM.onUnmountHandlers) handler(e);
            WuxDOM.onUnmountHandlers = [];
        }
        return ctx;
    }
    static replace(o: WUX.WElement, e?: WUX.WElement): JQuery {
        let node: JQuery;
        if (!e) {
            e = o;
            o = undefined;
        }
        if (!o) {
            node = WuxDOM.unmount();
        }
        else if (typeof o == 'string') {
            let wcomp = WUX.getComponent(o);
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
            if (node) node.html('');
        }
        if (!node) node = $('#view-root');
        if (!node.length) {
            console.error('WuxDOM.replace ' + WUX.str(node) + ' -> node unavailable');
            return;
        }
        return WuxDOM.mount(e, node);
    }
}
// WUX Base
namespace WUX {

    export type WElement = string | JQuery | WComponent;

    export type WNode = string | JQuery;

    export let debug: boolean = false;

    export let registry: string[] = [];

    export const version = '1.0.0';

    /** Global settings */
    export interface WGlobal {
        /** Locale setting */
        locale: string;
        /** Default class or container of row / col. */
        main_class: string;
        con_class: string;
        /** Box settings */
        box_class: string;
        box_header: string;
        box_title: string;
        box_content: string;
        box_tools: string;
        box_footer: string;
        /** Charts settings */
        chart_bg0: string;
        chart_bg1: string;
        chart_bg2: string;
        chart_bc0: string;
        chart_bc1: string;
        chart_bc2: string;
        chart_p0: string;
        chart_p1: string;
        chart_p2: string;
        /** Section settings */
        area: string | WStyle;
        area_title: string | WStyle;
        /** Section settings */
        section: string | WStyle;
        section_title: string | WStyle;
        /** Window settings */
        window_top: string | WStyle;
        window_bottom: string | WStyle;
        /** Global init function */
        init(callback: () => any);
        /** Shared data */
        setData(key: string, data: any, dontTrigger?: boolean): void;
        getData(key: string, def?: any): any;
        onDataChanged(key: string, callback: (data: any) => any);
    }

    /** Event interface */
    export interface WEvent {
        component: WComponent;
        element: JQuery
        target: any;
        type: string;
        data?: any;
    }

    /**
     * Base class of a WUX component.
     */
    export class WComponent<P = any, S = any> {
        // Base public attributes
        id: string;
        name: string;
        mounted: boolean = false;
        parent: WComponent;
        debug: boolean = WUX.debug;
        forceOnChange: boolean = false;
        data: any;
        cuid: number;
        rootTag = 'div';

        // Internal attributes
        protected context: JQuery;
        protected root: JQuery;
        protected internal: WComponent;
        protected props: P;
        protected state: S;
        protected subSeq = 0;
        protected dontTrigger = false;

        // View attributes
        protected _visible: boolean = true;
        protected _enabled: boolean = true;
        protected _style: string;
        protected _baseStyle: string;
        protected _classStyle: string;
        protected _baseClass: string;
        protected _attributes: string;
        protected _tooltip: string;

        // Event handlers
        protected handlers: { [event: string]: ((e?: any) => any)[] } = {};

        constructor(jq?: JQuery);
        constructor(id?: string, name?: string, props?: P, classStyle?: string, style?: string | WStyle, attributes?: string | object);
        constructor(id?: string | JQuery, name?: string, props?: P, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
            this.cuid = Math.floor(Math.random() * 1000000000);
            if (id instanceof jQuery) {
                this.root = id as JQuery;
                if (this.root && this.root.length) this.mounted = true;
                if (this.debug) console.log('[' + str(this) + '] new wrapper root=' + str(this.root));
            }
            else {
                if (typeof id == 'string') this.id = id == '*' ? 'w' + this.cuid : id;
                this.name = name ? name : 'WComponent';
                // Do not use WUX.cls(classStyle, style): it never returns undefined.
                this._classStyle = classStyle;
                let cls = WUX.cls(style);
                if (cls) this._classStyle = this._classStyle ? this._classStyle + ' ' + cls : cls;
                this._style = WUX.style(style);
                this._attributes = WUX.attributes(attributes);
                if (this.debug) console.log('[' + str(this) + '] new');

                if (this.debug) console.log('[' + str(this) + '] updateProps', props);
                this.updateProps(props);
            }
        }

        get visible(): boolean {
            if (this.internal) return this.internal.visible;
            return this._visible;
        }
        set visible(b: boolean) {
            this._visible = b;
            if (this.internal) this.internal.visible = b;
            if (this.root && this.root.length) {
                if (this._visible) this.root.show(); else this.root.hide();
            }
        }
        get enabled(): boolean {
            if (this.internal) return this.internal.enabled;
            return this._enabled;
        }
        set enabled(b: boolean) {
            this._enabled = b;
            if (this.internal) this.internal.enabled = b;
            if (this.root && this.root.length) this.root.prop('disabled', !this._enabled);
        }
        get style(): string {
            if (this.internal) return this.internal.style;
            return this._style;
        }
        set style(s: string) {
            this._style = WUX.css(this._baseStyle, s);
            if (this.internal) this.internal.style = s;
            if (this.root && this.root.length) this.root.attr('style', this._style);
        }
        get classStyle(): string {
            if (this.internal) return this.internal.classStyle;
            return this._classStyle;
        }
        set classStyle(s: string) {
            if (this.internal) this.internal.classStyle = s;
            let remove = false;
            let toggle = false;
            if (s && s.length > 1 && s.charAt(0) == '!') {
                s = s.substring(1)
                remove = true;
            }
            else if (s && s.length > 1 && s.charAt(0) == '?') {
                s = s.substring(1)
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
        }
        get attributes(): string {
            if (this.internal) return this.internal.attributes;
            return this._attributes;
        }
        set attributes(s: string) {
            this._attributes = s;
            if (this.internal) this.internal.attributes = s;
        }
        get tooltip(): string {
            if (this.internal) return this.internal.tooltip;
            return this._tooltip;
        }
        set tooltip(s: string) {
            this._tooltip = s;
            if (this.internal) this.internal.tooltip = s;
            if (this.root && this.root.length) this.root.attr('title', this._tooltip);
        }

        css(...items: (string | WStyle)[]): this {
            if (!items || items.length == 0) return this;
            let c = cls(...items);
            if (c) this.classStyle = c;
            let s = css(...items);
            if (s) this.style = s;
            return this;
        }

        focus(): this {
            if (this.internal) this.internal.focus();
            if (this.root && this.root.length) this.root.focus();
            return this;
        }

        blur(): this {
            if (this.internal) this.internal.blur();
            if (this.root && this.root.length) this.root.blur();
            return this;
        }

        forceUpdate(callback?: () => any): this {
            this.update(this.props, this.state, false, false, true, callback);
            return this;
        }

        getContext(): JQuery {
            return this.context;
        }
        getRoot(): JQuery {
            if (!this.root && this.internal) return this.internal.getRoot();
            if (!this.root) {
                if (this.id) {
                    let $id = $('#' + this.id);
                    if ($id.length) return $id;
                }
                return this.context;
            }
            return this.root;
        }

        getState(): S {
            return this.state;
        }
        setState(nextState: S, force?: boolean, callback?: () => any): this {
            if (this.debug) console.log('[' + str(this) + '] setState', nextState);
            this.update(this.props, nextState, false, true, this.forceOnChange || force, callback);
            return this;
        }

        getProps(): P {
            return this.props;
        }
        setProps(nextProps: P, force?: boolean, callback?: () => any): this {
            if (this.debug) console.log('[' + str(this) + '] setProps', nextProps);
            this.update(nextProps, this.state, true, false, this.forceOnChange || force, callback);
            return this;
        }

        on(events: 'mount' | 'unmount' | 'statechange' | 'propschange', handler: (e: WEvent) => any): this;
        on(events: 'click' | 'dblclick' | 'mouseenter' | 'mouseleave' | 'keypress' | 'keydown' | 'keyup' | 'submit' | 'change' | 'focus' | 'blur' | 'resize', handler: (e: JQueryEventObject) => any): this;
        on(events: string, handler: (e: any) => any): this;
        on(events: string, handler: (e: any) => any): this {
            if (!events) return this;
            let arrayEvents = events.split(' ');
            for (let event of arrayEvents) {
                if (!this.handlers[event]) this.handlers[event] = [];
                this.handlers[event].push(handler);
            }
            if (this.internal) this.internal.on(events, handler);
            if (this.root && this.root.length) this.root.on(events, handler);
            return this;
        }

        off(events?: 'mount' | 'unmount' | 'statechange' | 'propschange'): this;
        off(events?: 'click' | 'dblclick' | 'mouseenter' | 'mouseleave' | 'keypress' | 'keydown' | 'keyup' | 'submit' | 'change' | 'focus' | 'blur' | 'resize'): this;
        off(events?: string): this;
        off(events?: string): this {
            if (!events) {
                this.handlers = {};
            }
            else {
                let arrayEvents = events.split(' ');
                for (let event of arrayEvents) delete this.handlers[event];
            }
            if (this.internal) this.internal.off(events);
            if (this.root && this.root.length) this.root.off(events);
            return this;
        }

        trigger(eventType: 'mount' | 'unmount', data?: any): this;
        trigger(eventType: 'statechange', nextState?: S): this;
        trigger(eventType: 'propschange', nextProps?: P): this;
        trigger(eventType: 'click' | 'dblclick' | 'mouseenter' | 'mouseleave' | 'keypress' | 'keydown' | 'keyup' | 'blur' | 'submit' | 'change' | 'focus' | 'resize', ...extraParameters: any[]): this;
        trigger(eventType: string, ...extParams: any[]): this;
        trigger(eventType: string, ...extParams: any[]): this {
            if (this.debug) console.log('[' + str(this) + '] trigger', eventType, extParams);
            if (!eventType) return;
            let ep0 = extParams && extParams.length > 0 ? extParams[0] : undefined;
            if (eventType.charAt(0) == '_' || eventType == 'mount' || eventType == 'unmount' || eventType == 'statechange' || eventType == 'propschange') {
                if (ep0 !== undefined) {
                    if (eventType == 'statechange') {
                        if (this.state != extParams[0]) {
                            this.state = extParams[0];
                            if (this.debug) console.log('[' + str(this) + '] trigger set state', this.state);
                        }
                    }
                    else if (eventType == 'propschange') {
                        if (this.props != extParams[0]) {
                            this.props = extParams[0];
                            if (this.debug) console.log('[' + str(this) + '] trigger set props', this.props);
                        }
                    }
                }
                if (!this.handlers || !this.handlers[eventType]) return this;
                let event = this.createEvent(eventType, ep0);
                for (let handler of this.handlers[eventType]) handler(event);
            }
            else if (this.root && this.root.length) {
                if (this.debug) console.log('[' + str(this) + '] trigger ' + eventType + ' on root=' + str(this.root));
                this.root.trigger(eventType, ...extParams);
            }
            if (this.internal) {
                if (this.debug) console.log('[' + str(this) + '] trigger ' + eventType + ' on internal=' + str(this.internal));
                this.internal.trigger(eventType, ...extParams);
            }
            return this;
        }

        unmount(): this {
            if (this.debug) console.log('[' + str(this) + '] unmount ctx=' + str(this.context) + ' root=' + str(this.root), this.state, this.props);
            this.componentWillUnmount();
            if (this.internal) this.internal.unmount();
            this.internal = undefined;
            if (this.root && this.root.length) this.root.remove();
            this.root = undefined;
            if (this.id) {
                let idx = registry.indexOf(this.id);
                if (idx >= 0) registry.splice(idx, 1);
            }
            this.mounted = false;
            this.trigger('unmount');
            return this;
        }

        mount(context?: JQuery): this {
            if (this.debug) console.log('[' + str(this) + '] mount ctx=' + str(context) + ' root=' + str(this.root), this.state, this.props);
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
                    if (!this.context) this.context = this.root;
                }
            }
            try {
                if (this.mounted) this.unmount();
                this.mounted = false;
                if (!(this.context && this.context.length)) {
                    let $id = $('#' + this.id);
                    if ($id.length) this.context = $id;
                }
                if (this.debug) console.log('[' + str(this) + '] componentWillMount ctx=' + str(context) + ' root=' + str(this.root));
                this.componentWillMount();
                if (this.context && this.context.length) {
                    if (this.debug) console.log('[' + str(this) + '] render ctx=' + str(context) + ' root=' + str(this.root));
                    let r = this.render();
                    if (r !== undefined && r !== null) {
                        if (r instanceof WComponent) {
                            if (this.debug) console.log('[' + str(this) + '] render -> ' + str(r));
                            this.internal = r;
                            if (!r.parent) r.parent = this;
                            r.mount(this.context);
                            if (!this.root) {
                                if (this.id) {
                                    let $id = $('#' + this.id);
                                    this.root = $id.length ? $id : this.internal.getRoot();
                                }
                                else {
                                    this.root = this.context;
                                }
                            }
                        }
                        else
                        if (r instanceof jQuery) {
                            this.context.append(r);
                            if (!this.root) this.root = r as JQuery;
                        }
                        else {
                            let [b, $r, a] = parse(r);
                            if (b) this.context.append(b);
                            this.context.append($r);
                            if (a) this.context.append(a);
                            if (!this.root) this.root = this.id ? $('#' + this.id) : $r;
                        }
                    }
                    else {
                        if (this.internal) this.internal.mount(this.context);
                        if (!this.root) this.root = this.id ? $('#' + this.id) : this.context;
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
                if (this.debug) console.log('[' + str(this) + '] componentDidMount ctx=' + str(context) + ' root=' + str(this.root));
                this.componentDidMount();
                if (this.root && this.root.length) {
                    for (let event in this.handlers) {
                        if (!event || event.charAt(0) == '_') continue;
                        if (event == 'mount' || event == 'unmount' || event == 'statechange' || event == 'propschange') continue;
                        for (let handler of this.handlers[event]) {
                            this.root.on(event, handler);
                        }
                    }
                }
                this.root.wuxComponent(this);
                this.mounted = true;
                if (this.id) {
                    if (!this.internal || this.internal.id != this.id) {
                        let idx = registry.indexOf(this.id);
                        if (idx >= 0) {
                            let wci = WUX.getComponent(this.id);
                            if (wci && wci.cuid != this.cuid) {
                                console.error('[' + str(this) + '] id already used by ' + str(wci));
                            }
                        }
                        else {
                            registry.push(this.id);
                        }
                    }
                }
                this.trigger('mount');
            }
            catch (e) {
                let errorInfo = str(this) + ' ' + str(this.context);
                console.error('[' + str(this) + '] mount error ' + errorInfo, e);
                this.componentDidCatch(e, errorInfo);
            }
            return this;
        }

        componentWillUnmount(): void {
        }

        protected componentWillMount(): void {
        }

        protected render(): any {
            return this.buildRoot(this.rootTag);
        }

        protected componentDidMount(): void {
        }

        protected componentDidCatch?(error: Error, errorInfo: string): void {
        }

        protected shouldComponentUpdate(nextProps: P, nextState: S): boolean {
            if (typeof nextProps == 'object' || typeof nextState == 'object') return true;
            return this.props != nextProps || this.state != nextState;
        }

        protected componentWillUpdate(nextProps: P, nextState: S): void {
        }

        protected componentDidUpdate(prevProps: P, prevState: S): void {
        }

        protected updateProps(nextProps: P): void {
            this.props = nextProps;
        }

        protected updateState(nextState: S): void {
            this.state = nextState;
        }

        protected update(nextProps: P, nextState: S, propsChange: boolean, stateChange: boolean, force: boolean = false, callback?: () => any): boolean {
            if (this.debug) console.log('[' + str(this) + '] update', nextProps, nextState, 'propsChange=' + propsChange + ',stateChange=' + stateChange + ',force=' + force);
            nextProps = nextProps === undefined ? this.props : nextProps;
            let prevProps = this.props;
            let prevState = this.state;
            this.dontTrigger = false;
            if (this.mounted) {
                if (force || this.shouldComponentUpdate(nextProps, nextState)) {
                    try {
                        if (this.debug) console.log('[' + str(this) + '] componentWillUpdate', nextProps, nextState);
                        this.componentWillUpdate(nextProps, nextState);

                        if (propsChange) {
                            if (this.debug) console.log('[' + str(this) + '] updateProps', nextProps);
                            this.updateProps(nextProps);
                        }
                        if (stateChange) {
                            if (this.debug) console.log('[' + str(this) + '] updateState', nextState);
                            this.updateState(nextState);
                        }

                        if (force) this.mount();

                        if (this.debug) console.log('[' + str(this) + '] componentDidUpdate', prevProps, prevState);
                        this.componentDidUpdate(prevProps, prevState);

                        if (propsChange && !this.dontTrigger) this.trigger('propschange');
                        if (stateChange && !this.dontTrigger) this.trigger('statechange');
                    }
                    catch (e) {
                        this.componentDidCatch(e, str(this) + '|' + str(this.context));
                        return false;
                    }
                    if (callback) callback();
                }
            }
            else {
                if (propsChange) {
                    if (this.debug) console.log('[' + str(this) + '] updateProps', nextProps);
                    this.updateProps(nextProps);
                    if (!this.dontTrigger) this.trigger('propschange');
                }
                if (stateChange) {
                    if (this.debug) console.log('[' + str(this) + '] updateState', nextState);
                    this.updateState(nextState);
                    if (!this.dontTrigger) this.trigger('statechange');
                }
            }
            return true;
        }

        protected createEvent(type: string, data?: any): WEvent {
            let target = this.root && this.root.length ? this.root.get(0) : this.root;
            return { component: this, element: this.root, target: target, type: type, data: data };
        }

        protected shouldBuildRoot(): boolean {
            if (this.internal) return false;
            if (this.root && this.root.length) return false;
            if (this.context && this.context.length) {
                let ctxId = this.context.attr('id');
                if (!ctxId && ctxId == this.id) return false;
            }
            return true;
        }

        protected buildRoot(tagName?: string, inner?: string, baseAttribs?: string | object, classStyle?: string, style?: string, attributes?: string | object, id?: string): string {
            if (this.debug) console.log('[' + str(this) + '] buildRoot', tagName, inner, baseAttribs, classStyle, style, attributes, id);
            if (!this.shouldBuildRoot()) {
                if (this.debug) console.log('[' + str(this) + '] shouldBuildRoot() -> false');
                return undefined;
            }
            else {
                if (this.debug) console.log('[' + str(this) + '] shouldBuildRoot() -> true');
            }
            return this.build(tagName, inner, baseAttribs, classStyle, style, attributes, id);
        }

        protected build(tagName?: string, inner?: string, baseAttribs?: string | object, classStyle?: string, style?: string, attributes?: string | object, id?: string): string {
            if (!tagName) tagName = 'div';
            if (classStyle === undefined) classStyle = this._classStyle;
            if (style === undefined) style = this._style;
            if (attributes === undefined) attributes = this._attributes;
            if (id === undefined) id = this.id;
            let r = '<' + tagName;
            if (id) r += ' id="' + id + '"';
            if (classStyle) r += ' class="' + classStyle + '"';
            if (style) r += ' style="' + style + '"';
            let a = WUX.attributes(attributes);
            if (a) r += ' ' + a;
            let ba = WUX.attributes(baseAttribs);
            if (ba) r += ' ' + ba;
            r += '>';
            let bca = inner == null ? divide(this.make()) : divide(inner);
            r += bca[1];
            if (tagName == 'input') return bca[0] + r + bca[2];
            r += '</' + tagName + '>';
            return bca[0] + r + bca[2];
        }

        protected make(): string {
            return '';
        }

        subId(wc?: WComponent): string;
        subId(id?: string, s?: any): string;
        subId(id?: string | WComponent, s?: any): string {
            if (id instanceof WComponent) {
                let cid = id.id;
                if (!cid || !this.id) return cid;
                if (cid.indexOf(this.id + '-') != 0) return cid;
                return cid.substring(this.id.length + 1);
            }
            else {
                if (!this.id || this.id == '*') this.id = 'w' + this.cuid;
                if (!id || id == '*') id = (this.subSeq++).toString();
                if (!s && s != 0) return this.id + '-' + id;
                return this.id + '-' + id + '-' + s;
            }
        }

        ripId(sid: string): string {
            if (!sid || !this.id) return sid;
            if (sid.indexOf(this.id) == 0 && sid.length > this.id.length + 1) {
                return sid.substring(this.id.length + 1);
            }
            return sid;
        }

        transferTo(dest: WComponent, force?: boolean, callback?: () => any): boolean {
            if (this.debug) console.log('[' + str(this) + '] transferTo ' + str(dest));
            if (dest) {
                dest.setState(this.getState(), force, callback);
                return true;
            }
            return false;
        }
    }

    export interface WLayoutManager {
        mapConstraints: { [componentId: string]: string };
        mapComponents: { [constraints: string]: WElement };

        addLayoutComponent(component: WElement, constraints?: string): void;
        removeLayoutComponent(component: WElement): void;
        layoutContainer(container: WContainer, root: JQuery): void;
    }

    export interface WEntity {
        id: any;
        text?: string;
        code?: string;
        group?: any;
        type?: any;
        reference?: any;
        enabled?: boolean;
        marked?: boolean;
        date?: Date;
        notBefore?: Date;
        expires?: Date;
        icon?: WIcon | string;
        color?: string;
        value?: number;
    }

    export enum WInputType {
        // Standard input types
        Text = 'text',
        Number = 'number',
        Password = 'password',
        CheckBox = 'checkbox',
        Radio = 'radio',
        Date = 'date',
        DateTime = 'datetime',
        Time = 'time',
        File = 'file',
        Image = 'image',
        Color = 'color',
        Email = 'email',
        Url = 'url',
        Month = 'month',
        Week = 'week',
        Search = 'search',
        Hidden = 'hidden',
        // Extended
        Note = 'note',
        Select = 'select',
        Static = 'static',
        Component = 'component',
        Blank = 'blank',
        Link = 'link',
        Integer = 'integer',
        TreeSelect = 'tree'
    }

    export interface WWrapper {
        id?: string;
        type?: string;
        classStyle?: string;
        style?: string | WStyle;
        attributes?: string;
        begin?: string;
        wrapper?: WWrapper;
        end?: string;
        title?: string;
        element?: JQuery;
    }

    export interface WField {
        // Base Attributes
        id: string;

        // Attributes
        type?: WInputType;
        label?: string;
        labelCss?: string | WStyle;
        icon?: string | WUX.WIcon;
        placeholder?: string;
        span?: number;
        classStyle?: string;
        style?: string | WStyle;
        attributes?: string;

        // Data
        options?: (string | WEntity)[];
        key?: string;
        value?: any;
        /** 's'=string, 'n'=number, 'p'=percentage, 'c'=currency, 'c5'=currency, 'i'=integer, 'd'=date, 't'=date-time, 'h'=time, 'b'=boolean */
        valueType?: string;
        minValue?: any;
        maxValue?: any;
        size?: number;

        // Implementation
        component?: WComponent;
        element?: JQuery;
        wrapper?: WWrapper;
        build?: (container: JQuery, data: any) => void;

        // Flags
        required?: boolean;
        readonly?: boolean;
        enabled?: boolean;
        visible?: boolean;

        // Handlers
        onmount?: (f: WField) => any;
        onfocus?: (e: JQueryEventObject) => any;
        onblur?: (e: JQueryEventObject) => any;
    }

    export interface WISelectable extends WComponent {
        options: Array<string | WEntity>;
        select(i: number): this;
    }

    /**
     * Utilities
     */
    export class WUtil {
        static toArrayComponent(a: any): WComponent[] {
            if (!a) return [];
            if (Array.isArray(a) && a.length) {
                if (a[0] instanceof WComponent) return a as WComponent[];
                return [];
            }
            let r = [];
            if (a instanceof WComponent) r.push(a);
            return r;
        }

        static hasComponents(a: any): boolean {
            if (!a) return false;
            if (Array.isArray(a) && a.length) {
                if (a[0] instanceof WComponent) return true;
                return false;
            }
            if (a instanceof WComponent) return true;
            return false;
        }

        static toArray(a: any): any[] {
            if (a instanceof WComponent) a = a.getState();
            if (a == null) return [];
            if (Array.isArray(a)) return a as any[];
            let r = [];
            r.push(a);
            return r;
        }

        static toArrayNumber(a: any, nz?: boolean): number[] {
            if (a instanceof WComponent) a = a.getState();
            if (a == null) return [];
            let r: number[] = [];
            if (Array.isArray(a)) {
                for (let e of a) {
                    let n = WUtil.toNumber(e);
                    if (nz && !n) continue;
                    r.push(n);
                }
            }
            else {
                let n = WUtil.toNumber(a);
                if (nz && !n) return r;
                r.push(n);
            }
            return r;
        }

        static toArrayString(a: any, ne?: boolean): string[] {
            if (a instanceof WComponent) a = a.getState();
            if (a == null) return [];
            let r: string[] = [];
            if (Array.isArray(a)) {
                for (let e of a) {
                    let s = WUtil.toString(e);
                    if (ne && !s) continue;
                    r.push(s);
                }
            }
            else {
                let s = WUtil.toString(a);
                if (ne && !s) return r;
                r.push(WUtil.toString(a));
            }
            return r;
        }

        static splitNumbers(a: any, s: string): number[] {
            if (!a) return [];
            let sa = WUtil.toString(a);
            let aos = sa.split(s);
            let r: number[] = [];
            for (let e of aos) {
                r.push(WUtil.toNumber(e));
            }
            return r;
        }

        static toObject<T>(a: any, d?: T): T {
            if (a instanceof WComponent) a = a.getState();
            if (a == null) return d;
            if (typeof a == 'object') return a as T;
            return d;
        }

        static toString(a: any, d: string = ''): string {
            if (a instanceof WComponent) a = a.getState();
            if (a == null) return d;
            if (typeof a == 'string') return a;
            if (a instanceof Date) return WUX.formatDate(a);
            if (typeof a == 'object' && a.id != undefined) return WUtil.toString(a.id, d);
            if (Array.isArray(a) && a.length) return WUtil.toString(a[0], d);
            return '' + a;
        }

        static toText(a: any, d: string = ''): string {
            let r = WUtil.toString(a, d);
            return r.replace('<', '&lt;').replace('>', '&gt;');
        }

        static toNumber(a: any, d: number = 0): number {
            if (a instanceof WComponent) a = a.getState();
            if (a == null) return d;
            if (typeof a == 'number') return a;
            if (a instanceof Date) return a.getFullYear() * 10000 + (a.getMonth() + 1) * 100 + a.getDate();
            if (typeof a == 'object' && a.id != undefined) return WUtil.toNumber(a.id, d);
            if (Array.isArray(a) && a.length) return WUtil.toNumber(a[0], d);
            let s = ('' + a).trim();
            if (s.indexOf('.') >= 0 && s.indexOf(',') >= 0) s = s.replace('.', '');
            s = s.replace(',', '.');
            let n = s.indexOf('.') >= d ? parseFloat(s) : parseInt(s);
            return isNaN(n) ? d : n; 
        }

        static toInt(a: any, d: number = 0): number {
            if (a instanceof WComponent) a = a.getState();
            if (a == null) return d;
            if (typeof a == 'number') return Math.floor(a);
            if (a instanceof Date) return a.getFullYear() * 10000 + (a.getMonth() + 1) * 100 + a.getDate();
            if (typeof a == 'object' && a.id != undefined) return WUtil.toInt(a.id, d);
            if (Array.isArray(a) && a.length) return WUtil.toInt(a[0], d);
            let s = ('' + a).replace(',', '.');
            let n = parseInt(s);
            return isNaN(n) ? d : n;
        }

        static toIntTime(a: any, d: number = 0): number {
            if (a instanceof WComponent) a = a.getState();
            if (a == null) return d;
            if (typeof a == 'number') a;
            if (a instanceof Date) return a.getHours() * 100 + a.getMinutes();
            if (Array.isArray(a) && a.length) return WUtil.toIntTime(a[0], d);
            let s = ('' + a).replace(':', '').replace('.', '').replace(',', '');
            let n = parseInt(s);
            return isNaN(n) ? d : n;
        }

        static isNumeric(a: any): a is string | number {
            return !isNaN(a);
        }

        static checkEmail(e: any): string {
            if(!e) return '';
            let s = WUtil.toString(e);
            if(!s) return '';
            if(s.length < 5) return '';
            let a = s.indexOf('@');
            if(a <= 0) return '';
            let d = s.lastIndexOf('.');
            if(d < a) return '';
            return s.trim().toLowerCase();
        }

        static starts(a: any, s: string): boolean {
            if (!a || s == null) return false;
            return WUtil.toString(a).indexOf(s) == 0;
        }

        static ends(a: any, s: string): boolean {
            if (!a || s == null) return false;
            let t = WUtil.toString(a);
            let i = t.lastIndexOf(s);
            if (i < 0) return false;
            return i == t.length - s.length;
        }

        static isEmpty(a: any): boolean {
            if (!a) return true;
            if (Array.isArray(a) && !a.length) return true;
            if (typeof a == 'object') {
                let r = 0;
                for (let k in a) if (a.hasOwnProperty(k)) return false;
                return true;
            }
            return false;
        }

        static toBoolean(a: any, d: boolean = false): boolean {
            if (a instanceof WCheck) a = a.getProps();
            if (a instanceof WComponent) a = a.getState();
            if (a == null) return d;
            if (typeof a == 'boolean') return a;
            if (typeof a == 'string' && a.length) return '1YyTtSs'.indexOf(a.charAt(0)) >= 0;
            return !!d;
        }

        static toDate(a: any, d?: Date): Date {
            if (a instanceof WComponent) a = a.getState();
            if (a == null) return d;
            if (a instanceof Date) return a;
            if (typeof a == 'number') {
                if (a < 10000101) return d;
                return new Date(a / 10000, ((a % 10000) / 100) - 1, (a % 10000) % 100);
            }
            if (typeof a == 'string') {
                if (a.length < 8) return d;
                // WDD, DD/MM/YYYY
                let sd = a.indexOf(',');
                if (sd >= 0) a = a.substring(sd + 1);
                if (a.indexOf('-') > 3) return new Date(a.trim());
                if (this.isNumeric(a)) {
                    let n = parseInt(a as string);
                    if (n < 10000101) return d;
                    return new Date(n / 10000, ((n % 10000) / 100) - 1, (n % 10000) % 100);
                }
                return new Date(a.trim().replace(/(\d{1,2}).(\d{1,2}).(\d{4})/, '$3-$2-$1'));
            }
            return d;
        }

        static getWeek(a?: any): number {
            let d: Date;
            if (a instanceof Date) {
                // Clonare la data altrimenti verra' modificata
                d = new Date(a.getTime());
            }
            else {
                d = WUtil.toDate(a);
            }
            if (!d) d = new Date();
            d.setHours(0, 0, 0, 0);
            // Thursday in current week decides the year.
            d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
            // January 4 is always in week 1.
            var w1 = new Date(d.getFullYear(), 0, 4);
            // Adjust to Thursday in week 1 and count number of weeks from date to week1.
            return 1 + Math.round(((d.getTime() - w1.getTime()) / 86400000 - 3 + (w1.getDay() + 6) % 7) / 7);
        }

        static getParam(name: string, url?: string): string {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
            if (!results) return '';
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }

        static size(a: any): number {
            if (!a) return 0;
            if (Array.isArray(a)) return a.length;
            if (typeof a == 'object') {
                let r = 0;
                for (let k in a) if (a.hasOwnProperty(k)) r++;
                return r;
            }
            return 0;
        }

        static setValue(a: any, k: string, v: any): any {
            if (typeof a == 'object') a[k] = v;
            return a;
        }

        static getValue(a: any, k: string, d?: any): any {
            if (!k) return d;
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
                let sep = k.indexOf('.');
                if (a[k] == null && sep > 0) {
                    let sub = k.substring(0, sep);
                    if (a[sub] == null) return d;
                    return WUtil.getValue(a[sub], k.substring(sep + 1), d);
                }
                return a[k] == null ? d : a[k];
            }
            return d;
        }

        static getItem(a: any, i: number, d?: any): any {
            if (i < 0) return d;
            if (Array.isArray(a)) {
                if (a.length > i) {
                    let r = a[i];
                    return r == null ? d : r;
                }
                return d;
            }
            return d;
        }

        static getEntity(a: any, ...k: string[]): WEntity {
            if (!a) return null;
            let r: WEntity;
            if (Array.isArray(a)) {
                let id = a[0];
                if (!id) return null;
                r = { id: id };
                r.text = WUtil.toString(a[1]);
                if (a[2] != null) r.code = a[2];
                if (a[3] != null) r.group = a[3];
                if (a[4] != null) r.type = a[4];
                if (a[5] != null) r.date = WUtil.toDate(a[5]);
                if (a[6] != null) r.reference = a[6];
                if (a[7] != null) r.value = WUtil.toNumber(a[7]);
                return r;
            }
            if (!k || !k.length) return null;
            if (k[0]) {
                let id = WUtil.getValue(a, k[0]);
                if (!id) return null;
                r = { id: id };
            }
            if (!r) return null;
            if (k[1]) r.text = WUtil.getString(a, k[1]);
            if (k[2]) r.code = WUtil.getValue(a, k[2]);
            if (k[3]) r.group = WUtil.getValue(a, k[3]);
            if (k[4]) r.type = WUtil.getValue(a, k[4]);
            if (k[5]) r.date = WUtil.getDate(a, k[5]);
            if (k[6]) r.reference = WUtil.getValue(a, k[6]);
            if (k[7]) r.value = WUtil.getNumber(a, k[7]);
            return r;
        }

        static toEntity(a: any, m: { id?: string; text?: string; code?: string; group?: string; type?: string; reference?: string; enabled?: string; marked?: string; date?: string; notBefore?: string; expires?: string; icon?: string; color?: string; value?: string }): WEntity {
            if (!a || !m || !m.id) return null;
            let r: WEntity = {
                id: WUtil.getValue(a, m.id)
            };
            if (m.text) r.text = WUtil.getString(a, m.text);
            if (m.code) r.code = WUtil.getValue(a, m.code);
            if (m.group) r.group = WUtil.getValue(a, m.group);
            if (m.type) r.type = WUtil.getValue(a, m.type);
            if (m.reference) r.reference = WUtil.getValue(a, m.reference);
            if (m.enabled) r.enabled = WUtil.getBoolean(a, m.enabled);
            if (m.marked) r.marked = WUtil.getBoolean(a, m.marked);
            if (m.date) r.date = WUtil.getDate(a, m.date);
            if (m.notBefore) r.notBefore = WUtil.getDate(a, m.notBefore);
            if (m.expires) r.expires = WUtil.getDate(a, m.expires);
            if (m.icon) r.icon = WUtil.getString(a, m.icon);
            if (m.color) r.color = WUtil.getString(a, m.color);
            if (m.value) r.value = WUtil.getNumber(a, m.value);
            return r;
        }

        static getFirst(a: any, d?: any): any {
            if (Array.isArray(a)) {
                if (a.length > 0) {
                    let r = a[0];
                    return r == null ? d : r;
                }
                return d;
            }
            return d;
        }

        static getLast(a: any, d?: any): any {
            if (Array.isArray(a)) {
                if (a.length > 0) {
                    let r = a[a.length - 1];
                    return r == null ? d : r;
                }
                return d;
            }
            return d;
        }

        static toCode(a: any, d: any = ''): any {
            if (a instanceof WComponent) a = a.getState();
            if (a == null) return d;
            if (typeof a == 'string') return a;
            // WEntity
            if (typeof a == 'object' && a.code != undefined) return a.code;
            if (Array.isArray(a) && a.length) {
                if (a.length > 1) return a[1];
                return a[0];
            }
            return a;
        }

        static toDesc(a: any, d: string = ''): string {
            if (a instanceof WComponent) a = a.getState();
            if (a == null) return d;
            if (typeof a == 'string') return a;
            // WEntity
            if (typeof a == 'object' && a.text != undefined) return WUtil.toString(a.text, d);
            if (Array.isArray(a) && a.length) {
                return WUtil.toString(a[a.length - 1], d);
            }
            return WUtil.toString(a, d);
        }

        static getNumber(a: any, k: string, d?: number): number {
            return WUtil.toNumber(WUtil.getValue(a, k, d));
        }

        static getInt(a: any, k: string, d?: number): number {
            return WUtil.toInt(WUtil.getValue(a, k, d));
        }

        static getString(a: any, k: string, d?: string, f?: string): string {
            let v = WUtil.getValue(a, k);
            if (v == null) return d;
            if (!f) return WUtil.toString(v);
            if (f == '?') {
                if (typeof v == 'number') {
                    return WUX.formatNum(v);
                }
                else {
                    return WUtil.toString(v);
                }
            }
            if (f == 'c') return WUX.formatCurr(v);
            if (f == 'c5') return WUX.formatCurr5(v);
            if (f == 'n') return WUX.formatNum(v);
            if (f == 'n2') return WUX.formatNum2(v);
            if (f == 'm') return WUX.formatMonth(v);
            if (f == 'd') return WUX.formatDate(v);
            if (f == 'dt') return WUX.formatDateTime(v);
            if (f == 't') return WUX.formatTime(v);
            return WUtil.toString(v);
        }

        static getText(a: any, k: string, d?: string): string {
            return WUtil.toText(WUtil.getValue(a, k, d));
        }

        static getBoolean(a: any, k: string, d?: boolean): boolean {
            return WUtil.toBoolean(WUtil.getValue(a, k, d));
        }

        static getDate(a: any, k: string, d?: Date): Date {
            return WUtil.toDate(WUtil.getValue(a, k, d));
        }

        static getArray(a: any, k: string): any[] {
            return WUtil.toArray(WUtil.getValue(a, k));
        }

        static getArrayNumber(a: any, k: string, nz?: boolean): number[] {
            return WUtil.toArrayNumber(WUtil.getValue(a, k), nz);
        }

        static getArrayString(a: any, k: string, ne?: boolean): string[] {
            return WUtil.toArrayString(WUtil.getValue(a, k), ne);
        }

        static getCode(a: any, k: string, d?: string): any {
            return WUtil.toCode(WUtil.getValue(a, k, d));
        }

        static getDesc(a: any, k: string, d?: string): string {
            return WUtil.toDesc(WUtil.getValue(a, k, d));
        }

        static getObject<T>(a: any, k: string, n?: boolean): T {
            let r = WUtil.toObject<T>(WUtil.getValue(a, k));
            if (!r && n) return {} as T;
            return r;
        }

        static sort(a: any, t: boolean = true, k?: string): any[] {
            if (!a) return [];
            let array = WUtil.toArray(a);
            if (!k) {
                let r = array.sort();
                return t ? r : r.reverse();
            }
            let r = array.sort(function (a, b) {
                let x = WUtil.getValue(a, k); let y = WUtil.getValue(b, k);
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
            return t ? r : r.reverse();
        }

        static find(a: any, k: any, v: any): any {
            if (!a || !k) return null;
            let y = WUtil.toArray(a);
            for (let i of y) {
                let w = WUtil.getValue(i, k);
                if (w instanceof Date && v instanceof Date) {
                    if (w.getTime() == v.getTime()) return i;
                }
                if (w == v) return i;
            }
            return null;
        }

        static indexOf(a: any, k: any, v: any): number {
            if (!a || !k) return -1;
            let y = WUtil.toArray(a);
            for (let i = 0; i < y.length; i++) {
                let w = WUtil.getValue(y[i], k);
                if (w instanceof Date && v instanceof Date) {
                    if (w.getTime() == v.getTime()) return i;
                }
                if (w == v) return i;
            }
            return -1;
        }

        static isSameDate(a: Date, b: Date): boolean {
            let na = this.toNumber(a);
            let nb = this.toNumber(b);
            if (na == nb) return true;
            return false;
        }

        static indexOfDate(a: Date[], v: Date): number {
            if (!a || !v) return -1;
            let vi = WUtil.toNumber(v);
            for (let i = 0; i < a.length; i++) {
                if (!a[i]) continue;
                let ai = WUtil.toNumber(a[i]);
                if (ai == vi) return i;
            }
            return -1;
        }

        static round2(a: any): number {
            if (a == null) return 0;
            let n = WUtil.toNumber(a);
            return (Math.round(n * 100) / 100);
        }

        static floor2(a: any): number {
            if (a == null) return 0;
            let n = WUtil.toNumber(a);
            return (Math.floor(n * 100) / 100);
        }

        static ceil2(a: any): number {
            if (a == null) return 0;
            let n = WUtil.toNumber(a);
            return (Math.ceil(n * 100) / 100);
        }

        static compare2(a: any, b: any): number {
            if (!a && !b) return 0;
            let n = Math.round(WUtil.toNumber(a) * 100);
            let m = Math.round(WUtil.toNumber(b) * 100);
            if (n == m) return 0;
            return n > m ? 1 : -1;
        }

        static compare5(a: any, b: any): number {
            if (!a && !b) return 0;
            let n = Math.round(WUtil.toNumber(a) * 10000);
            let m = Math.round(WUtil.toNumber(b) * 10000);
            if (n == m) return 0;
            return n > m ? 1 : -1;
        }

        static getCurrDate(d?: number, m?: number, y?: number, f?: boolean, l?: boolean): Date {
            let r = new Date();
            r.setHours(0, 0, 0, 0);
            if (d) r.setDate(r.getDate() + d);
            if (m) r.setMonth(r.getMonth() + m);
            if (y) r.setFullYear(r.getFullYear() + y);
            if (f) r.setDate(1);
            if (l) {
                r.setMonth(r.getMonth() + 1);
                r.setDate(0);
            }
            return r;
        }

        static calcDate(r: Date, d?: number, m?: number, y?: number, f?: boolean, l?: boolean): Date {
            r = r ? new Date(r.getTime()) : new Date();
            r.setHours(0, 0, 0, 0);
            if (d) r.setDate(r.getDate() + d);
            if (m) r.setMonth(r.getMonth() + m);
            if (y) r.setFullYear(r.getFullYear() + y);
            if (f) r.setDate(1);
            if (l) {
                r.setMonth(r.getMonth() + 1);
                r.setDate(0);
            }
            return r;
        }

        static timestamp(dt?: any): string {
            let d = dt ? WUtil.toDate(dt) : new Date();
            if (!d) d = new Date();
            let sy = '' + d.getFullYear();
            let nm = d.getMonth() + 1;
            let sm = nm < 10 ? '0' + nm : '' + nm;
            let nd = d.getDate();
            let sd = nd < 10 ? '0' + nd : '' + nd;
            let nh = d.getHours();
            let sh = nh < 10 ? '0' + nh : '' + nh;
            let np = d.getMinutes();
            let sp = np < 10 ? '0' + np : '' + np;
            let ns = d.getSeconds();
            let ss = ns < 10 ? '0' + ns : '' + ns;
            return sy + sm + sd + sh + sp + ss;
        }

        static nvl(...v: any[]): any {
            if (!v || !v) return;
            for (let e of v) {
                if (!e) return e;
            }
            return v[0];
        }

        static eqValues(o1: object, o2: object, ...keys: any[]): boolean {
            if (!o1 && !o2) return true;
            if (!o1 || !o2) return false;
            for (let k of keys) {
                if (o1[k] != o2[k]) return false;
            }
            return true;
        }

        /** (t1 + [s]) + ([b] + t2 + [a]) */
        static cat(t1: any, t2: any, s?: any, b?: any, a?: any): string {
            let s1 = WUtil.toString(t1);
            let s2 = WUtil.toString(t2);
            let ss = WUtil.toString(s);
            let sb = WUtil.toString(b);
            let sa = WUtil.toString(a);
            let r = '';
            if (s1) {
                r += s1;
                if (ss) r += ss;
            }
            if (s2) {
                if (sb) r += sb;
                r += s2;
                if (sa) r += sa;
            }
            return r;
        }

        static col(tuples: any[], i: number, d?: any): any[] {
            let r: any[] = [];
            if (!tuples || !tuples.length) return r;
            for (let e of tuples) {
                r.push(WUtil.getItem(e, i, d));
            }
            return r;
        }

        static getSortedKeys(map: object): any[] {
            if (!map) return [];
            let r = [];
            for (var key in map) {
                if (map.hasOwnProperty(key)) r.push(key);
            }
            return r.sort();
        }

        static diffMinutes(ah: any, al: any): number {
            let dh = WUtil.toDate(ah);
            let dl = WUtil.toDate(al);
            if (!dh) dh = new Date();
            if (!dl) dl = new Date();
            return (dh.getTime() - dl.getTime()) / 60000;
        }

        static diffHours(ah: any, al: any): number {
            let dh = WUtil.toDate(ah);
            let dl = WUtil.toDate(al);
            if (!dh) dh = new Date();
            if (!dl) dl = new Date();
            return (dh.getTime() - dl.getTime()) / 3600000;
        }

        static diffDays(ah: any, al: any): number {
            let dh = WUtil.toDate(ah);
            let dl = WUtil.toDate(al);
            if (!dh) dh = new Date();
            if (!dl) dl = new Date();
            let dt = dh.getTime() - dl.getTime();
            let dv = dt / (3600000 * 24);
            let rt = dt % (3600000 * 24);
            let rh = rt / 60000;
            let r = dv;
            if (rh > 12) { // Passaggio dall'ora solare all'ora legale...
                r++;
            }
            return r;
        }
    }

    /* Global functions */

    export function getId(e: any): string {
        if (!e) return;
        if (e instanceof jQuery) return (e as JQuery).attr('id');
        if (e instanceof WComponent) return (e as WComponent).id;
        if (typeof e == 'string') {
            if (e.indexOf('<') < 0) return e.indexOf('#') == 0 ? e.substring(1) : e;
        }
        if (typeof e == 'object' && !e.id) {
            return '' + e.id;
        }
        let $e = $(e);
        let id = $e.attr('id');
        if (!id) {
            let t = $e.prop("tagName");
            if (t == 'i' || t == 'I') id = $e.parent().attr('id');
        }
        return id;
    }

    export function firstSub(e: any, r?: boolean): string {
        let id = getId(e);
        if (!id) return '';
        let s = id.indexOf('-');
        if (s < 0) return id;
        if (r) return id.substring(s + 1);
        return id.substring(0, s);
    }

    export function lastSub(e: any): string {
        let id = getId(e);
        if (!id) return '';
        let s = id.lastIndexOf('-');
        if (s < 0) return id;
        if (s > 0) {
            let p = id.charAt(s - 1);
            if (p == '-') return id.substring(s);
        }
        return id.substring(s + 1);
    }

    export function getComponent(id: string): WUX.WComponent {
        if (!id) return;
        let $id = $('#' + id);
        if (!$id.length) return;
        return $id.wuxComponent(false);
    }

    export function getRootComponent(c: WUX.WComponent): WUX.WComponent {
        if (!c) return c;
        if (!c.parent) return c;
        return getRootComponent(c.parent);
    }

    export function setProps(id: string, p: any): WUX.WComponent {
        if (!id) return;
        let $id = $('#' + id);
        if (!$id.length) return;
        let c = $id.wuxComponent(false);
        if (!c) return;
        c.setProps(p);
        return c;
    }

    export function getProps(id: string, d?: any): any {
        if (!id) return d;
        let $id = $('#' + id);
        if (!$id.length) return d;
        let c = $id.wuxComponent(false);
        if (!c) return d;
        let p = c.getProps();
        if (p == null) return d;
        return p;
    }

    export function setState(id: string, s: any): WUX.WComponent {
        if (!id) return;
        let $id = $('#' + id);
        if (!$id.length) return;
        let c = $id.wuxComponent(false);
        if (!c) return;
        c.setState(s);
        return c;
    }

    export function getState(id: string, d?: any): any {
        if (!id) return d;
        let $id = $('#' + id);
        if (!$id.length) return d;
        let c = $id.wuxComponent(false);
        if (!c) return d;
        let s = c.getState();
        if (s == null) return d;
        return s;
    }

    export function newInstance(n: string): WUX.WComponent {
        if (!n) return null;
        let s = n.lastIndexOf('.');
        if (s > 0) {
            let ns = n.substring(0, s);
            if (window[ns]) {
                let c = n.substring(s + 1);
                for (let i in window[ns]) {
                    if (i == c) return new window[ns][i];
                }
                return null;
            }
        }
        let p = window[n];
        return (p && p.prototype) ? Object.create(p.prototype) : null;
    }

    export function same(e1: WElement, e2: WElement): boolean {
        if (typeof e1 == 'string' && typeof e2 == 'string') return e1 == e2;
        if (typeof e1 == 'string' || typeof e2 == 'string') return false;
        let id1 = getId(e1);
        let id2 = getId(e2);
        return id1 && id2 && id1 == id2;
    }

    /**
     * Parse content "before<tag>content</tag>after" -> ["before", $("<tag>content</tag>"), "after"]
     * But "text" -> ["", $("<span>text</span>"), ""]
     * 
     * @param s content
     */
    export function parse(s: any): [string, JQuery, string] {
        if (!s) return ['', $('<span></span>'), ''];
        if (typeof s == 'string') {
            if (s.charAt(0) != '<' || s.charAt(s.length - 1) != '>') {
                let st = s.indexOf('<');
                if (st < 0) return ['', $('<span>' + s.replace('>', '&gt;') + '</span>'), ''];
                let et = s.lastIndexOf('>');
                if (et < 0) return ['', $('<span>' + s.replace('<', '&lt;') + '</span>'), ''];
                return [s.substring(0, st), $(s.substring(st, et + 1)), s.substring(et + 1)];
            }
            return ['', $(s), ''];
        }
        else if (s instanceof jQuery) {
            return ['', s as JQuery, ''];
        }
        return ['', $('<span>' + s + '</span>'), ''];
    }

    /**
     * Split content "before<>content<>after" -> ["before", "content", "after"] 
     * As well " content " -> ["&nbsp;", "content", "&nbsp;"]
     *
     * @param s content
     */
    export function divide(s: string): [string, string, string] {
        if (!s) return ['', '', ''];
        if (s == ' ') return ['', '&nbsp;', ''];
        let b = s.charAt(0) == ' ' ? '&nbsp;' : '';
        let a = s.length > 1 && s.charAt(s.length - 1) == ' ' ? '&nbsp;' : '';
        let ss = s.trim().split('<>');
        if (!ss || ss.length < 2) return [b, s.trim(), a];
        b += ss[0];
        if (ss.length == 2) return [b, ss[1], ''];
        a += ss[2];
        return [b, ss[1], a];
    }

    /**
     * Convert to string for log trace.
     *
     * @param a any
     */
    export function str(a: any): string {
        if (a instanceof WComponent) {
            let wcdn = a.name;
            let wcid = a.id;
            if (!wcdn) wcdn = 'WComponent';
            if (!wcid) return wcdn;
            return wcdn + '(' + wcid + ')';
        }
        if (a instanceof jQuery) {
            if ((a as JQuery).length) {
                let id = (a as JQuery).attr("id") ? ' id=' + (a as JQuery).attr("id") : '';
                return (a as JQuery).selector ? '$("' + (a as JQuery).selector + '")' : '$(<' + (a as JQuery).prop("tagName") + id + '>)';
            }
            else {
                return '$("' + (a as JQuery).selector + '").length=0';
            }
        }
        if (typeof a == 'object') return JSON.stringify(a);
        return a + '';
    }

    export function getTagName(c: any): string {
        if (!c) return '';
        if (c instanceof WComponent) {
            let r = c.rootTag;
            if (r) return r.toLowerCase();
            let root = c.getRoot();
            if (!root) return WUX.getTagName(root);
            return '';
        }
        else if (c instanceof jQuery) {
            if ((c as JQuery).length) {
                let r = (c as JQuery).prop("tagName");
                if (r) return ('' + r).toLowerCase();
                return '';
            }
        }
        else {
            let s = '' + c;
            if (s.charAt(0) == '<') {
                let e = s.indexOf(' ');
                if (e < 0) e = s.indexOf('>');
                if (e > 0) {
                    let r = s.substring(1, e).toLowerCase();
                    if (r.charAt(r.length - 1) == '/') return r.substring(0, r.length - 1);
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

    export function match(i: any, o: string | WEntity): boolean {
        if (!o) return !i;
        if (i == null) return typeof o == 'string' ? o == '' : !o.id;
        if (typeof i == 'object') return typeof o == 'string' ? o == i.id : o.id == i.id;
        return typeof o == 'string' ? o == i : o.id == i;
    }

    export function hashCode(a: any): number {
        if (!a) return 0;
        let s = '' + a;
        let h = 0, l = s.length, i = 0;
        if (l > 0)
            while (i < l)
                h = (h << 5) - h + s.charCodeAt(i++) | 0;
        return h;
    }

    export interface WStyle {
        /** border */
        b?: string;
        /** border-collapse */
        bc?: 'separate' | 'collapse' | 'initial' | 'inherit' | 'unset';
        /** border-spacing */
        bsp?: string | number;
        /** border-radius */
        br?: string | number;
        /** box-shadow */
        bs?: string;
        /** box-sizing */
        bz?: 'content-box' | 'border-box';
        /** margin */
        m?: string | number;
        /** margin-top */
        mt?: string | number;
        /** margin-right */
        mr?: string | number;
        /** margin-bottom */
        mb?: string | number;
        /** margin-left */
        ml?: string | number;
        /** padding */
        p?: string | number;
        /** padding-top */
        pt?: string | number;
        /** padding-right */
        pr?: string | number;
        /** padding-bottom */
        pb?: string | number;
        /** padding-left */
        pl?: string | number;
        /** text-align */
        a?: 'left' | 'right' | 'center' | 'justify' | 'inherit';
        /** vertical-align */
        v?: string;
        /** display */
        d?: 'inline' | 'block' | 'flex' | 'inline-block' | 'inline-flex' | 'inline-table' | 'list-item' | 'run-in' | 'table' | 'table-caption' | 'table-column-group' | 'table-header-group' | 'table-footer-group' | 'table-row-group' | 'table-cell' | 'table-column' | 'table-row' | 'none' | 'initial' | 'inherit';
        /** z-index */
        z?: string | number;
        /** color */
        c?: string;
        /** background(-color) */
        bg?: string;
        /** background-image */
        bgi?: string;
        /** background-repeat */
        bgr?: 'repeat' | 'space' | 'round' | 'repeat-x' | 'repeat-y' | 'no-repeat' | 'initial' | 'inherit' | 'unset';
        /** background-position */
        bgp?: string;
        /** cursor */
        cr?: string;
        /** content */
        cn?: string;
        /** font(-size) */
        f?: string | number;
        /** font-style */
        fs?: 'normal' | 'italic' | 'oblique' | 'inherit';
        /** font-weight */
        fw?: 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'inherit';
        /** text-transform */
        tt?: 'capitalize' | 'uppercase' | 'lowercase' | 'none' | 'initial' | 'inherit';
        /** transform */
        tr?: string;
        /** float */
        fl?: 'left' | 'right' | 'none' | 'initial' | 'inherit';
        /** clear */
        cl?: 'left' | 'right' | 'both' | 'none' | 'initial' | 'inherit';
        /** overflow */
        o?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit';
        /** overflow-x */
        ox?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit';
        /** overflow-y */
        oy?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit';
        /** opacity */
        op?: number;
        /** outline */
        ol?: number;
        /** text(-decoration) */
        text?: string;
        /** -webkit -moz -o -ms */
        k?: string
        /** line-height */
        lh?: string;
        /** position */
        ps?: 'absolute' | 'fixed' | 'inherit' | 'initial' | 'relative' | 'static' | 'sticky' | 'unset';
        /** left */
        l?: string | number;
        /** right */
        r?: string | number;
        /** top */
        t?: string | number;
        /** bottom */
        bt?: string | number;
        /** width */
        w?: string | number;
        /** height */
        h?: string | number;
        /** min-width */
        minw?: string | number;
        /** max-width */
        maxw?: string | number;
        /** min-height */
        minh?: string | number;
        /** max-height */
        maxh?: string | number;
        /** white-space */
        ws?: 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap' | 'initial' | 'inherit';
        /** style */
        s?: string;
        /** class name */
        n?: string;
    }

    export function styleObj(ws: string | WStyle): { [key: string]: string } {
        let s = style(ws);
        let r: { [key: string]: string } = {};
        if (!s) return r;
        let kvs = s.split(';');
        for (let kv of kvs) {
            let akv = kv.split(':')
            if (akv.length < 2) continue;
            r[akv[0].trim()] = akv[1].trim();
        }
        return r;
    }

    export function style(ws: string | WStyle): string {
        let s = '';
        if (!ws) return s;
        if (typeof ws == 'string') {
            if (ws.indexOf(':') <= 0) return '';
            if (ws.charAt(ws.length - 1) != ';') return ws + ';';
            return ws;
        }
        if (ws.s) s += css(ws.s);
        if (ws.fs) s += 'font-style:' + ws.fs + ';';
        if (ws.fw) s += 'font-weight:' + ws.fw + ';';
        if (ws.tt) s += 'text-transform:' + ws.tt + ';';
        if (ws.tr) s += 'transform:' + ws.tr + ';';
        if (ws.fl) s += 'float:' + ws.fl + ';';
        if (ws.cl) s += 'clear:' + ws.cl + ';';
        if (ws.a) s += 'text-align:' + ws.a + ';';
        if (ws.c) s += 'color:' + ws.c + ';';
        if (ws.v) s += 'vertical-align:' + ws.v + ';';
        if (ws.d) s += 'display:' + ws.d + ';';
        if (ws.z) s += 'z-index:' + ws.z + ';';
        if (ws.lh) s += 'line-height:' + ws.lh + ';';
        if (ws.ps) s += 'position:' + ws.ps + ';';
        if (ws.o) s += 'overflow:' + ws.o + ';';
        if (ws.ox) s += 'overflow-x:' + ws.ox + ';';
        if (ws.oy) s += 'overflow-y:' + ws.oy + ';';
        if (ws.op != null) s += 'opacity:' + ws.op + ';';
        if (ws.ol != null) s += 'outline:' + ws.ol + ';';
        if (ws.cr) s += 'cursor:' + ws.cr + ';';
        if (ws.cn) s += 'content:' + ws.cn + ';';
        if (ws.k && ws.k.indexOf(':') > 0) s += ws.k.charAt(0) == '-' ? '-webkit' + ws.k + ';' : '-webkit-' + ws.k + ';';
        if (ws.k && ws.k.indexOf(':') > 0) s += ws.k.charAt(0) == '-' ? '-moz' + ws.k + ';' : '-moz-' + ws.k + ';';
        if (ws.k && ws.k.indexOf(':') > 0) s += ws.k.charAt(0) == '-' ? '-o' + ws.k + ';' : '-o-' + ws.k + ';';
        if (ws.k && ws.k.indexOf(':') > 0) s += ws.k.charAt(0) == '-' ? '-ms' + ws.k + ';' : '-ms-' + ws.k + ';';
        if (ws.bs) s += 'box-shadow:' + ws.bs + ';';
        if (ws.bz) s += 'box-sizing:' + ws.bz + ';';
        if (ws.b) s += ws.b.indexOf(':') > 0 ? css('border' + ws.b) : ws.b.match(/^(|none|inherit|initial|unset)$/) ? 'border:' + ws.b + ';' : ws.b.indexOf(' ') > 0 ? 'border:' + ws.b + ';' : 'border:1px solid ' + ws.b + ';';
        if (ws.bc) s += 'border-collapse:' + ws.bc + ';';
        if (ws.br != null) s += typeof ws.br == 'number' ? 'border-radius:' + ws.br + 'px;' : 'border-radius:' + ws.br + ';'
        if (ws.bsp != null) s += typeof ws.bsp == 'number' ? 'border-spacing:' + ws.bsp + 'px;' : 'border-spacing:' + ws.bsp + ';'
        if (ws.m != null) s += typeof ws.m == 'number' ? 'margin:' + ws.m + 'px;' : ws.m.indexOf(':') > 0 ? css('margin' + ws.m) : 'margin:' + ws.m + ';';
        if (ws.mt != null) s += typeof ws.mt == 'number' ? 'margin-top:' + ws.mt + 'px;' : 'margin-top:' + ws.mt + ';';
        if (ws.mr != null) s += typeof ws.mr == 'number' ? 'margin-right:' + ws.mr + 'px;' : 'margin-right:' + ws.mr + ';';
        if (ws.mb != null) s += typeof ws.mb == 'number' ? 'margin-bottom:' + ws.mb + 'px;' : 'margin-bottom:' + ws.mb + ';';
        if (ws.ml != null) s += typeof ws.ml == 'number' ? 'margin-left:' + ws.ml + 'px;' : 'margin-left:' + ws.ml + ';';
        if (ws.p != null) s += typeof ws.p == 'number' ? 'padding:' + ws.p + 'px;' : ws.p.indexOf(':') > 0 ? css('padding' + ws.p) : 'padding:' + ws.p + ';';
        if (ws.pt != null) s += typeof ws.pt == 'number' ? 'padding-top:' + ws.pt + 'px;' : 'padding-top:' + ws.pt + ';';
        if (ws.pr != null) s += typeof ws.pr == 'number' ? 'padding-right:' + ws.pr + 'px;' : 'padding-right:' + ws.pr + ';';
        if (ws.pb != null) s += typeof ws.pb == 'number' ? 'padding-bottom:' + ws.pb + 'px;' : 'padding-bottom:' + ws.pb + ';';
        if (ws.pl != null) s += typeof ws.pl == 'number' ? 'padding-left:' + ws.pl + 'px;' : 'padding-left:' + ws.pl + ';';
        if (ws.f != null) s += typeof ws.f == 'number' ? 'font-size:' + ws.f + 'px;' : ws.f.indexOf(':') > 0 ? css('font' + ws.f) : 'font-size:' + ws.f + ';';
        if (ws.bg) s += ws.bg.indexOf(':') > 0 ? css('background' + ws.bg) : ws.bg.indexOf('url') >= 0 ? 'background:' + ws.bg + ';' : 'background-color:' + ws.bg + ';';
        if (ws.bgi) s += 'background-image:' + ws.bgi + ';';
        if (ws.bgp) s += 'background-position:' + ws.bgp + ';';
        if (ws.bgr) s += 'background-repeat:' + ws.bgr + ';';
        if (ws.text) s += ws.text.indexOf(':') > 0 ? css('text' + ws.text) : 'text-decoration:' + ws.text + ';';
        if (ws.l != null) s += typeof ws.l == 'number' ? 'left:' + ws.l + 'px;' : 'left:' + ws.l + ';'
        if (ws.r != null) s += typeof ws.r == 'number' ? 'right:' + ws.r + 'px;' : 'right:' + ws.r + ';'
        if (ws.t != null) s += typeof ws.t == 'number' ? 'top:' + ws.t + 'px;' : 'top:' + ws.t + ';'
        if (ws.bt != null) s += typeof ws.bt == 'number' ? 'bottom:' + ws.bt + 'px;' : 'bottom:' + ws.bt + ';'
        if (ws.w) s += typeof ws.w == 'number' ? 'width:' + ws.w + 'px;' : 'width:' + ws.w + ';'
        if (ws.h) s += typeof ws.h == 'number' ? 'height:' + ws.h + 'px;' : 'height:' + ws.h + ';'
        if (ws.minw) s += typeof ws.minw == 'number' ? 'min-width:' + ws.minw + 'px;' : 'min-width:' + ws.minw + ';'
        if (ws.maxw) s += typeof ws.maxw == 'number' ? 'max-width:' + ws.maxw + 'px;' : 'max-width:' + ws.maxw + ';'
        if (ws.minh) s += typeof ws.minh == 'number' ? 'min-height:' + ws.minh + 'px;' : 'min-height:' + ws.minh + ';'
        if (ws.maxh) s += typeof ws.maxh == 'number' ? 'max-height:' + ws.maxh + 'px;' : 'max-height:' + ws.maxh + ';'
        if (ws.ws) s += 'white-space:' + ws.ws + ';';
        return s;
    }

    export function addStyle(s: string, k: string, v: string, n?: boolean): string {
        if (!k || !v) return css(s);
        if (!s) return k + ':' + v + ';';
        if (n) {
            if (s.indexOf(k + ':') >= 0) return css(s);
            return css(s) + k + ':' + v + ';';
        }
        return css(s) + k + ':' + v + ';';
    }

    export function css(...a: (string | WStyle)[]): string {
        if (!a || a.length == 0) return '';
        let s = '';
        let x: WStyle = {};
        let xi = true;
        for (let i = 0; i < a.length; i++) {
            let e = a[i];
            if (!e) continue;
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
                if (e.charAt(e.length - 1) != ';') s += ';'
            }
        }
        if (!xi) s += style(x);
        return s;
    }

    export function cls(...a: (string | WStyle)[]): string {
        if (!a || !a.length) return '';
        let s = '';
        for (let i = 0; i < a.length; i++) {
            let e = a[i];
            if (!e) continue;
            let se = typeof e == 'string' ? e : e.n;
            if (!se) continue;
            if (se.indexOf(':') > 0) continue;
            s += se + ' ';
        }
        return s.trim();
    }

    export function attributes(a: any): string {
        if (!a) return '';
        if (typeof a == 'string') return a;
        if (typeof a == 'object') {
            let r = '';
            for (var k in a) r += k + '="' + a[k] + '" ';
            return r.trim();
        }
        return '';
    }

    export function ul(css: string | WStyle, ...a: string[]): string {
        if (!a || !a.length) return '';
        let s = css ? '<ul' + buildCss(css) + '>' : '<ul>';
        for (let i = 0; i < a.length; i++) {
            let e = a[i];
            if (e == null) continue;
            s += '<li>' + e + '</li>';
        }
        s += '</ul>'
        return s;
    }

    export function ol(css: string | WStyle, start: number, ...a: string[]): string {
        if (!a || !a.length) return '';
        let s = '';
        if (start != null) {
            s = css ? '<ol' + buildCss(css) + ' start="' + start + '">' : '<ol start="' + start + '">';
        }
        else {
            s = css ? '<ol' + buildCss(css) + '>' : '<ol>';
        }
        for (let i = 0; i < a.length; i++) {
            let e = a[i];
            if (e == null) continue;
            s += '<li>' + e + '</li>';
        }
        s += '</ol>'
        return s;
    }

    export function buildCss(...a: (string | WStyle)[]): string {
        if (!a || !a.length) return '';
        let c = cls(...a);
        let s = css(...a);
        let r = '';
        if (c) r += ' class="' + c + '"';
        if (s) r += ' style="' + s + '"';
        return r;
    }

    export function removeClass(css: string, name: string): string {
        if (!css || !name) return css;
        let classes = css.split(' ');
        let r = '';
        for (let c of classes) {
            if (c == name) continue;
            r += c + ' ';
        }
        return r.trim();
    }

    export function toggleClass(css: string, name: string): string {
        if (!css) return name;
        if (!name) return css;
        let classes = css.split(' ');
        let f = false;
        let r = '';
        for (let c of classes) {
            if (c == name) {
                f = true;
                continue;
            }
            r += c + ' ';
        }
        if (!f) return r.trim() + ' ' + name;
        return r.trim();
    }

    export function setCss(e: WComponent | JQuery, ...a: (string | WStyle)[]): WComponent | JQuery {
        if (!e || !a || !a.length) return e;
        if (e instanceof WComponent) {
            e.css(...a);
        }
        else if (e instanceof jQuery) {
            if (!e.length) return e;
            let s = css(...a);
            let c = cls(...a);
            if (c) e.addClass(c);
            if (s) e.css(styleObj(s));
        }
        return e;
    }

    export function buildIcon(icon: string, before?: string, after?: string, size?: number, cls?: string, title?: string): string {
        if (!icon) return '';
        if (!before) before = '';
        if (!after) after = '';
        let t = title ? ' title="' + title + '"' : '';
        cls = cls ? ' ' + cls : '';
        if (icon.indexOf('.') > 0) return before + '<img src="' + icon + '"' + t + '>' + after;
        if (!size || size < 2) return before + '<i class="fa ' + icon + cls + '"' + t + '></i>' + after;
        if (size > 5) size = 5;
        return before + '<i class="fa ' + icon + ' fa-' + size + 'x' + cls + '"' + t + '></i>' + after;
    }

    export function build(tagName: string, inner?: string, css?: string | WStyle, attributes?: string | object, id?: string, classStyle?: string): string {
        if (!tagName) tagName = 'div';
        let clsStyle: string;
        let style: string;
        if (typeof css == 'string') {
            if (css.indexOf(':') > 0) {
                style = css;
            }
            else {
                clsStyle = css;
            }
        }
        else if (css) {
            if (css.n) clsStyle = css.n;
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
        let r = '<' + tagName;
        if (id) r += ' id="' + id + '"';
        if (clsStyle) r += ' class="' + clsStyle + '"';
        if (style) r += ' style="' + style + '"';
        let a = WUX.attributes(attributes);
        if (a) r += ' ' + a;
        r += '>';
        let bca = divide(inner);
        r += bca[1];
        if (tagName == 'input') return bca[0] + r + bca[2];
        r += '</' + tagName + '>';
        return bca[0] + r + bca[2];
    }

    export function addWrapper(n: JQuery, w: WWrapper, b?: string, e?: string): JQuery {
        if (!n || !w) return n;
        let cls = WUX.cls(w.classStyle, w.style);
        let style = WUX.style(w.style);
        let t = w.type ? w.type : 'div';
        let r = '<' + t;
        if (w.id) r += ' id="' + w.id + '"';
        if (cls) r += ' class="' + cls + '"';
        if (style) r += ' style="' + style + '"';
        let a = WUX.attributes(attributes);
        if (a) r += ' ' + a;
        if (w.title) r += ' title="' + w.title + '"';
        r += '>';
        r += '</' + t + '>';
        let $r = $(r);
        w.element = $r;
        if (b) n.append(b);
        n.append($r);
        if (e) n.append(e);
        if (w.wrapper) return WUX.addWrapper($r, w.wrapper, w.begin, w.end);
        if (w.begin) $r.append(w.begin);
        if (w.end) $r.append(w.end);
        return $r;
    }

    export function val(e: any, v?: any): any {
        if (!e) return;
        if (typeof e == 'string') {
            if (e.indexOf('<') >= 0) return;
            if (e.indexOf('#') < 0) e = '#' + e;
            let c = WUX.getComponent(e);
            if (c) {
                if (v === undefined) return c.getState();
                c.setState(v);
            }
            else {
                if (v === undefined) return $(e).val();
                $(e).val(v);
            }
        }
        else if (e instanceof WComponent) {
            if (v === undefined) return e.getState();
            e.setState(v);
        }
        else if (e instanceof jQuery) {
            if (v === undefined) return (e as JQuery).val();
            (e as JQuery).val(v);
        }
        else {
            if (v === undefined) return $(e).val();
            $(e).val(v);
        }
        return v;
    }

    export function getContainer(e: WElement, s: string = 'div'): JQuery {
        if (!e) return;
        if (typeof e == 'string') {
            if (e.indexOf('<') >= 0) return;
            if (e.indexOf('#') < 0) e = '#' + e;
            return WUX.getContainer($(e));
        }
        else if (e instanceof WComponent) {
            let $c = e.getContext();
            if ($c) {
                let $r = $c.closest(s);
                if ($r && $r.length) return $r;
            }
            return $c;
        }
        else {
            let $r = e.parent().closest(s);
            if ($r && $r.length) return $r;
            return e.parent();
        }
    }
 
    export function openURL(url: string, history: boolean = true, newTab: boolean = false, params?: any) {
        if (!url) return;
        if (params && typeof params == 'object') {
            let qs = '';
            for (let p in params) {
                if (params.hasOwnProperty(p)) {
                    let v = params[p];
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
}